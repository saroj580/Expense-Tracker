import React from 'react';
import { testPdf } from '../utils/pdftest';

const TestPDF = () => {
  const handleTestPDF = () => {
    console.log("Testing PDF generation");
    try {
      const result = testPdf();
      console.log("Test PDF generation result:", result);
    } catch (error) {
      console.error("Error in test PDF generation:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">PDF Test Page</h2>
      <p className="mb-3">This page is for testing PDF generation functionality.</p>
      
      <button 
        onClick={handleTestPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Generate Test PDF
      </button>
    </div>
  );
};

export default TestPDF; 