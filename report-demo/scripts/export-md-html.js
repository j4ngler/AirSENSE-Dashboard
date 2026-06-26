const fs = require("fs");
const path = require("path");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function isTableLine(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.includes("|");
}

function tableCells(line) {
  const parts = line.trim().split("|");
  return parts.slice(1, parts.length - 1).map((cell) => cell.trim());
}

function isSeparatorRow(cells) {
  return cells.every((cell) => /^:?-{2,}:?$/.test(cell));
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const code = [];
      i += 1;
      while (i < lines.length && !String(lines[i]).trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      const className = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      out.push(`<pre><code${className}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (isTableLine(trimmed)) {
      const rows = [];
      while (i < lines.length && isTableLine(lines[i])) {
        rows.push(tableCells(lines[i]));
        i += 1;
      }
      const filtered = rows.filter((row) => !isSeparatorRow(row));
      if (filtered.length) {
        const [header, ...body] = filtered;
        out.push("<div class=\"table-wrap\"><table>");
        out.push(`<thead><tr>${header.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead>`);
        if (body.length) {
          out.push("<tbody>");
          for (const row of body) {
            out.push(`<tr>${header.map((_, idx) => `<td>${inlineMarkdown(row[idx] ?? "")}</td>`).join("")}</tr>`);
          }
          out.push("</tbody>");
        }
        out.push("</table></div>");
      }
      continue;
    }

    if (/^- /.test(trimmed)) {
      out.push("<ul>");
      while (i < lines.length && /^- /.test(String(lines[i]).trim())) {
        out.push(`<li>${inlineMarkdown(String(lines[i]).trim().slice(2))}</li>`);
        i += 1;
      }
      out.push("</ul>");
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      out.push("<ol>");
      while (i < lines.length && /^\d+\.\s+/.test(String(lines[i]).trim())) {
        out.push(`<li>${inlineMarkdown(String(lines[i]).trim().replace(/^\d+\.\s+/, ""))}</li>`);
        i += 1;
      }
      out.push("</ol>");
      continue;
    }

    const paragraph = [trimmed];
    i += 1;
    while (
      i < lines.length &&
      String(lines[i]).trim() &&
      !String(lines[i]).trim().startsWith("#") &&
      !String(lines[i]).trim().startsWith("```") &&
      !isTableLine(lines[i]) &&
      !/^- /.test(String(lines[i]).trim()) &&
      !/^\d+\.\s+/.test(String(lines[i]).trim())
    ) {
      paragraph.push(String(lines[i]).trim());
      i += 1;
    }
    out.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
  }

  return out.join("\n");
}

function page(title, body) {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #111827;
      --muted: #4b5563;
      --line: #d8dee9;
      --soft: #f8fafc;
      --accent: #0f766e;
      --code: #0f172a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #eef2f7;
      color: var(--ink);
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.62;
    }
    main {
      width: min(1080px, calc(100% - 32px));
      margin: 32px auto;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
    }
    h1, h2, h3, h4 { line-height: 1.25; margin: 1.6em 0 0.6em; }
    h1 { margin-top: 0; font-size: 2rem; color: #0f172a; }
    h2 { border-top: 1px solid var(--line); padding-top: 1.1em; font-size: 1.45rem; color: var(--accent); }
    h3 { font-size: 1.15rem; color: #1f2937; }
    p, li { font-size: 1rem; }
    p { margin: 0.7em 0; }
    ul, ol { padding-left: 1.45rem; }
    code {
      background: #eef2f7;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      color: var(--code);
      font-family: Consolas, "Courier New", monospace;
      padding: 0.08rem 0.28rem;
    }
    pre {
      overflow: auto;
      background: #0f172a;
      color: #e5e7eb;
      border-radius: 10px;
      padding: 16px;
    }
    pre code {
      background: transparent;
      border: 0;
      color: inherit;
      padding: 0;
    }
    .table-wrap { overflow-x: auto; margin: 1rem 0 1.3rem; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.94rem;
    }
    th, td {
      border: 1px solid var(--line);
      padding: 10px 12px;
      vertical-align: top;
    }
    th {
      background: var(--soft);
      color: #0f172a;
      text-align: left;
    }
    tr:nth-child(even) td { background: #fbfdff; }
    @media print {
      body { background: #fff; }
      main { width: 100%; margin: 0; border: 0; box-shadow: none; }
    }
    @media (max-width: 680px) {
      main { width: 100%; margin: 0; border-radius: 0; padding: 22px; }
      h1 { font-size: 1.55rem; }
      h2 { font-size: 1.25rem; }
    }
  </style>
</head>
<body>
  <main>
${body}
  </main>
</body>
</html>
`;
}

function main() {
  const input = process.argv[2] || "MOBILE_APP_TONG_QUAN.md";
  const output = process.argv[3] || input.replace(/\.md$/i, ".html");
  const inputPath = path.resolve(input);
  const outputPath = path.resolve(output);
  const markdown = fs.readFileSync(inputPath, "utf8");
  const title = path.basename(inputPath, path.extname(inputPath));
  fs.writeFileSync(outputPath, page(title, markdownToHtml(markdown)), "utf8");
  console.log(`HTML exported: ${outputPath}`);
}

main();
