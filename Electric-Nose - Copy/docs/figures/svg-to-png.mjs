import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const files = [
  "hinh-khoi-chuc-nang-dashboard.svg",
  "hinh-luong-phan-hoi-responsive.svg",
];

for (const name of files) {
  const svg = readFileSync(name);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render();
  const out = name.replace(/\.svg$/i, ".png");
  writeFileSync(out, png.asPng());
  console.log(out);
}
