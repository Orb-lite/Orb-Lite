import type { Worksheet } from "exceljs";
import orbLiteLogoUrl from "@/assets/orb-lite-logo.png";

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
  navyAlt: "FF22304E",
  slate: "FF1E293B",
  lime: "FFA3E635",
  paleLime: "FFE5F7B8",
  border: "FFE2E8F0",
  stripe: "FF22304E",
  silver: "FFD7DEE8",
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

/**
 * Fondo azul marino en toda la hoja y letras plateadas en los datos;
 * las filas alternas llevan un azul un poco más claro para distinguirse.
 * También cubre las celdas vacías (datos incompletos y un margen extra
 * de filas y columnas) para que no queden huecos blancos.
 */
function stripeDataRows(
  sheet: Worksheet,
  columnCount: number,
  rowCount: number,
  bandEnd: number,
) {
  const fillEndCol = Math.max(bandEnd, 16);
  const lastRow = Math.max(6 + rowCount, 120);
  for (let index = 0; index < rowCount; index += 1) {
    const row = sheet.getRow(6 + index);
    for (let col = 1; col <= columnCount; col += 1) {
      const cell = row.getCell(col);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: index % 2 === 1 ? BRAND.navyAlt : BRAND.navy },
      };
      cell.font = { color: { argb: BRAND.silver } };
    }
  }
  for (let rowNumber = 6; rowNumber <= lastRow; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    for (let col = columnCount + 1; col <= fillEndCol; col += 1) {
      row.getCell(col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: BRAND.navy },
      };
    }
  }
  for (let rowNumber = 6 + rowCount; rowNumber <= lastRow; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    for (let col = 1; col <= fillEndCol; col += 1) {
      row.getCell(col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: BRAND.navy },
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

  const fillEndCol = Math.max(bandEnd, 16);
  for (let col = 1; col <= fillEndCol; col += 1) {
    sheet.getCell(1, col).fill = navyFill();
    sheet.getCell(2, col).fill = navyFill();
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

  stripeDataRows(sheet, columnCount, rows.length - 1, bandEnd);

  sheet.autoFilter = {
    from: { row: 5, column: 1 },
    to: { row: 5, column: columnCount },
  };
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

/** Gráfica nativa de Excel (editable) generada dentro del archivo. */
export interface ExcelChartDefinition {
  /** Hoja de donde salen los datos (debe existir en `sheets`). */
  sheetName: string;
  title: string;
  /** Columna 1-based con las categorías (eje X); por defecto 1. */
  categoryColumn?: number;
  /** Series: nombre y columna 1-based de los valores. */
  series: Array<{ name: string; column: number }>;
  /** Número de filas de datos (los datos empiezan en la fila 6). */
  dataRows: number;
}

function columnLetter(column: number): string {
  let letter = "";
  let current = column;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    current = Math.floor((current - 1) / 26);
  }
  return letter;
}

function chartXml(definition: ExcelChartDefinition): string {
  const sheet = `'${definition.sheetName.replace(/'/g, "''")}'`;
  const lastRow = 5 + definition.dataRows;
  const categoryColumn = columnLetter(definition.categoryColumn ?? 1);
  const seriesXml = definition.series
    .map((serie, index) => {
      const valueColumn = columnLetter(serie.column);
      return `<c:ser><c:idx val="${index}"/><c:order val="${index}"/><c:tx><c:strRef><c:f>${sheet}!$${valueColumn}$5</c:f></c:strRef></c:tx><c:spPr><a:ln w="28575"><a:solidFill><a:srgbClr val="A3E635"/></a:solidFill></a:ln></c:spPr><c:cat><c:strRef><c:f>${sheet}!$${categoryColumn}$6:$${categoryColumn}$${lastRow}</c:f></c:strRef></c:cat><c:val><c:numRef><c:f>${sheet}!$${valueColumn}$6:$${valueColumn}$${lastRow}</c:f></c:numRef></c:val><c:smooth val="0"/></c:ser>`;
    })
    .join("");
  const axBase = 100000000 + definition.title.length;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><c:lang val="es-MX"/><c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="1400" b="1"><a:solidFill><a:srgbClr val="17233D"/></a:solidFill></a:defRPr></a:pPr><a:r><a:rPr lang="es-MX" sz="1400" b="1"><a:solidFill><a:srgbClr val="17233D"/></a:solidFill></a:rPr><a:t>${definition.title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title><c:plotArea><c:layout/><c:lineChart><c:grouping val="standard"/><c:varyColors val="0"/>${seriesXml}<c:marker val="1"/><c:axId val="${axBase}"/><c:axId val="${axBase + 1}"/></c:lineChart><c:catAx><c:axId val="${axBase}"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/><c:crossAx val="${axBase + 1}"/></c:catAx><c:valAx><c:axId val="${axBase + 1}"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:crossAx val="${axBase}"/></c:valAx></c:plotArea><c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart></c:chartSpace>`;
}

/**
 * Inserta gráficas nativas de Excel dentro del .xlsx generado por ExcelJS
 * (ExcelJS no soporta gráficas): se abre el archivo como zip, se agregan
 * las partes de la gráfica y se anclan en el dibujo de la hoja destino.
 */
async function injectNativeCharts(
  buffer: ArrayBuffer,
  charts: ExcelChartDefinition[],
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(buffer);

  const workbookXml = await zip.file("xl/workbook.xml")!.async("string");
  const workbookRels = await zip.file("xl/_rels/workbook.xml.rels")!.async("string");

  let contentTypes = await zip.file("[Content_Types].xml")!.async("string");
  let chartIndex = 1;
  while (zip.file(`xl/charts/chart${chartIndex}.xml`)) chartIndex += 1;

  for (const definition of charts) {
    const sheetMatch = workbookXml.match(
      new RegExp(
        `<sheet[^>]*name="${definition.sheetName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*r:id="(rId\\d+)"`,
      ),
    );
    if (!sheetMatch) continue;
    const relMatch = workbookRels.match(
      new RegExp(`<Relationship[^>]*Id="${sheetMatch[1]}"[^>]*Target="([^"]+)"`),
    );
    if (!relMatch) continue;
    const sheetPath = `xl/${relMatch[1]!.replace(/^\//, "").replace(/^xl\//, "")}`;
    const sheetFile = zip.file(sheetPath);
    if (!sheetFile) continue;

    const relsPath = sheetPath.replace(
      /worksheets\/([^/]+)$/,
      "worksheets/_rels/$1.rels",
    );
    const relsFile = zip.file(relsPath);
    if (!relsFile) continue;
    let sheetRels = await relsFile.async("string");
    const drawingMatch = sheetRels.match(
      /<Relationship[^>]*Type="[^"]*\/drawing"[^>]*Target="([^"]+)"/,
    );
    if (!drawingMatch) continue;
    const drawingPath = drawingMatch[1]!.replace(/^\.\.\//, "xl/");
    const drawingFile = zip.file(drawingPath);
    if (!drawingFile) continue;
    let drawingXml = await drawingFile.async("string");
    const drawingRelsPath = drawingPath.replace(
      /drawings\/([^/]+)$/,
      "drawings/_rels/$1.rels",
    );
    let drawingRels = (await zip.file(drawingRelsPath)?.async("string")) ?? "";

    const chartPath = `xl/charts/chart${chartIndex}.xml`;
    const existingIds = [...drawingRels.matchAll(/Id="rId(\d+)"/g)].map((m) =>
      Number(m[1]),
    );
    const newRelId = `rId${Math.max(0, ...existingIds) + 1}`;
    const frameId = 100 + chartIndex;
    const fromRow = 5 + definition.dataRows + 2;
    const anchor = `<xdr:twoCellAnchor><xdr:from><xdr:col>0</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${fromRow}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>9</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${fromRow + 18}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${frameId}" name="${definition.title.replace(/"/g, "")}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="${newRelId}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`;

    drawingXml = drawingXml.replace("</xdr:wsDr>", `${anchor}</xdr:wsDr>`);
    zip.file(drawingPath, drawingXml);

    if (drawingRels) {
      drawingRels = drawingRels.replace(
        "</Relationships>",
        `<Relationship Id="${newRelId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart${chartIndex}.xml"/></Relationships>`,
      );
    } else {
      drawingRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="${newRelId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart${chartIndex}.xml"/></Relationships>`;
    }
    zip.file(drawingRelsPath, drawingRels);

    zip.file(chartPath, chartXml(definition));
    contentTypes = contentTypes.replace(
      "</Types>",
      `<Override PartName="/xl/charts/chart${chartIndex}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/></Types>`,
    );
    chartIndex += 1;
  }

  zip.file("[Content_Types].xml", contentTypes);
  return zip.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export async function downloadExcelWorkbook({
  filename,
  sheets,
  map,
  images,
  charts,
}: {
  filename: string;
  sheets: ExcelSheetDefinition[];
  map?: ExcelMapDefinition;
  images?: ExcelMapDefinition[];
  charts?: ExcelChartDefinition[];
}) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ORB-LITE";
  workbook.created = new Date();

  const logoDataUrl = await loadLogoDataUrl();
  const logoId = workbook.addImage({ base64: logoDataUrl, extension: "png" });

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
    // Marco con título en banda azul y borde lima, a juego con la plantilla.
    const titleCell = sheet.getCell(row, column + 1);
    titleCell.value = image.title;
    titleCell.font = { bold: true, size: 12, color: { argb: BRAND.white } };
    titleCell.fill = navyFill();
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    sheet.getRow(row).height = 22;
    const anchor = workbookImageAnchor(imageId, column, row, image.width ?? 720, image.height ?? 480);
    sheet.addImage(anchor.id, anchor.range);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

