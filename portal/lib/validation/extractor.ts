import mammoth from "mammoth";
import Tesseract from "tesseract.js";

function extractTextFromTextFile(buffer: Buffer) {
  return buffer.toString("utf-8");
}

async function extractTextFromPdf(buffer: Buffer) {
  // Avoid pdf-parse package entrypoint: it can run debug code under bundlers.
  const parsePdf = require("pdf-parse/lib/pdf-parse.js") as (
    dataBuffer: Buffer,
  ) => Promise<{ text?: string }>;
  const result = await parsePdf(buffer);
  return result.text ?? "";
}

async function extractTextFromWord(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? "";
}

async function extractTextFromImage(buffer: Buffer) {
  const { data } = await Tesseract.recognize(buffer, "eng");
  return data?.text ?? "";
}

export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = (file.type || "").toLowerCase();
  const extension = (file.name.split(".").pop() || "").toLowerCase();
  const isPdf =
    extension === "pdf" ||
    mimeType === "application/pdf" ||
    mimeType === "application/x-pdf";
  const isWord =
    extension === "doc" ||
    extension === "docx" ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isImage =
    extension === "png" ||
    extension === "jpg" ||
    extension === "jpeg" ||
    mimeType.startsWith("image/");

  if (isPdf) {
    return await extractTextFromPdf(buffer);
  }

  if (isWord) {
    return await extractTextFromWord(buffer);
  }

  if (isImage) {
    return await extractTextFromImage(buffer);
  }

  return extractTextFromTextFile(buffer);
}
