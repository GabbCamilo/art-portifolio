"""Gera imagens de exemplo em storage/images/ a partir dos dados simulados do seed.

Sem obras reais: cada amostra e uma superficie colorida com o nome do arquivo,
usando as dimensoes e tons do seed.sql / placeholders da Etapa 02.
"""
from pathlib import Path

from PIL import Image, ImageDraw

BASE_DIR = Path(__file__).resolve().parents[2]
OUT_DIR = BASE_DIR / "storage" / "images"

BACKGROUND = ["#EAD6D5", "#E3C9C7", "#DBCFCF", "#D4C4C3", "#EFE0DF"]
TEXT = ["#292323", "#4A4040", "#5C5050", "#6B5D5D", "#3A3232"]

SAMPLES = [
    ("retratos-urbanos", 1200, 900, 0),
    ("natureza-abstrata", 1600, 900, 1),
    ("figuras-em-movimento", 1000, 1400, 2),
    ("cidade-noturna", 1400, 1000, 3),
    ("auto-retrato-expressivo", 1000, 1000, 4),
    ("mare-baixa", 1500, 1000, 0),
    ("silencio-do-interior", 1200, 1500, 1),
    ("entre-linhas", 1600, 1200, 2),
    ("jardim-suspenso", 1000, 1300, 3),
    ("ultima-luz", 1400, 900, 4),
]


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, width, height, tone in SAMPLES:
        img = Image.new("RGB", (width, height), BACKGROUND[tone % len(BACKGROUND)])
        draw = ImageDraw.Draw(img)
        label = "{}.jpg".format(name)
        font_size = max(16, min(width, height) // 20)
        try:
            bbox = draw.textbbox((0, 0), label)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        except AttributeError:
            tw, th = draw.textsize(label)
        draw.text(((width - tw) / 2, (height - th) / 2), label, fill=TEXT[tone % len(TEXT)])
        img.save(OUT_DIR / "{}.jpg".format(name), "JPEG", quality=85)
        print("gerado: {} ({}x{})".format(label, width, height))


if __name__ == "__main__":
    main()
