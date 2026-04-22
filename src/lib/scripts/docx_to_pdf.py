from __future__ import annotations

import sys
from pathlib import Path

from docx import Document
from docx.text.paragraph import Paragraph as DocxParagraph
from docx.table import Table as DocxTable
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.lib import colors


def iter_block_items(document: Document):
    body = document.element.body
    for child in body.iterchildren():
        tag = child.tag.split("}")[-1]
        if tag == "p":
            yield ("paragraph", DocxParagraph(child, document))
        elif tag == "tbl":
            yield ("table", DocxTable(child, document))


def paragraph_text(paragraph) -> str:
    return "".join(run.text for run in paragraph.runs).strip()


def build_story(input_docx: Path):
    document = Document(str(input_docx))
    styles = getSampleStyleSheet()
    body_style = ParagraphStyle(
        "BodyTextCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=12,
        spaceAfter=6,
    )

    story = []

    for block_type, block in iter_block_items(document):
        if block_type == "paragraph":
            paragraph = block
            text = paragraph_text(paragraph)
            if not text:
                story.append(Spacer(1, 0.12 * inch))
                continue

            story.append(Paragraph(text.replace("\n", "<br/>"), body_style))
            continue

        if block_type == "table":
            rows = []
            for row in block.rows:
                cells = []
                for cell in row.cells:
                    cells.append(" ".join(paragraph_text(paragraph) for paragraph in cell.paragraphs).strip())
                rows.append(cells)

            if rows:
                table = Table(rows, repeatRows=1)
                table.setStyle(
                    TableStyle(
                        [
                            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                            ("FONTSIZE", (0, 0), (-1, -1), 9),
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("TOPPADDING", (0, 0), (-1, -1), 4),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                        ]
                    )
                )
                story.append(table)
                story.append(Spacer(1, 0.12 * inch))

    return story


def convert_docx_to_pdf(input_docx: Path, output_pdf: Path) -> None:
    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
    )
    story = build_story(input_docx)
    doc.build(story)


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: docx_to_pdf.py <input_docx> <output_pdf>", file=sys.stderr)
        return 1

    input_docx = Path(sys.argv[1])
    output_pdf = Path(sys.argv[2])

    if not input_docx.exists():
        print(f"Input DOCX not found: {input_docx}", file=sys.stderr)
        return 1

    try:
        convert_docx_to_pdf(input_docx, output_pdf)
        print(f'{{"inputDocx":"{input_docx.as_posix()}","outputPdf":"{output_pdf.as_posix()}"}}')
        return 0
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())