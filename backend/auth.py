"""Admin authentication with TOTP (Google Authenticator / Authy style)."""
import os
from datetime import datetime, timezone, timedelta
from typing import Optional

import jwt
import pyotp
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 8  # 8 hours session


def _jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def _admin_username() -> str:
    return os.environ.get("ADMIN_USERNAME", "Shintergyadmin")


def create_access_token(user_id: str, username: str) -> str:
    payload = {
        "sub": user_id,
        "username": username,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


async def seed_admin(db) -> dict:
    """Ensure a single admin user exists with a TOTP secret.
    Returns admin record (including otpauth_url on first seed for logging)."""
    username = _admin_username()
    admin = await db.admin_users.find_one({"username": username})
    if admin:
        return admin
    secret = pyotp.random_base32()
    doc = {
        "username": username,
        "totp_secret": secret,
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.admin_users.insert_one(doc)
    return doc


def build_otpauth_url(secret: str, username: str, issuer: str = "Shintergy") -> str:
    return pyotp.TOTP(secret).provisioning_uri(name=username, issuer_name=issuer)


class LoginRequest(BaseModel):
    username: str
    code: str  # 6-digit TOTP


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(request: Request, body: LoginRequest):
    db = request.state.db
    admin = await db.admin_users.find_one({"username": body.username})
    if not admin:
        raise HTTPException(status_code=401, detail="Usuario o código incorrecto")
    totp = pyotp.TOTP(admin["totp_secret"])
    if not totp.verify(body.code, valid_window=1):
        raise HTTPException(status_code=401, detail="Usuario o código incorrecto")
    token = create_access_token(str(admin.get("_id") or admin["username"]), admin["username"])
    return LoginResponse(access_token=token, username=admin["username"])


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token: Optional[str] = None
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")
        db = request.state.db
        admin = await db.admin_users.find_one({"username": payload["username"]})
        if not admin:
            raise HTTPException(status_code=401, detail="Usuario no existe")
        admin["_id"] = str(admin["_id"])
        admin.pop("totp_secret", None)
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesión expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


@router.get("/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


class SecretResetResponse(BaseModel):
    otpauth_url: str
    secret: str


@router.post("/rotate-totp", response_model=SecretResetResponse)
async def rotate_totp(request: Request, admin: dict = Depends(get_current_admin)):
    """Generate a NEW TOTP secret (for re-setup if the admin lost their device)."""
    db = request.state.db
    new_secret = pyotp.random_base32()
    await db.admin_users.update_one(
        {"username": admin["username"]}, {"$set": {"totp_secret": new_secret}}
    )
    return SecretResetResponse(
        otpauth_url=build_otpauth_url(new_secret, admin["username"]),
        secret=new_secret,
    )
