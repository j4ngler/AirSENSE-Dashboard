from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def register_unicode_font():
    candidates = [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/tahoma.ttf"),
        Path("C:/Windows/Fonts/calibri.ttf"),
    ]
    for font_path in candidates:
        if font_path.exists():
            pdfmetrics.registerFont(TTFont("ReportUnicode", str(font_path)))
            return "ReportUnicode"
    return "Helvetica"


def main():
    root = Path(__file__).resolve().parents[1]
    md_path = root / "BAO_CAO_TEMPLATE_WORD.md"
    pdf_path = root / "BAO_CAO_TONG_HOP_REPORT_DEMO.pdf"

    text = md_path.read_text(encoding="utf-8")
    styles = getSampleStyleSheet()
    unicode_font = register_unicode_font()
    title_style = styles["Title"]
    h_style = styles["Heading2"]
    body_style = styles["BodyText"]
    code_style = styles["Code"]
    title_style.fontName = unicode_font
    h_style.fontName = unicode_font
    body_style.fontName = unicode_font
    code_style.fontName = unicode_font
    title_style.leading = 18
    h_style.leading = 15
    body_style.leading = 14
    code_style.leading = 13

    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=1.8 * cm,
        rightMargin=1.8 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title="Báo cáo tổng hợp report-demo",
    )

    story = []
    in_code = False
    code_lines = []

    for raw_line in text.splitlines():
        line = raw_line.rstrip("\n")
        if line.strip().startswith("```"):
            if not in_code:
                in_code = True
                code_lines = []
            else:
                in_code = False
                story.append(Preformatted("\n".join(code_lines), code_style))
                story.append(Spacer(1, 0.25 * cm))
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line.strip():
            story.append(Spacer(1, 0.18 * cm))
            continue

        if line.startswith("# "):
            story.append(Paragraph(line[2:].strip(), title_style))
            story.append(Spacer(1, 0.35 * cm))
            continue
        if line.startswith("## "):
            story.append(Paragraph(line[3:].strip(), h_style))
            story.append(Spacer(1, 0.18 * cm))
            continue

        safe_line = (
            line.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
        )
        story.append(Paragraph(safe_line, body_style))

    doc.build(story)
    print(f"PDF exported: {pdf_path}")


if __name__ == "__main__":
    main()
