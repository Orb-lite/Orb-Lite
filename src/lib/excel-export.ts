import type { Worksheet } from "exceljs";
import orbLiteLogoUrl from "@/assets/orb-lite-logo.png";
import formatoBaseUrl from "@/assets/formato_base.xlsx?url";

export type ExcelCell = string | number | boolean | null;

export type ExcelSheetDefinition = {
  name: string;
  rows: ExcelCell[][];
};

export type ExcelMapDefinition = {
  sheetName: string;
  title: string;
  dataUrl: string;
  column?: number;
  width?: number;
  height?: number;
};

function safeSheetName(name: string, index: number) {
  const cleaned = name.replace(/[\\/?*[\]:]/g, " ").trim();
  return (cleaned || `Hoja ${index + 1}`).slice(0, 31);
}

const BRAND = {
  navy: "FF17233D",
  slate: "FF1E293B",
  lime: "FFA3E635",
  paleLime: "FFE5F7B8",
  border: "FFE2E8F0",
  stripe: "FFF4F7FB",
  white: "FFFFFFFF",
};

async function loadLogoDataUrl() {
  const response = await fetch(orbLiteLogoUrl);
  if (!response.ok) throw new Error("No se pudo cargar el logotipo de ORB-LITE.");

  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return `data:image/png;base64,${btoa(binary)}`;
}

const TEMPLATE_NAVY = "FF16223D";

function navyFill() {
  return {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: TEMPLATE_NAVY },
  };
}

function headerStyle(cell: import("exceljs").Cell) {
  cell.font = { bold: true, color: { argb: BRAND.navy } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.lime } };
  cell.alignment = { vertical: "middle", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: BRAND.navy } },
    bottom: { style: "thin", color: { argb: BRAND.navy } },
  };
}

function stripeDataRows(sheet: Worksheet, columnCount: number, rowCount: number) {
  for (let index = 0; index < rowCount; index += 1) {
    if (index % 2 !== 1) continue;
    const row = sheet.getRow(6 + index);
    for (let col = 1; col <= columnCount; col += 1) {
      row.getCell(col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: BRAND.stripe },
      };
    }
  }
}

/**
 * Replica la estructura de la plantilla formato_base.xlsx en una hoja nueva:
 * fila 1 logotipo, fila 2 combinada, banda azul marino con subtítulo (fila 3)
 * y título (fila 4), encabezados lima en la fila 5 y datos desde la fila 6.
 */
function styleSheet(sheet: Worksheet, rows: ExcelCell[][], title: string, logoId: number) {
  const columnCount = Math.max(...rows.map((row) => row.length), 1);
  const bandEnd = Math.max(columnCount, 11);

  sheet.addRow([]);
  sheet.addRow([]);
  sheet.addRow([]);
  sheet.addRow([]);
  sheet.addRows(rows);

  sheet.mergeCells(2, 1, 2, bandEnd);
  sheet.getRow(1).height = 70;
  sheet.getRow(2).height = 30;
  sheet.getRow(4).height = 24;

  for (let col = 1; col <= bandEnd; col += 1) {
    sheet.getCell(3, col).fill = navyFill();
    sheet.getCell(4, col).fill = navyFill();
  }
  sheet.getCell(3, 1).value = "ORB-LITE · Rastreo GPS satelital";
  sheet.getCell(3, 1).font = { color: { argb: BRAND.white } };
  sheet.mergeCells(4, 1, 4, bandEnd);
  sheet.getCell(4, 1).value = title;
  sheet.getCell(4, 1).font = { bold: true, size: 18, color: { argb: BRAND.white } };
  sheet.getCell(4, 1).alignment = { vertical: "middle" };

  const logo = workbookImageAnchor(logoId, 0, 0, 128, 94);
  sheet.addImage(logo.id, logo.range);

  const header = sheet.getRow(5);
  for (let col = 1; col <= columnCount; col += 1) headerStyle(header.getCell(col));
  sheet.getRow(5).height = 28;

  for (let index = 1; index <= columnCount; index += 1) {
    sheet.getColumn(index).width = Math.min(
      34,
      Math.max(14, ...rows.map((row) => String(row[index - 1] ?? "").length + 2)),
    );
  }

  stripeDataRows(sheet, columnCount, rows.length - 1);

  sheet.autoFilter = {
    from: { row: 5, column: 1 },
    to: { row: 5, column: columnCount },
  };
  sheet.views = [{ state: "frozen", ySplit: 5 }];
  sheet.properties.tabColor = { argb: BRAND.lime };
}

