"""Backend tests for admin auth (TOTP), content CMS, and image upload."""
import io
import os
import time

import pyotp
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://land-sales-pro.preview.emergentagent.com").rstrip("/")
TOTP_SECRET = "KHXP3AGX6ZQRL5UML6HZARPOUOCNBNIN"
ADMIN_USERNAME = "Shintergyadmin"


def _current_code() -> str:
    return pyotp.TOTP(TOTP_SECRET).now()


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    code = _current_code()
    r = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"username": ADMIN_USERNAME, "code": code},
        timeout=15,
    )
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


# ---------- AUTH ----------
class TestAuth:
    def test_login_success(self, session):
        code = _current_code()
        r = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": ADMIN_USERNAME, "code": code},
        )
        assert r.status_code == 200
        body = r.json()
        assert "access_token" in body
        assert body["username"] == ADMIN_USERNAME
        assert body["token_type"] == "bearer"
        assert isinstance(body["access_token"], str) and len(body["access_token"]) > 20

    def test_login_invalid_code(self, session):
        r = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": ADMIN_USERNAME, "code": "000000"},
        )
        assert r.status_code == 401

    def test_login_invalid_user(self, session):
        r = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": "noexiste", "code": _current_code()},
        )
        assert r.status_code == 401

    def test_me_with_token(self, session, admin_token):
        r = session.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        body = r.json()
        assert body["username"] == ADMIN_USERNAME
        assert "totp_secret" not in body  # must be stripped

    def test_me_without_token(self, session):
        r = session.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_invalid_token(self, session):
        r = session.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"},
        )
        assert r.status_code == 401


# ---------- CONTENT ----------
class TestContent:
    def test_get_content_public(self, session):
        r = session.get(f"{BASE_URL}/api/content")
        assert r.status_code == 200
        data = r.json()
        for key in [
            "company", "social", "hero", "maquina",
            "zonasCobertura", "advantages", "workProcess", "galleryImages",
        ]:
            assert key in data, f"missing key: {key}"
        assert data["company"]["name"]
        assert isinstance(data["zonasCobertura"], list)

    def test_put_content_no_token(self, session):
        r = session.put(f"{BASE_URL}/api/content", json={"data": {"company": {"name": "x"}}})
        assert r.status_code == 401

    def test_put_content_with_token(self, session, admin_token):
        # Get current
        cur = session.get(f"{BASE_URL}/api/content").json()
        original_name = cur["company"]["name"]
        # Modify
        cur["company"]["name"] = "TEST_Shintergy_Modified"
        r = session.put(
            f"{BASE_URL}/api/content",
            json={"data": cur},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        assert r.json().get("success") is True
        # Verify persistence
        cur2 = session.get(f"{BASE_URL}/api/content").json()
        assert cur2["company"]["name"] == "TEST_Shintergy_Modified"
        # Restore
        cur2["company"]["name"] = original_name
        r2 = session.put(
            f"{BASE_URL}/api/content",
            json={"data": cur2},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r2.status_code == 200

    def test_reset_content(self, session, admin_token):
        r = session.post(
            f"{BASE_URL}/api/content/reset",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        body = r.json()
        assert body.get("success") is True
        assert body["data"]["company"]["name"] == "Shíntergy"
        # Verify GET returns default
        cur = session.get(f"{BASE_URL}/api/content").json()
        assert cur["company"]["name"] == "Shíntergy"

    def test_reset_content_no_token(self, session):
        r = session.post(f"{BASE_URL}/api/content/reset")
        assert r.status_code == 401


# ---------- IMAGES ----------
PNG_1x1 = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xfc\xff"
    b"\xff?\x03\x00\x07\x06\x02\x9b\x81\xea\xae\xa3\x00\x00\x00\x00IEND\xaeB`\x82"
)


class TestImages:
    uploaded_id = None

    def test_upload_no_token(self, session):
        r = session.post(
            f"{BASE_URL}/api/images/upload",
            files={"file": ("t.png", io.BytesIO(PNG_1x1), "image/png")},
        )
        assert r.status_code == 401

    def test_upload_png(self, session, admin_token):
        r = session.post(
            f"{BASE_URL}/api/images/upload",
            files={"file": ("test.png", io.BytesIO(PNG_1x1), "image/png")},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert "id" in body and "url" in body
        assert body["mime_type"] == "image/png"
        TestImages.uploaded_id = body["id"]

    def test_get_uploaded_image(self, session):
        assert TestImages.uploaded_id, "depends on previous test"
        r = session.get(f"{BASE_URL}/api/images/{TestImages.uploaded_id}")
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("image/png")
        assert len(r.content) == len(PNG_1x1)

    def test_upload_invalid_mime(self, session, admin_token):
        r = session.post(
            f"{BASE_URL}/api/images/upload",
            files={"file": ("t.txt", io.BytesIO(b"not an image"), "text/plain")},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 400

    def test_upload_oversize(self, session, admin_token):
        # 6MB+ payload
        big = b"\x00" * (6 * 1024 * 1024 + 100)
        r = session.post(
            f"{BASE_URL}/api/images/upload",
            files={"file": ("big.png", io.BytesIO(big), "image/png")},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 400

    def test_list_images_requires_auth(self, session):
        r = session.get(f"{BASE_URL}/api/images")
        assert r.status_code == 401

    def test_list_images_with_auth(self, session, admin_token):
        r = session.get(
            f"{BASE_URL}/api/images",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_delete_image(self, session, admin_token):
        assert TestImages.uploaded_id
        r = session.delete(
            f"{BASE_URL}/api/images/{TestImages.uploaded_id}",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        # confirm gone
        r2 = session.get(f"{BASE_URL}/api/images/{TestImages.uploaded_id}")
        assert r2.status_code == 404

    def test_delete_image_no_token(self, session):
        r = session.delete(f"{BASE_URL}/api/images/some-id")
        assert r.status_code == 401
