import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const testPdf = () => {
  console.log("Creating test PDF");
  try {

    const doc = new jsPDF();
    

    doc.text("Test PDF", 10, 10);

    console.log("autoTable available directly:", typeof autoTable === 'function');
    console.log("autoTable available on doc:", typeof doc.autoTable === 'function');
    
    if (typeof autoTable === 'function') {
      console.log("Using direct autoTable function");
      autoTable(doc, {
        head: [['Name', 'Age']],
        body: [
          ['John', '25'],
          ['Jane', '30']
        ]
      });
    } 
    else if (typeof doc.autoTable === 'function') {
      console.log("Using doc.autoTable method");
      doc.autoTable({
        head: [['Name', 'Age']],
        body: [
          ['John', '25'],
          ['Jane', '30']
        ]
      });
    } else {
      console.error("Neither autoTable approach is available");
    }
    

    doc.save("test.pdf");
    return true;
  } catch (error) {
    console.error("Error in testPdf:", error);
    return false;
  }
}; 