/**
 * Rellena la primera hoja de la plantilla real (logotipo, banda azul y
 * encabezados ya vienen en el archivo) con los datos del reporte.
 */
function fillTemplateSheet(sheet: Worksheet, rows: ExcelCell[][], title: string) {
  const columnCount = Math.max(...rows.map((row) => row.length), 1);

  if (sheet.rowCount > 5) sheet.spliceRows(6, sheet.rowCount - 5);

  sheet.getCell(4, 4).value = title;

  const headerRow = sheet.getRow(5);
  const header = rows[0] ?? [];
  for (let col = 1; col <= header.length; col += 1) {
    const cell = headerRow.getCell(col);
    cell.value = header[col - 1] ?? null;
    if (col > 5) headerStyle(cell);
  }

  for (const row of rows.slice(1)) sheet.addRow(row);
  stripeDataRows(sheet, columnCount, rows.length - 1);

  for (let col = 1; col <= columnCount; col += 1) {
    const column = sheet.getColumn(col);
    if (!column.width) {
      column.width = Math.min(
        34,
        Math.max(14, ...rows.map((row) => String(row[col - 1] ?? "").length + 2)),
      );
    }
  }

  sheet.views = [{ state: "frozen", ySplit: 5 }];
  sheet.properties.tabColor = { argb: BRAND.lime };
}

function workbookImageAnchor(
  id: number,
  column: number,
  row: number,
  width: number,
  height: number,
) {
  return {
    id,
    range: {
      tl: { col: column, row },
      ext: { width, height },
    },
  };
}

export async function captureElementAsPng(element: HTMLElement) {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(element, {
    backgroundColor: "#17233d",
    logging: false,
    scale: 2,
    useCORS: true,
  });
  return canvas.toDataURL("image/png");
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar una imagen del mapa."));
    image.src = src;
  });
}

/**
 * Dibuja el recorrido sobre las losetas oscuras de Esri en un canvas.
 * A diferencia de capturar el mapa interactivo (Leaflet no se puede
 * fotografiar por restricciones de los navegadores), aquí la imagen se
 * construye pieza por pieza y siempre sale completa.
 */
