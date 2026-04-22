from __future__ import annotations

import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter


def protect_pdf(input_pdf: Path, output_pdf: Path, password: str) -> None:
    reader = PdfReader(str(input_pdf))
    writer = PdfWriter()

    for page in reader.pages:
      writer.add_page(page)

    writer.encrypt(password)
    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    with output_pdf.open("wb") as handle:
      writer.write(handle)


def unlock_pdf(input_pdf: Path, output_pdf: Path, password: str) -> None:
    reader = PdfReader(str(input_pdf))
    if reader.is_encrypted:
      result = reader.decrypt(password)
      if not result:
        raise ValueError("Incorrect password or unable to decrypt PDF.")

    writer = PdfWriter()
    for page in reader.pages:
      writer.add_page(page)

    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    with output_pdf.open("wb") as handle:
      writer.write(handle)


def main() -> int:
    if len(sys.argv) != 5:
        print("Usage: pdf_security.py <protect|unlock> <input_pdf> <output_pdf> <password>", file=sys.stderr)
        return 1

    action = sys.argv[1]
    input_pdf = Path(sys.argv[2])
    output_pdf = Path(sys.argv[3])
    password = sys.argv[4]

    if not input_pdf.exists():
        print(f"Input PDF not found: {input_pdf}", file=sys.stderr)
        return 1

    try:
        if action == "protect":
            protect_pdf(input_pdf, output_pdf, password)
        elif action == "unlock":
            unlock_pdf(input_pdf, output_pdf, password)
        else:
            raise ValueError(f"Unknown action: {action}")

        print(f'{{"action":"{action}","inputPdf":"{input_pdf.as_posix()}","outputPdf":"{output_pdf.as_posix()}"}}')
        return 0
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())