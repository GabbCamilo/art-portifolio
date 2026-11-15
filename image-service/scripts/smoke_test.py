"""Smoke test local do image-service (sem deploy).

Espera o servidor em http://127.0.0.1:8000.
Uso: py -3.13 scripts/smoke_test.py
"""
import sys
from pathlib import Path

import httpx

BASE = Path(__file__).resolve().parents[2]
IMAGES = BASE / "storage" / "images"
PROCESSED = BASE / "storage" / "processed"
API = "http://127.0.0.1:8000"

results = []


def check(name, ok, detail=""):
    results.append((name, ok))
    print("{} {} {}".format("PASS" if ok else "FAIL", name, detail))


def main():
    with httpx.Client(timeout=30) as client:
        r = client.get(API + "/health")
        check("GET /health = 200", r.status_code == 200 and r.json().get("status") == "ok")

        sample = IMAGES / "retratos-urbanos.jpg"
        if not sample.exists():
            print("execute scripts/generate_samples.py antes do smoke test")
            sys.exit(1)

        with open(sample, "rb") as fh:
            r = client.post(API + "/process", files={"file": ("retratos-urbanos.jpg", fh, "image/jpeg")})
        ok = r.status_code == 200
        check("POST /process = 200", ok, "" if ok else r.text)
        if not ok:
            sys.exit(1)

        data = r.json()
        orig = data["original"]
        variants = data["variants"]
        check("3 variantes", len(variants) == 3, str([v["name"] for v in variants]))
        check("metadados do original", orig["file_name"] == "retratos-urbanos.jpg"
              and orig["width"] == 1200 and orig["height"] == 900)

        for v in variants:
            path = PROCESSED / v["file_name"]
            exists = path.exists()
            check("variante {} no disco".format(v["name"]), exists, v["file_name"])
            ratio_in = orig["width"] / orig["height"]
            ratio_out = v["width"] / v["height"]
            check("proporcao {} preservada".format(v["name"]),
                  abs(ratio_in - ratio_out) <= 1 / max(v["height"], 1))
            fs = v["file_size"]
            check("file_size pt-BR {}".format(v["name"]),
                  fs.endswith(" B") or ("," in fs and (fs.endswith(" KB") or fs.endswith(" MB"))), fs)

        names = [v["name"] for v in variants]
        check("ordem thumbnail/medium/full", names == ["thumbnail", "medium", "full"])
        full = next(v for v in variants if v["name"] == "full")
        check("full nao ultrapassa 1600", full["width"] <= 1600)

        r = client.post(API + "/process", files={"file": ("a.txt", b"nao imagem", "text/plain")})
        check("texto plano rejeitado (400)", r.status_code == 400)

        big = b"\x00" * (11 * 1024 * 1024)
        r = client.post(API + "/process", files={"file": ("big.jpg", big, "image/jpeg")})
        check("arquivo >10MB rejeitado (413)", r.status_code == 413)

    failed = [n for n, ok in results if not ok]
    print("\n{}/{} passaram".format(len(results) - len(failed), len(results)))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
