const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

/**
 * Extracts raw text from an uploaded resume buffer (PDF or DOCX).
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} originalName - Original uploaded filename
 * @param {string} mimeType - Uploaded file mime type
 * @returns {Promise<{ text: string, pageCount: number, format: string }>}
 */
const extractTextFromResume = async (buffer, originalName, mimeType) => {
  if (!buffer || buffer.length === 0) {
    throw new Error('Uploaded file is empty or corrupted. Please upload a valid document.');
  }

  const ext = path.extname(originalName || '').toLowerCase();
  let extractedText = '';
  let pageCount = 1;
  let format = 'unknown';

  if (ext === '.pdf' || mimeType === 'application/pdf') {
    format = 'PDF';
    try {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || '';
      pageCount = pdfData.numpages || 1;
    } catch (pdfErr) {
      console.error('PDF parsing error:', pdfErr.message);
      throw new Error(
        `Failed to parse PDF document (${pdfErr.message}). Ensure the file is not password-protected or corrupted.`
      );
    }
  } else if (
    ext === '.docx' ||
    ext === '.doc' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    format = 'DOCX';
    try {
      const docxResult = await mammoth.extractRawText({ buffer: buffer });
      extractedText = docxResult.value || '';
      // Approximate page count for docx based on word count (~450 words per page)
      const wordEst = extractedText.trim().split(/\s+/).length;
      pageCount = Math.max(1, Math.ceil(wordEst / 450));
    } catch (docxErr) {
      console.error('DOCX parsing error:', docxErr.message);
      throw new Error(
        `Failed to extract text from Word document (${docxErr.message}). Ensure the document is in standard .docx format.`
      );
    }
  } else {
    throw new Error(
      `Unsupported file type '${ext}'. Please upload a standard PDF (.pdf) or Word document (.docx).`
    );
  }

  // Clean up white space and normalize line breaks
  const cleanedText = extractedText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ +/g, ' ')
    .trim();

  // Validate extracted text length to catch scanned or image-only documents
  const wordCount = cleanedText ? cleanedText.split(/\s+/).filter(Boolean).length : 0;

  if (wordCount < 20 || cleanedText.length < 100) {
    throw new Error(
      'Unable to extract readable text from this document. If this is a scanned image or photo PDF, please convert it using OCR or upload a text-selectable PDF/Word document.'
    );
  }

  return {
    text: cleanedText,
    pageCount,
    format,
    wordCount,
    charCount: cleanedText.length,
  };
};

module.exports = {
  extractTextFromResume,
};
