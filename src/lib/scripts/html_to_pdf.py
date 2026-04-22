from __future__ import annotations

import sys
from pathlib import Path

from bs4 import BeautifulSoup
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle, PageBreak


def text_or_empty(node) -> str:
    return " ".join(node.stripped_strings).strip() if node else ""


def table_from_tag(table_tag):
    rows = []
    for tr in table_tag.find_all("tr"):
        cells = tr.find_all(["th", "td"])
        row = [text_or_empty(cell) for cell in cells]
        if row:
            rows.append(row)
    return rows


def convert_html_to_pdf(input_html: Path, output_pdf: Path) -> None:
    html = input_html.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, "html.parser")

    title = text_or_empty(soup.title) if soup.title else input_html.stem
    body = soup.body or soup

    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
    )

    styles = getSampleStyleSheet()
    heading_style = ParagraphStyle(
        "HTMLHeading",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        spaceAfter=10,
    )
    subheading_style = ParagraphStyle(
        "HTMLSubheading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        spaceAfter=8,
    )
    body_style = ParagraphStyle(
        "HTMLBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=13,
        spaceAfter=6,
    )

    story = [Paragraph(title, heading_style), Spacer(1, 0.15 * inch)]

    for element in body.find_all(recursive=False):
        name = element.name.lower() if element.name else ""

        if name in {"h1", "h2", "h3", "h4"}:
            level_style = {
                "h1": heading_style,
                "h2": subheading_style,
                "h3": ParagraphStyle("HTMLH3", parent=body_style, fontName="Helvetica-Bold", fontSize=12, leading=15, spaceAfter=5),
                "h4": ParagraphStyle("HTMLH4", parent=body_style, fontName="Helvetica-Bold", fontSize=11, leading=14, spaceAfter=4),
            }[name]
            story.append(Paragraph(text_or_empty(element), level_style))
            continue

        if name == "p":
            text = text_or_empty(element)
            if text:
                story.append(Paragraph(text, body_style))
            continue

        if name in {"ul", "ol"}:
            for idx, li in enumerate(element.find_all("li", recursive=False), start=1):
                prefix = f"{idx}. " if name == "ol" else "• "
                story.append(Paragraph(f"{prefix}{text_or_empty(li)}", body_style))
            continue

        if name == "table":
            rows = table_from_tag(element)
            if rows:
                table = Table(rows, repeatRows=1)
                table.setStyle(
                    TableStyle(
                        [
                            ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
                            ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
                            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                            ("FONTSIZE", (0, 0), (-1, -1), 8),
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("TOPPADDING", (0, 0), (-1, -1), 4),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                        ]
                    )
                )
                story.append(table)
                continue

        if name == "hr":
            story.append(Spacer(1, 0.1 * inch))
            continue

    doc.build(story)


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: html_to_pdf.py <input_html> <output_pdf>", file=sys.stderr)
        return 1

    input_html = Path(sys.argv[1])
    output_pdf = Path(sys.argv[2])

    if not input_html.exists():
      print(f"Input HTML not found: {input_html}", file=sys.stderr)
      return 1

    try:
        convert_html_to_pdf(input_html, output_pdf)
        print(f'{{"inputHtml":"{input_html.as_posix()}","outputPdf":"{output_pdf.as_posix()}"}}')
        return 0
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())