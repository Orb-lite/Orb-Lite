import type { Worksheet } from "exceljs";

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

function styleSheet(sheet: Worksheet, rows: ExcelCell[][]) {
  sheet.addRows(rows);
  const header = sheet.getRow(1);
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const columnCount = Math.max(...rows.map((row) => row.length), 1);
  for (let index = 1; index <= columnCount; index += 1) {
    sheet.getColumn(index).width = Math.min(
      34,
      Math.max(14, ...rows.map((row) => String(row[index - 1] ?? "").length + 2)),
    );
  }
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

  for (const [index, definition] of sheets.entries()) {
    const sheet = workbook.addWorksheet(safeSheetName(definition.name, index));
    styleSheet(sheet, definition.rows);
  }

  if (map) {
    const sheet = workbook.getWorksheet(safeSheetName(map.sheetName, 0));
    if (!sheet) throw new Error(`No se encontró la hoja ${map.sheetName}.`);

    const column = map.column ?? 6;
    const imageId = workbook.addImage({
      base64: map.dataUrl,
      extension: "png",
    });
    sheet.getCell(1, column + 1).value = map.title;
    sheet.getCell(1, column + 1).font = { bold: true, size: 14, color: { argb: "FF1E293B" } };
    sheet.getCell(1, column + 1).alignment = { vertical: "middle" };
    sheet.addImage(imageId, {
      tl: { col: column, row: 1 },
      ext: { width: map.width ?? 720, height: map.height ?? 480 },
    });
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
