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

function styleSheet(sheet: Worksheet, rows: ExcelCell[][], title: string, logoId: number) {
  const columnCount = Math.max(...rows.map((row) => row.length), 1);
  const dataHeaderRow = 5;

  sheet.addRow([]);
  sheet.addRow([title]);
  sheet.addRow(["ORB-LITE · Rastreo GPS satelital"]);
  sheet.addRow([]);
  sheet.addRows(rows);
  sheet.mergeCells(2, 1, 2, columnCount);
  sheet.getCell(2, 1).font = { bold: true, size: 18, color: { argb: BRAND.white } };
  sheet.getCell(2, 1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: BRAND.navy },
  };
  sheet.getCell(2, 1).alignment = { vertical: "middle" };
  sheet.getCell(3, 1).font = { italic: true, color: { argb: BRAND.slate } };

  const logo = workbookImageAnchor(logoId, 0, 0, 128, 94);
  sheet.addImage(logo.id, logo.range);
  sheet.getRow(1).height = 70;
  sheet.getRow(2).height = 30;

  const header = sheet.getRow(dataHeaderRow);
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: BRAND.navy } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.lime } };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: BRAND.navy } },
      bottom: { style: "thin", color: { argb: BRAND.navy } },
    };
  });
  sheet.getRow(dataHeaderRow).height = 28;

  for (let index = 1; index <= columnCount; index += 1) {
    sheet.getColumn(index).width = Math.min(
      34,
      Math.max(14, ...rows.map((row) => String(row[index - 1] ?? "").length + 2)),
    );
  }

  for (
    let rowNumber = dataHeaderRow + 1;
    rowNumber <= dataHeaderRow + rows.length - 1;
    rowNumber += 1
  ) {
    const row = sheet.getRow(rowNumber);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        bottom: { style: "hair", color: { argb: BRAND.border } },
      };
      cell.alignment = { vertical: "middle", wrapText: false };
      if ((rowNumber - dataHeaderRow) % 2 === 0) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND.stripe } };
      }
    });
  }

  sheet.autoFilter = {
    from: { row: dataHeaderRow, column: 1 },
    to: { row: dataHeaderRow, column: columnCount },
  };
  sheet.views = [{ state: "frozen", ySplit: dataHeaderRow }];
  sheet.properties.tabColor = BRAND.lime;
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

export async function downloadExcelWorkbook({
  filename,
  sheets,
  map,
}: {
  filename: string;
  sheets: ExcelSheetDefinition[];
  map?: ExcelMapDefinition;
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

  if (map) {
    const sheet = workbook.getWorksheet(safeSheetName(map.sheetName, 0));
    if (!sheet) throw new Error(`No se encontró la hoja ${map.sheetName}.`);

    const column = map.column ?? 6;
    const imageId = workbook.addImage({
      base64: map.dataUrl,
      extension: "png",
    });
    sheet.getCell(2, column + 1).value = map.title;
    sheet.getCell(2, column + 1).font = { bold: true, size: 14, color: { argb: BRAND.navy } };
    sheet.getCell(2, column + 1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BRAND.paleLime },
    };
    sheet.getCell(2, column + 1).alignment = { vertical: "middle" };
    const mapAnchor = workbookImageAnchor(imageId, column, 2, map.width ?? 720, map.height ?? 480);
    sheet.addImage(mapAnchor.id, mapAnchor.range);
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
