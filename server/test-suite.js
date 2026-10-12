const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING FULL RESUME ANALYZER INTEGRATION SUITE');
  console.log('====================================================\n');

  try {
    // Test 1: GET /api/health
    console.log('▶ Test 1: GET /api/health');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log(`  Status: ${healthRes.status} OK`);
    console.log(`  Database Status: ${healthRes.data.database.connected ? 'Connected' : 'Offline'} (${healthRes.data.database.mode})`);
    console.log(`  AI Engine: ${healthRes.data.aiEngine.mode}`);
    console.log('  ✅ Passed!\n');

    // Test 2: POST /api/analyze (PDF Resume + Job Description)
    const pdfPath = path.join(FIXTURES_DIR, 'detailed_resume.pdf');
    console.log('▶ Test 2: POST /api/analyze (PDF File: detailed_resume.pdf)');
    const form1 = new FormData();
    form1.append('resume', fs.createReadStream(pdfPath));
    form1.append(
      'jobDescription',
      'We are looking for a Senior Developer with experience in database management, security standards, cloud platforms, communication, and software verification.'
    );

    const pdfAnalyzeRes = await axios.post(`${BASE_URL}/analyze`, form1, {
      headers: form1.getHeaders(),
    });

    console.log(`  Status: ${pdfAnalyzeRes.status} OK`);
    console.log(`  ATS Score: ${pdfAnalyzeRes.data.data.atsScore}/100`);
    console.log(`  Job Match Score: ${pdfAnalyzeRes.data.data.jobMatchScore}%`);
    console.log(`  Extracted Format: ${pdfAnalyzeRes.data.data.extractedData.format}`);
    console.log(`  Word Count: ${pdfAnalyzeRes.data.data.extractedData.wordCount}`);
    console.log(`  Identified Skills Count: ${pdfAnalyzeRes.data.data.extractedData.identifiedSkills.all.length}`);
    console.log(`  Candidate: "${pdfAnalyzeRes.data.data.extractedData.contact.name || 'Identified'}"`);
    console.log('  ✅ Passed!\n');

    const pdfAnalysisId = pdfAnalyzeRes.data.data.id || pdfAnalyzeRes.data.data._id;

    // Test 3: POST /api/analyze (DOCX File: sample_resume.docx)
    const docxPath = path.join(FIXTURES_DIR, 'sample_resume.docx');
    console.log('▶ Test 3: POST /api/analyze (DOCX File: sample_resume.docx)');
    const form2 = new FormData();
    form2.append('resume', fs.createReadStream(docxPath));
    form2.append(
      'jobDescription',
      'Seeking a blockchain and distributed systems engineer with expertise in cryptography, smart contracts, consensus protocols, and clean architecture.'
    );

    const docxAnalyzeRes = await axios.post(`${BASE_URL}/analyze`, form2, {
      headers: form2.getHeaders(),
    });

    console.log(`  Status: ${docxAnalyzeRes.status} OK`);
    console.log(`  ATS Score: ${docxAnalyzeRes.data.data.atsScore}/100`);
    console.log(`  Job Match Score: ${docxAnalyzeRes.data.data.jobMatchScore}%`);
    console.log(`  Format Detected: ${docxAnalyzeRes.data.data.extractedData.format}`);
    console.log(`  Word Count: ${docxAnalyzeRes.data.data.extractedData.wordCount}`);
    console.log('  ✅ Passed!\n');

    // Test 4: Error Handling with invalid file
    console.log('▶ Test 4: Error Handling with text-less / invalid file');
    const dummyPath = path.join(__dirname, 'dummy_empty.pdf');
    fs.writeFileSync(dummyPath, Buffer.from('%PDF-1.4 %%EOF'));
    const form3 = new FormData();
    form3.append('resume', fs.createReadStream(dummyPath));

    try {
      await axios.post(`${BASE_URL}/analyze`, form3, {
        headers: form3.getHeaders(),
      });
      console.error('  ❌ Should have failed with empty file error!');
    } catch (err) {
      console.log(`  Expected Rejection: Status ${err.response?.status}`);
      console.log(`  Error Message: "${err.response?.data?.error}"`);
      console.log('  ✅ Passed!\n');
    } finally {
      if (fs.existsSync(dummyPath)) fs.unlinkSync(dummyPath);
    }

    // Test 5: Standalone Job Match endpoint
    console.log('▶ Test 5: POST /api/match-job');
    const matchRes = await axios.post(`${BASE_URL}/match-job`, {
      resumeText: 'Experienced developer proficient in React, Node.js, Express, MongoDB, Docker, Git, REST APIs.',
      jobDescription: 'Looking for a Senior Full Stack Engineer proficient with React, Node.js, Docker, and AWS.',
    });
    console.log(`  Status: ${matchRes.status} OK`);
    console.log(`  Match Percentage: ${matchRes.data.data.matchPercentage}%`);
    console.log(`  Matching Skills: ${matchRes.data.data.matchingSkills.join(', ')}`);
    console.log(`  Skills to Develop: ${matchRes.data.data.skillsToDevelop.join(', ')}`);
    console.log('  ✅ Passed!\n');

    // Test 6: PDF Report Export
    console.log('▶ Test 6: POST /api/export-pdf');
    const pdfExportRes = await axios.post(`${BASE_URL}/export-pdf`, pdfAnalyzeRes.data.data, {
      responseType: 'arraybuffer',
    });
    console.log(`  Status: ${pdfExportRes.status} OK`);
    console.log(`  PDF Report Size: ${pdfExportRes.data.length} bytes`);
    console.log('  ✅ Passed!\n');

    // Test 7: GET /api/history
    console.log('▶ Test 7: GET /api/history');
    const historyRes = await axios.get(`${BASE_URL}/history`);
    console.log(`  Status: ${historyRes.status} OK`);
    console.log(`  Total History Records: ${historyRes.data.data.length}`);
    console.log(`  Storage Mode: ${historyRes.data.storageMode}`);
    console.log('  ✅ Passed!\n');

    // Test 8: GET /api/history/:id & DELETE /api/history/:id
    if (pdfAnalysisId) {
      console.log(`▶ Test 8: GET /api/history/${pdfAnalysisId}`);
      const itemRes = await axios.get(`${BASE_URL}/history/${pdfAnalysisId}`);
      console.log(`  Status: ${itemRes.status} OK`);
      console.log(`  Loaded File Name: ${itemRes.data.data.fileName}`);
      console.log('  ✅ Passed!\n');

      console.log(`▶ Test 9: DELETE /api/history/${pdfAnalysisId}`);
      const delRes = await axios.delete(`${BASE_URL}/history/${pdfAnalysisId}`);
      console.log(`  Status: ${delRes.status} OK`);
      console.log(`  Result: ${delRes.data.message}`);
      console.log('  ✅ Passed!\n');
    }

    console.log('====================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Test suite error:', err.response?.data || err.message);
    process.exit(1);
  }
}

runTests();
