"""Backend tests for new theme + promotions CMS features (iteration 5)."""
import os
import pyotp
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
TOTP_SECRET = "KHXP3AGX6ZQRL5UML6HZARPOUOCNBNIN"
ADMIN_USERNAME = "Shintergyadmin"


@pytest.fixture(scope="session")
def session():
    return requests.Session()


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"username": ADMIN_USERNAME, "code": pyotp.TOTP(TOTP_SECRET).now()},
        timeout=15,
    )
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(autouse=True, scope="module")
def _reset_after(session):
    yield
    # final cleanup → reset to defaults so other suites don't drift
    code = pyotp.TOTP(TOTP_SECRET).now()
    tok = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"username": ADMIN_USERNAME, "code": code},
        timeout=15,
    ).json().get("access_token")
    if tok:
        session.post(
            f"{BASE_URL}/api/content/reset",
            headers={"Authorization": f"Bearer {tok}"},
        )


# --- THEME ---
class TestTheme:
    def test_get_content_has_theme_keys(self, session):
        r = session.get(f"{BASE_URL}/api/content")
        assert r.status_code == 200
        data = r.json()
        assert "theme" in data, "theme key missing"
        for k in ("primary", "primaryDark", "accent", "accentDark", "bgDark", "bgLight", "bgCream"):
            assert k in data["theme"], f"theme.{k} missing"

    def test_default_theme_values(self, session, admin_token):
        # Reset first
        session.post(
            f"{BASE_URL}/api/content/reset",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        data = session.get(f"{BASE_URL}/api/content").json()
        assert data["theme"]["primary"] == "#0a0a0a"
        assert data["theme"]["accent"] == "#F5C518"

    def test_put_theme_persists(self, session, admin_token):
        cur = session.get(f"{BASE_URL}/api/content").json()
        cur["theme"]["primary"] = "#ff0000"
        cur["theme"]["accent"] = "#00ff00"
        r = session.put(
            f"{BASE_URL}/api/content",
            json={"data": cur},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        # Verify
        new = session.get(f"{BASE_URL}/api/content").json()
        assert new["theme"]["primary"] == "#ff0000"
        assert new["theme"]["accent"] == "#00ff00"


# --- PROMOTIONS ---
class TestPromotions:
    def test_default_promotions(self, session, admin_token):
        session.post(
            f"{BASE_URL}/api/content/reset",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        data = session.get(f"{BASE_URL}/api/content").json()
        assert "promotions" in data
        assert isinstance(data["promotions"], list)
        assert len(data["promotions"]) == 2
        for p in data["promotions"]:
            assert "title" in p and p["title"]
            assert "image" in p and p["image"]
            assert p.get("active") is True

    def test_update_promotions_crud(self, session, admin_token):
        cur = session.get(f"{BASE_URL}/api/content").json()
        cur["promotions"] = [
            {
                "id": 999,
                "title": "TEST_PROMO_NEW",
                "subtitle": "subtitle test",
                "image": "https://x/y.jpg",
                "cta_label": "Cotiza",
                "cta_link": "#servicios",
                "active": True,
            },
            {
                "id": 1000,
                "title": "TEST_HIDDEN",
                "image": "https://x/z.jpg",
                "active": False,
            },
        ]
        r = session.put(
            f"{BASE_URL}/api/content",
            json={"data": cur},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        new = session.get(f"{BASE_URL}/api/content").json()
        assert len(new["promotions"]) == 2
        titles = [p["title"] for p in new["promotions"]]
        assert "TEST_PROMO_NEW" in titles
        assert "TEST_HIDDEN" in titles
        # active flag preserved
        hidden = [p for p in new["promotions"] if p["title"] == "TEST_HIDDEN"][0]
        assert hidden["active"] is False

    def test_reset_restores_promotions_and_theme(self, session, admin_token):
        r = session.post(
            f"{BASE_URL}/api/content/reset",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        data = r.json()["data"]
        assert data["theme"]["primary"] == "#0a0a0a"
        assert data["theme"]["accent"] == "#F5C518"
        assert len(data["promotions"]) == 2
        # also check via GET
        cur = session.get(f"{BASE_URL}/api/content").json()
        assert cur["theme"]["accent"] == "#F5C518"
        assert len(cur["promotions"]) == 2
