const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
} = require("docx");

function readTemplateMarkdown() {
  const root = path.join(__dirname, "..");
  return fs.readFileSync(path.join(root, "BAO_CAO_TEMPLATE_WORD.md"), "utf-8");
}

function isTableLine(line) {
  const t = line.trim();
  return t.startsWith("|") && t.endsWith("|") && t.includes("|");
}

function parseMarkdownTable(lines) {
  // Very small markdown-table parser for the template:
  // - header row (| a | b |)
  // - separator row (| --- | --- |) ignored
  // - data rows
  const rows = [];
  for (const line of lines) {
    if (!isTableLine(line)) continue;
    const t = line.trim();
    // split by '|' but keep empty edges trimmed away
    const parts = t
      .split("|")
      .map((p) => p.trim())
      .filter((_, idx) => idx !== 0 && idx !== t.split("|").length - 1);
    rows.push(parts);
  }
  // Remove separator row: all cells are like --- / :---:
  const filtered = rows.filter((cells) => !cells.every((c) => /^:?-{2,}:?$/.test(c)));
  return filtered;
}

function headingToLevel(line) {
  if (line.startsWith("### ")) return HeadingLevel.Heading3;
  if (line.startsWith("## ")) return HeadingLevel.Heading2;
  if (line.startsWith("# ")) return HeadingLevel.Heading1;
  return null;
}

function cellParagraph(text) {
  return new Paragraph({
    children: [new TextRun({ text: String(text ?? ""), size: 20 })],
  });
}

function markdownToDocxElements(markdown) {
  const lines = markdown.split(/\r?\n/);
  const elements = [];

  let i = 0;
  let inCodeBlock = false;
  let codeLines = [];

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw ?? "";
    const trimmed = line.trim();

    // Code block
    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock) {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeLines.join("\n"),
                font: "Courier New",
                size: 18,
              }),
            ],
          })
        );
        codeLines = [];
      }
      i += 1;
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      i += 1;
      continue;
    }

    // Blank line
    if (!trimmed) {
      elements.push(new Paragraph({ text: "" }));
      i += 1;
      continue;
    }

    // Headings
    const level = headingToLevel(trimmed);
    if (level) {
      const text = trimmed.replace(/^#+\s+/, "");
      elements.push(
        new Paragraph({
          text,
          heading: level,
        })
      );
      i += 1;
      continue;
    }

    // Table blocks
    if (isTableLine(trimmed)) {
      const tableLines = [];
      while (i < lines.length && isTableLine(lines[i].trim())) {
        tableLines.push(lines[i].trim());
        i += 1;
      }

      const parsed = parseMarkdownTable(tableLines);
      if (parsed.length >= 2) {
        const header = parsed[0];
        const body = parsed.slice(1);
        const rows = [];
        rows.push(
          new TableRow({
            children: header.map((h) => new TableCell({ children: [cellParagraph(h)] })),
          })
        );
        for (const r of body) {
          rows.push(
            new TableRow({
              children: header.map((_, colIdx) => new TableCell({ children: [cellParagraph(r[colIdx] ?? "")] })),
            })
          );
        }
        elements.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows,
          })
        );
      }
      continue;
    }

    // Bullet lines
    if (trimmed.startsWith("- ")) {
      elements.push(
        new Paragraph({
          text: trimmed.slice(2),
          bullet: { level: 0 },
        })
      );
      i += 1;
      continue;
    }

    // Numbered list (1) or "1) ..." style
    if (/^\d+\)\s+/.test(trimmed)) {
      elements.push(
        new Paragraph({
          text: trimmed,
        })
      );
      i += 1;
      continue;
    }

    // Default paragraph
    elements.push(new Paragraph({ text: trimmed }));
    i += 1;
  }

  return elements;
}

async function main() {
  const root = path.join(__dirname, "..");
  const templateMd = readTemplateMarkdown();

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: markdownToDocxElements(templateMd),
      },
    ],
  });

  const outPath = path.join(root, "group01_ltweb_electric-nose-report-demo.docx");
  const buf = await Packer.toBuffer(doc);
  try {
    fs.writeFileSync(outPath, buf);
    // eslint-disable-next-line no-console
    console.log("DOCX exported:", outPath);
  } catch (err) {
    if (err && err.code === "EBUSY") {
      const alt = path.join(root, `group01_ltweb_electric-nose-report-demo-${Date.now()}.docx`);
      fs.writeFileSync(alt, buf);
      // eslint-disable-next-line no-console
      console.warn("File Word đang mở — đã ghi bản thay thế:", alt);
    } else {
      throw err;
    }
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

