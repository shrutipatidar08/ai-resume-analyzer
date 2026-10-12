import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '../utils/formatters';

export const exportClientPdfReport = (data) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ResumeAI Pro', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('Executive ATS Compatibility & Job-Match Audit Report', 14, 21);

  // Metadata Card
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 34, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('DOCUMENT:', 18, 41);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(String(data.fileName || 'Resume Document').slice(0, 35), 42, 41);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DATE:', 18, 49);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(data.analysisDate), 42, 49);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('ENGINE:', 110, 41);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(data.aiEnhanced ? `Ollama Local AI (${data.aiModel || 'Local'})` : 'Rule-Based ATS Engine', 126, 41);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('CANDIDATE:', 110, 49);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(String(data.extractedData?.contact?.name || 'Parsed Candidate').slice(0, 25), 132, 49);

  // Scores Summary
  const cardY = 62;
  const halfWidth = (pageWidth - 32) / 2;

  // ATS Box
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(14, cardY, halfWidth, 22, 2, 2, 'FD');

  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('OVERALL ATS SCORE', 20, cardY + 7);

  doc.setTextColor(49, 46, 129);
  doc.setFontSize(16);
  doc.text(`${data.atsScore || 0} / 100`, 20, cardY + 17);

  // Job Match Box
  doc.setFillColor(240, 253, 244); // Emerald 50
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14 + halfWidth + 4, cardY, halfWidth, 22, 2, 2, 'FD');

  doc.setTextColor(21, 128, 61);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('JOB DESCRIPTION MATCH', 20 + halfWidth + 4, cardY + 7);

  const jobMatchScore = data.jobMatchResults?.hasJobMatch ? `${data.jobMatchResults.matchPercentage}%` : 'N/A';
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(16);
  doc.text(jobMatchScore, 20 + halfWidth + 4, cardY + 17);

  // Category Breakdown Table
  const cats = data.categoryScores || {};
  const catRows = [
    ['Contact Info Completeness', `${cats.contactInfo || 0}%`, 'Education Background', `${cats.education || 0}%`],
    ['Standard Section Hierarchy', `${cats.sectionCompleteness || 0}%`, 'Certifications & Credentials', `${cats.certifications || 0}%`],
    ['Technical Skills Footprint', `${cats.technicalSkills || 0}%`, 'Readability & Word Density', `${cats.readability || 0}%`],
    ['Experience & Action Metrics', `${cats.experience || 0}%`, 'Hands-on Projects Presence', `${cats.projects || 0}%`],
  ];

  autoTable(doc, {
    startY: 90,
    head: [['ATS Category', 'Score', 'ATS Category', 'Score']],
    body: catRows,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontSize: 8.5,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
    },
    margin: { left: 14, right: 14 },
  });

  let currentY = doc.lastAutoTable.finalY + 8;

  // Strengths
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Resume Strengths', 14, currentY);
  currentY += 4;

  const strengths = data.analysisResults?.strengths || [];
  strengths.slice(0, 3).forEach((s) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);
    doc.text('•', 16, currentY);
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(s, pageWidth - 36);
    doc.text(splitText, 20, currentY);
    currentY += splitText.length * 3.8 + 1;
  });

  currentY += 4;

  // Weaknesses & Gaps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Areas for Improvement', 14, currentY);
  currentY += 4;

  const weaknesses = data.analysisResults?.weaknesses || [];
  weaknesses.slice(0, 3).forEach((w) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text('•', 16, currentY);
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(w, pageWidth - 36);
    doc.text(splitText, 20, currentY);
    currentY += splitText.length * 3.8 + 1;
  });

  currentY += 4;

  // Key Technical Skills
  const skills = data.extractedData?.identifiedSkills?.all || [];
  if (skills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Identified Skills', 14, currentY);
    currentY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const skillList = skills.slice(0, 20).join(', ');
    const splitSkills = doc.splitTextToSize(skillList, pageWidth - 28);
    doc.text(splitSkills, 14, currentY);
    currentY += splitSkills.length * 4 + 4;
  }

  // AI / Recommended Executive Summary
  if (data.aiFeedback?.executiveSummary) {
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(79, 70, 229);
    doc.text('TAILORED EXECUTIVE SUMMARY', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(data.aiFeedback.executiveSummary, pageWidth - 36);
    doc.text(splitSummary, 18, currentY + 12);
  }

  // Footer Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Disclaimer: This ATS report is an estimate based on resume analysis algorithms and industry benchmarks. Not issued by an official ATS vendor.',
    pageWidth / 2,
    288,
    { align: 'center' }
  );

  const safeName = (data.fileName || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`ATS_Report_${safeName}.pdf`);
};
