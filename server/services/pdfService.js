const PDFDocument = require('pdfkit');

/**
 * Generates a professional multi-page ATS Analysis PDF Report buffer
 * @param {object} analysisData - Combined analysis, job match, and AI feedback results
 * @returns {Promise<Buffer>}
 */
const generatePdfReport = (analysisData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
        info: {
          Title: `ATS Resume Report - ${analysisData.fileName || 'Analysis'}`,
          Author: 'ResumeAI Pro',
          Subject: 'ATS Compatibility & Job Match Audit',
        },
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // --- Header Brand Bar ---
      doc.rect(40, 40, 515, 60).fill('#1E293B'); // Slate Navy
      doc.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold')
        .text('ResumeAI Pro', 60, 52);
      doc.fillColor('#94A3B8').fontSize(10).font('Helvetica')
        .text('Executive ATS Compatibility & Job-Match Audit', 60, 76);

      let yPos = 120;

      // --- Metadata Grid ---
      doc.rect(40, yPos, 515, 55).fill('#F8FAFC').stroke('#E2E8F0');
      doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold');
      doc.text('DOCUMENT:', 55, yPos + 12);
      doc.font('Helvetica').text(analysisData.fileName || 'Uploaded Resume', 130, yPos + 12);

      doc.font('Helvetica-Bold').text('DATE AUDITED:', 55, yPos + 32);
      doc.font('Helvetica').text(
        new Date(analysisData.analysisDate || Date.now()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        140,
        yPos + 32
      );

      doc.font('Helvetica-Bold').text('ANALYSIS ENGINE:', 320, yPos + 12);
      doc.font('Helvetica').text(
        analysisData.aiEnhanced ? `Ollama Local AI (${analysisData.aiModel || 'Local Model'})` : 'Rule-Based ATS Engine',
        430,
        yPos + 12
      );

      doc.font('Helvetica-Bold').text('CANDIDATE:', 320, yPos + 32);
      doc.font('Helvetica').text(
        analysisData.extractedData?.contact?.name || 'Identified from resume',
        395,
        yPos + 32
      );

      yPos += 75;

      // --- Scores Summary Cards ---
      // ATS Score Card
      doc.rect(40, yPos, 245, 70).fill('#EEF2FF').stroke('#C7D2FE');
      doc.fillColor('#4338CA').fontSize(11).font('Helvetica-Bold')
        .text('OVERALL ATS COMPATIBILITY', 55, yPos + 12);
      doc.fillColor('#312E81').fontSize(26).font('Helvetica-Bold')
        .text(`${analysisData.atsScore || 0} / 100`, 55, yPos + 30);

      // Job Match Score Card
      const hasJobMatch = analysisData.jobMatchResults?.hasJobMatch;
      const jobScore = hasJobMatch ? `${analysisData.jobMatchResults.matchPercentage}%` : 'N/A';
      
      doc.rect(310, yPos, 245, 70).fill('#F0FDF4').stroke('#BBF7D0');
      doc.fillColor('#15803D').fontSize(11).font('Helvetica-Bold')
        .text('JOB DESCRIPTION MATCH', 325, yPos + 12);
      doc.fillColor('#166534').fontSize(26).font('Helvetica-Bold')
        .text(jobScore, 325, yPos + 30);

      yPos += 90;

      // --- Section: Category Breakdown ---
      doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold')
        .text('1. Category Breakdown Scores', 40, yPos);
      yPos += 20;

      const cats = analysisData.categoryScores || {};
      const catList = [
        ['Contact Details', `${cats.contactInfo || 0}%`],
        ['Section Completeness', `${cats.sectionCompleteness || 0}%`],
        ['Technical Skills', `${cats.technicalSkills || 0}%`],
        ['Work Experience & Impact', `${cats.experience || 0}%`],
        ['Projects Section', `${cats.projects || 0}%`],
        ['Education', `${cats.education || 0}%`],
        ['Certifications', `${cats.certifications || 0}%`],
        ['Readability & Formatting', `${cats.readability || 0}%`],
      ];

      catList.forEach(([label, val], idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = col === 0 ? 40 : 310;
        const itemY = yPos + row * 22;

        doc.rect(x, itemY, 245, 18).fill('#F1F5F9');
        doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold').text(label, x + 10, itemY + 4);
        doc.fillColor('#0F172A').text(val, x + 205, itemY + 4);
      });

      yPos += Math.ceil(catList.length / 2) * 22 + 25;

      // --- Section: Skills Identified ---
      doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold')
        .text('2. Identified Technical Skills', 40, yPos);
      yPos += 18;

      const skills = analysisData.extractedData?.identifiedSkills?.all || [];
      const skillText = skills.length > 0 ? skills.slice(0, 24).join('  •  ') : 'None identified in dictionary.';
      
      doc.fillColor('#475569').fontSize(9).font('Helvetica')
        .text(skillText, 40, yPos, { width: 515, align: 'left', lineGap: 3 });

      yPos = doc.y + 20;

      // Check if need new page
      if (yPos > 680) {
        doc.addPage();
        yPos = 40;
      }

      // --- Section: Strengths & Weaknesses ---
      doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold')
        .text('3. Key Strengths Grounded in Resume', 40, yPos);
      yPos += 18;

      const strengths = analysisData.analysisResults?.strengths || [];
      strengths.slice(0, 4).forEach((str) => {
        doc.fillColor('#16A34A').fontSize(10).font('Helvetica-Bold').text('✓ ', 40, yPos);
        doc.fillColor('#334155').fontSize(9).font('Helvetica').text(str, 55, yPos, { width: 500 });
        yPos = doc.y + 4;
      });

      yPos += 10;
      if (yPos > 680) {
        doc.addPage();
        yPos = 40;
      }

      doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold')
        .text('4. Weaknesses & Missing Keywords', 40, yPos);
      yPos += 18;

      const weaknesses = analysisData.analysisResults?.weaknesses || [];
      weaknesses.slice(0, 4).forEach((weak) => {
        doc.fillColor('#DC2626').fontSize(10).font('Helvetica-Bold').text('! ', 40, yPos);
        doc.fillColor('#334155').fontSize(9).font('Helvetica').text(weak, 55, yPos, { width: 500 });
        yPos = doc.y + 4;
      });

      if (hasJobMatch && analysisData.jobMatchResults?.missingKeywords?.length > 0) {
        yPos += 6;
        doc.fillColor('#B91C1C').fontSize(9).font('Helvetica-Bold')
          .text(`Missing Target Keywords: ${analysisData.jobMatchResults.missingKeywords.slice(0, 8).join(', ')}`, 55, yPos, { width: 500 });
        yPos = doc.y + 10;
      }

      yPos += 10;
      if (yPos > 650) {
        doc.addPage();
        yPos = 40;
      }

      // --- Section: Tailored Recommendations & Rewrite ---
      doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold')
        .text('5. High-Impact Improvement Recommendations', 40, yPos);
      yPos += 18;

      const tips = analysisData.analysisResults?.improvementTips || [];
      tips.slice(0, 4).forEach((tip) => {
        doc.fillColor('#4F46E5').fontSize(10).font('Helvetica-Bold').text('→ ', 40, yPos);
        doc.fillColor('#334155').fontSize(9).font('Helvetica').text(tip, 55, yPos, { width: 500 });
        yPos = doc.y + 4;
      });

      // Executive Summary
      if (analysisData.aiFeedback?.executiveSummary) {
        yPos += 12;
        if (yPos > 680) {
          doc.addPage();
          yPos = 40;
        }
        doc.rect(40, yPos, 515, 60).fill('#F8FAFC').stroke('#CBD5E1');
        doc.fillColor('#0F172A').fontSize(9).font('Helvetica-Bold')
          .text('RECOMMENDED EXECUTIVE SUMMARY:', 55, yPos + 10);
        doc.fillColor('#475569').fontSize(8.5).font('Helvetica')
          .text(analysisData.aiFeedback.executiveSummary, 55, yPos + 24, { width: 485 });
        yPos += 75;
      }

      // Footer disclaimer
      doc.fillColor('#94A3B8').fontSize(7.5).font('Helvetica')
        .text(
          'Disclaimer: This ATS score and feedback is an algorithmic estimate calculated using document parsing heuristics and industry benchmarks. It does not represent an endorsement from any proprietary applicant tracking software.',
          40,
          770,
          { width: 515, align: 'center' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generatePdfReport,
};
