const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } = require("docx");

function isTableLine(line) {
  const t = line.trim();
  return t.startsWith("|") && t.endsWith("|") && t.includes("|");
}

function parseMarkdownTable(lines) {
  const rows = [];
  for (const line of lines) {
    if (!isTableLine(line)) continue;
    const t = line.trim();
    const split = t.split("|");
    const parts = split.map((p) => p.trim()).filter((_, idx) => idx !== 0 && idx !== split.length - 1);
    rows.push(parts);
  }
  return rows.filter((cells) => !cells.every((c) => /^:?-{2,}:?$/.test(c)));
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
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock) {
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: codeLines.join("\n"), font: "Courier New", size: 18 })],
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

    if (!trimmed) {
      elements.push(new Paragraph({ text: "" }));
      i += 1;
      continue;
    }

    const level = headingToLevel(trimmed);
    if (level) {
      elements.push(new Paragraph({ text: trimmed.replace(/^#+\s+/, ""), heading: level }));
      i += 1;
      continue;
    }

    if (isTableLine(trimmed)) {
      const tableLines = [];
      while (i < lines.length && isTableLine((lines[i] ?? "").trim())) {
        tableLines.push((lines[i] ?? "").trim());
        i += 1;
      }
      const parsed = parseMarkdownTable(tableLines);
      if (parsed.length >= 2) {
        const header = parsed[0];
        const body = parsed.slice(1);
        const rows = [
          new TableRow({
            children: header.map((h) => new TableCell({ children: [cellParagraph(h)] })),
          }),
        ];
        for (const r of body) {
          rows.push(
            new TableRow({
              children: header.map((_, colIdx) => new TableCell({ children: [cellParagraph(r[colIdx] ?? "")] })),
            })
          );
        }
        elements.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
      }
      continue;
    }

    if (trimmed.startsWith("- ")) {
      elements.push(new Paragraph({ text: trimmed.slice(2), bullet: { level: 0 } }));
      i += 1;
      continue;
    }

    elements.push(new Paragraph({ text: trimmed }));
    i += 1;
  }

  return elements;
}

async function main() {
  const root = path.join(__dirname, "..");
  const input = process.argv[2];
  const output = process.argv[3];
  if (!input || !output) {
    // eslint-disable-next-line no-console
    console.error("Usage: node scripts/export-individual-docx.js <input.md> <output.docx>");
    process.exit(1);
  }

  const inPath = path.isAbsolute(input) ? input : path.join(root, input);
  const outPath = path.isAbsolute(output) ? output : path.join(root, output);
  const markdown = fs.readFileSync(inPath, "utf-8");

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: markdownToDocxElements(markdown),
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buf);
  // eslint-disable-next-line no-console
  console.log("DOCX exported:", outPath);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
