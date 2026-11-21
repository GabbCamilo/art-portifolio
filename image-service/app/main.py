from pathlib import Path

import os
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File

from .processing import ALLOWED_PREFIX, MAX_UPLOAD_BYTES, STORAGE_IMAGES, process_image

app = FastAPI(title="Art Portfolio Image Service", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok", "service": "art-portfolio-image-service"}


@app.post("/process")
async def process_upload(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith(ALLOWED_PREFIX):
        raise HTTPException(
            status_code=400,
            detail="Tipo de arquivo inválido: envie uma imagem (image/*)",
        )

    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Arquivo excede o limite de 10 MB",
        )

    safe_name = Path(file.filename).name if file.filename else "upload"
    if not safe_name:
        raise HTTPException(status_code=400, detail="Nome de arquivo inválido")

    STORAGE_IMAGES.mkdir(parents=True, exist_ok=True)
    input_path = STORAGE_IMAGES / safe_name
    input_path.write_bytes(content)

    try:
        result = process_image(input_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Falha ao processar imagem: {}".format(exc))

    return result


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8000")))
