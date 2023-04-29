import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import type { PseUserSummaryApiObject } from "~/apiobject/pseusersummary.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { PseFormationApiObject } from "../apiobject/pseformation.apiobject";

type SetTextFunction = (page: PDFPage, x: number, y: number, size: number, text: string) => void
type SetSmallYesNoFunction = (page: PDFPage, x: number, y: number, checked: boolean) => void

interface PdfApi {
  readonly helveticaFont: PDFFont;
  readonly pages: PDFPage[];
  readonly pseFormation: PseFormationApiObject;
  readonly user: UserApiObject;
  readonly pseUserSummary: PseUserSummaryApiObject;
  readonly setText: SetTextFunction;
  readonly setSmallYesNo: SetSmallYesNoFunction;
}

const DEFAULT_FONT_SIZE = 12; // TODO: rename to DEFAULT_SIZE
const TOTAL_PAGES = 1;

export async function generateUserPdf(
  pseFormation: PseFormationApiObject,
  user: UserApiObject,
  pseUserSummary: PseUserSummaryApiObject
) {
  // https://pdf-lib.js.org/#modify-document

  // TODO:
  const url = "http://localhost:3000/pdf/pse-user-final-template.pdf";

  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();

  const api: PdfApi = {
    helveticaFont,
    pages,
    pseFormation,
    user,
    pseUserSummary,
    setText: (page: PDFPage, x: number, y: number, size: number, text: string) => {
      page.drawText(text, {
        x,
        // y begins at the end of the file on this lib
        // https://github.com/Hopding/pdf-lib/issues/325
        y,
        size,
        font: helveticaFont
      });
    },
    setSmallYesNo: (page: PDFPage, x: number, y: number, checked: boolean) => {

    }
  };

  drawDebugGrid(api);

  // TEST:
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  console.log({ width, height });

  // firstPage.drawText('This text was added with JavaScript!', {
  //   x: 5,
  //   y: height / 2 + 300,
  //   size: 50,
  //   color: rgb(0.95, 0.1, 0.1),
  //   rotate: degrees(-45),
  // })

  for (let i = 0; i < TOTAL_PAGES; i++) {
    drawHeader(api, pages[i], 0);
  }

  drawPage1(api);

  return await pdfDoc.save();
}

function drawDebugGrid(api: PdfApi) {

  api.pages.forEach(page => {
    const { width, height } = page.getSize();

    const gap = 30;

    for (let x = 0; x < width; x += gap) {
      page.drawText(`${x}`, {
        x: x + 1,
        y: 815,
        size: 9
      });

      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: height },
        thickness: 1,
        color: rgb(0, 0, 0),
        opacity: 0.75
      });

      for (let y = 0; y < height; y += gap) {
        page.drawText(`${y}`, {
          x: 1 + 1,
          y: y + 1,
          size: 9
        });

        if (x === 30 || x >= 550 || y === 0 || y >= 800) {
          page.drawLine({
            start: { x: 0, y },
            end: { x: width, y },
            thickness: 1,
            color: rgb(0, 0, 0),
            opacity: 0.75
          });

        }
      }
    }
  });
}

function drawHeader(api: PdfApi, page: PDFPage, yModification: number) {
  //"Dates de la formation"
  api.setText(page, 162, 605 + yModification, DEFAULT_FONT_SIZE, `${api.pseFormation.from} / ${api.pseFormation.to}`);
  // "Lieu"
  api.setText(page, 370, 29 + yModification, DEFAULT_FONT_SIZE, api.pseFormation.place.title);
  //"Nom"
  api.setText(page, 94, 580 + yModification, DEFAULT_FONT_SIZE, api.user.firstName);
  //"Prénom"
  api.setText(page, 394, 580 + yModification, DEFAULT_FONT_SIZE, api.user.lastName);
}

function drawPage1(api: PdfApi) {
  const page = api.pages[0];

  const baseY = 127.4;

  const modules = ["M1", "M2", "M3", "M5", "M6", "MCAT", "M7", "M15", "M18"];

  const yPosition = modules.map((module, index) => {
    return baseY + (index * 12) + (index >= 1 && index <= 4 ? 2 : 0);
  });

  api.pseUserSummary.preparatoryWork.preparatoryWorks.forEach((preparatoryWork, index) => {

    api.setText(
      page,
      138,
      yPosition[index],
      DEFAULT_FONT_SIZE,
      preparatoryWork.realised && preparatoryWork.realisedDate ? preparatoryWork.realisedDate.toString() : "N/A"
    );

    api.setSmallYesNo(page, 174, yPosition[index], preparatoryWork.realised);

  });
}