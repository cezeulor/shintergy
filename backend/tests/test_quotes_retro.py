"""Backend tests for Shíntergy retroexcavadora quote API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://land-sales-pro.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Health check
def test_root_health(api):
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert "message" in r.json()


# Pricing logic - day
def test_quote_create_retro_day(api):
    payload = {
        "service_type": "retroexcavadora",
        "rental_duration": "day",
        "additional_services": [],
        "location": "Xalapa",
        "contact_info": {
            "name": "TEST_Cliente Day",
            "email": "cezeulor123@gmail.com",
            "phone": "2281200243",
        },
    }
    r = api.post(f"{BASE_URL}/api/quotes/create", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    # base 5800 + IVA 16% = 6728
    assert data["success"] is True
    assert "quote_id" in data
    assert data["total_price"] == pytest.approx(6728.0, rel=0.01)


def test_quote_create_retro_week(api):
    payload = {
        "service_type": "retroexcavadora",
        "rental_duration": "week",
        "additional_services": [],
        "location": "Coatepec",
        "contact_info": {
            "name": "TEST_Cliente Week",
            "email": "cezeulor123@gmail.com",
            "phone": "2281200243",
        },
    }
    r = api.post(f"{BASE_URL}/api/quotes/create", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    # 31320 * 1.16 = 36331.2
    assert data["total_price"] == pytest.approx(36331.2, rel=0.01)


def test_quote_create_retro_month(api):
    payload = {
        "service_type": "retroexcavadora",
        "rental_duration": "month",
        "additional_services": [],
        "location": "Xalapa",
        "contact_info": {
            "name": "TEST_Cliente Month",
            "email": "cezeulor123@gmail.com",
            "phone": "2281200243",
        },
    }
    r = api.post(f"{BASE_URL}/api/quotes/create", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    # 120000 * 1.16 = 139200
    assert data["total_price"] == pytest.approx(139200.0, rel=0.01)


# Persistence: Create -> GET
def test_quote_persistence(api):
    payload = {
        "service_type": "retroexcavadora",
        "rental_duration": "day",
        "additional_services": [],
        "location": "TEST_Persistence",
        "contact_info": {
            "name": "TEST_Persistence",
            "email": "cezeulor123@gmail.com",
            "phone": "2281200243",
        },
    }
    r = api.post(f"{BASE_URL}/api/quotes/create", json=payload)
    assert r.status_code == 200
    qid = r.json()["quote_id"]

    g = api.get(f"{BASE_URL}/api/quotes/{qid}")
    assert g.status_code == 200
    fetched = g.json()
    assert fetched["id"] == qid
    assert fetched["service_type"] == "retroexcavadora"
    assert fetched["location"] == "TEST_Persistence"
    assert "_id" not in fetched  # MongoDB ObjectId must not leak


def test_quote_list(api):
    r = api.get(f"{BASE_URL}/api/quotes?limit=5")
    assert r.status_code == 200
    data = r.json()
    assert "quotes" in data
    assert "total" in data
    assert isinstance(data["quotes"], list)
    for q in data["quotes"]:
        assert "_id" not in q


def test_quote_get_404(api):
    r = api.get(f"{BASE_URL}/api/quotes/nonexistent-uuid-xxx")
    assert r.status_code == 404
