from pathlib import Path

from PIL import Image

BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BASE_DIR.parent
STORAGE_IMAGES = PROJECT_ROOT / "storage" / "images"
STORAGE_PROCESSED = PROJECT_ROOT / "storage" / "processed"

VARIANTS = {
    "thumbnail": 400,
    "medium": 800,
    "full": 1600,
}

WEBP_QUALITY = 80
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_PREFIX = "image/"


def format_file_size(num_bytes):
    if num_bytes >= 1024 * 1024:
        return "{:.1f} MB".format(num_bytes / (1024 * 1024)).replace(".", ",")
    if num_bytes >= 1024:
        return "{:.1f} KB".format(num_bytes / 1024).replace(".", ",")
    return "{} B".format(num_bytes)


def compute_variant_size(orig_w, orig_h, target_w):
    if orig_w <= target_w:
        return orig_w, orig_h
    ratio = target_w / orig_w
    return target_w, max(1, round(orig_h * ratio))


def process_image(input_path):
    original = Image.open(input_path)
    orig_w, orig_h = original.size
    original_bytes = input_path.stat().st_size

    STORAGE_PROCESSED.mkdir(parents=True, exist_ok=True)

    variants = []
    for name, target_w in VARIANTS.items():
        img = original.copy()
        img.thumbnail((target_w, target_w), Image.LANCZOS)
        w, h = img.size
        out_name = "{}-{}.webp".format(input_path.stem, name)
        out_path = STORAGE_PROCESSED / out_name
        img.save(out_path, "WEBP", quality=WEBP_QUALITY)
        variants.append({
            "name": name,
            "file_name": out_name,
            "file_size": format_file_size(out_path.stat().st_size),
            "width": w,
            "height": h,
        })

    return {
        "original": {
            "file_name": input_path.name,
            "file_size": format_file_size(original_bytes),
            "width": orig_w,
            "height": orig_h,
        },
        "variants": variants,
    }