export async function renderTrackMapImage(
  track: Array<{ lat: number; lon: number }>,
) {
  if (track.length === 0) throw new Error("El recorrido no tiene puntos.");

  const TILE = 256;
  const lats = track.map((p) => p.lat);
  const lons = track.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const project = (lat: number, lon: number, zoom: number) => {
    const sin = Math.sin((lat * Math.PI) / 180);
    const scale = TILE * 2 ** zoom;
    return {
      x: ((lon + 180) / 360) * scale,
      y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
    };
  };

  let zoom = 16;
  while (zoom > 3) {
    const a = project(maxLat, minLon, zoom);
    const b = project(minLat, maxLon, zoom);
    if (b.x - a.x <= 7 * TILE && b.y - a.y <= 5 * TILE) break;
    zoom -= 1;
  }

  const topLeft = project(maxLat, minLon, zoom);
  const bottomRight = project(minLat, maxLon, zoom);
  const pad = 40;
  const x0 = Math.floor((topLeft.x - pad) / TILE);
  const x1 = Math.floor((bottomRight.x + pad) / TILE);
  const y0 = Math.floor((topLeft.y - pad) / TILE);
  const y1 = Math.floor((bottomRight.y + pad) / TILE);
  const maxTile = 2 ** zoom - 1;
  const originX = x0 * TILE;
  const originY = y0 * TILE;

  const canvas = document.createElement("canvas");
  canvas.width = (x1 - x0 + 1) * TILE;
  canvas.height = (y1 - y0 + 1) * TILE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar la imagen del mapa.");
  ctx.fillStyle = "#17233d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const jobs: Array<Promise<void>> = [];
  for (let tx = Math.max(0, x0); tx <= Math.min(maxTile, x1); tx += 1) {
    for (let ty = Math.max(0, y0); ty <= Math.min(maxTile, y1); ty += 1) {
      const url = `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/${zoom}/${ty}/${tx}`;
      jobs.push(
        loadImage(url)
          .then((img) => {
            ctx.drawImage(img, tx * TILE - originX, ty * TILE - originY);
          })
          .catch(() => undefined),
      );
    }
  }
  await Promise.all(jobs);

  const toCanvas = (lat: number, lon: number) => {
    const p = project(lat, lon, zoom);
    return { x: p.x - originX, y: p.y - originY };
  };

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "#a3e635";
  ctx.lineWidth = 5;
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  track.forEach((point, index) => {
    const p = toCanvas(point.lat, point.lon);
    if (index === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  const drawDot = (lat: number, lon: number, color: string, radius: number) => {
    const p = toCanvas(lat, lon);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  };

  const first = track[0]!;
  const last = track[track.length - 1]!;
  drawDot(first.lat, first.lon, "#22c55e", 10);
  drawDot(last.lat, last.lon, "#ef4444", 10);

  return canvas.toDataURL("image/png");
}

/**
 * Convierte una gráfica de Recharts (SVG) a PNG. html2canvas no sabe
 * dibujar SVG, por eso se serializa el SVG y se pinta en un canvas.
 */
export async function captureChartAsPng(container: HTMLElement) {
  const svg = container.querySelector("svg");
  if (!svg) throw new Error("No se encontró la gráfica para exportar.");

  const box = svg.getBoundingClientRect();
  const width = Math.max(1, Math.round(box.width));
  const height = Math.max(1, Math.round(box.height));
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));

  const serialized = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(
    new Blob([serialized], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const image = await loadImage(svgUrl);
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No se pudo preparar la imagen de la gráfica.");
    ctx.fillStyle = "#0e1f39";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export async function downloadExcelWorkbook({
  filename,
  sheets,
  map,
  images,
}: {
  filename: string;
  sheets: ExcelSheetDefinition[];
  map?: ExcelMapDefinition;
  images?: ExcelMapDefinition[];
}) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ORB-LITE";
  workbook.created = new Date();
  const logoDataUrl = await loadLogoDataUrl();
  const logoId = workbook.addImage({
    base64: logoDataUrl,
    extension: "png",
  });

  for (const [index, definition] of sheets.entries()) {
    const sheet = workbook.addWorksheet(safeSheetName(definition.name, index));
    styleSheet(sheet, definition.rows, definition.name, logoId);
  }

  const extraImages = [...(map ? [map] : []), ...(images ?? [])];
  for (const [imageIndex, image] of extraImages.entries()) {
    const sheet = workbook.getWorksheet(safeSheetName(image.sheetName, 0));
    if (!sheet) throw new Error(`No se encontró la hoja ${image.sheetName}.`);

    const column = image.column ?? 6;
    const row = imageIndex === 0 ? 2 : 2 + imageIndex * 26;
    const imageId = workbook.addImage({
      base64: image.dataUrl,
      extension: "png",
    });
    sheet.getCell(row, column + 1).value = image.title;
    sheet.getCell(row, column + 1).font = { bold: true, size: 14, color: { argb: BRAND.navy } };
    sheet.getCell(row, column + 1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BRAND.paleLime },
    };
    sheet.getCell(row, column + 1).alignment = { vertical: "middle" };
    const anchor = workbookImageAnchor(imageId, column, row, image.width ?? 720, image.height ?? 480);
    sheet.addImage(anchor.id, anchor.range);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
