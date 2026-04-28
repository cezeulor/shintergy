"""Image upload & serve — stores base64 in MongoDB."""
import base64
import io
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import Response

from auth import get_current_admin

router = APIRouter(prefix="/api/images", tags=["images"])

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_BYTES = 6 * 1024 * 1024  # 6 MB


@router.post("/upload")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    admin: dict = Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=400,
            detail=f"Formato no permitido: {file.content_type}. Usa JPG, PNG, WebP o GIF.",
        )
    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="La imagen pesa más de 6 MB")
    image_id = str(uuid.uuid4())
    b64 = base64.b64encode(content).decode("utf-8")
    db = request.state.db
    await db.images.insert_one(
        {
            "id": image_id,
            "filename": file.filename or f"{image_id}.img",
            "mime_type": file.content_type,
            "size": len(content),
            "data_b64": b64,
            "uploaded_by": admin["username"],
            "uploaded_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    backend_url = request.headers.get("x-forwarded-host") or request.headers.get("host")
    scheme = request.headers.get("x-forwarded-proto", request.url.scheme)
    url = f"{scheme}://{backend_url}/api/images/{image_id}"
    return {"id": image_id, "url": url, "size": len(content), "mime_type": file.content_type}


@router.get("/{image_id}")
async def get_image(image_id: str, request: Request):
    db = request.state.db
    img = await db.images.find_one({"id": image_id})
    if not img:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    data = base64.b64decode(img["data_b64"])
    return Response(
        content=data,
        media_type=img.get("mime_type", "image/jpeg"),
        headers={"Cache-Control": "public, max-age=604800"},  # 7 days
    )


@router.delete("/{image_id}")
async def delete_image(
    image_id: str,
    request: Request,
    admin: dict = Depends(get_current_admin),
):
    db = request.state.db
    result = await db.images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    return {"success": True}


@router.get("")
async def list_images(request: Request, admin: dict = Depends(get_current_admin)):
    db = request.state.db
    rows = (
        await db.images.find({}, {"_id": 0, "data_b64": 0})
        .sort("uploaded_at", -1)
        .limit(200)
        .to_list(None)
    )
    return rows
