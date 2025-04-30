import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatNepalDate } from './helper';

/**
 * Generate a PDF of transactions
 * @param {Array} transactions - The transactions to include in the PDF
 * @param {String} title - The title of the PDF document
 */
export const generateTransactionsPDF = (transactions, title = 'Transactions Report') => {
  try {
    // Validate transactions data
    if (!Array.isArray(transactions)) {
      console.error("Invalid transactions data: not an array", transactions);
      throw new Error("Cannot generate PDF: transactions data is not an array");
    }
    
    // Check for malformed transactions and log them
    const problematicTransactions = transactions.filter(t => !t || typeof t !== 'object' || !t.type);
    if (problematicTransactions.length > 0) {
      console.warn(`Found ${problematicTransactions.length} transactions with missing or invalid type:`, problematicTransactions);
    }
    
    // Initialize the PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Group transactions by date
    const groupedTransactions = groupTransactionsByDate(transactions);
    const dateGroups = Object.keys(groupedTransactions).sort((a, b) => {
      if (a === 'Today') return -1;
      if (b === 'Today') return 1;
      if (a === 'Yesterday') return -1;
      if (b === 'Yesterday') return 1;
      
      // For other dates, sort in descending order (newest first)
      const dateA = new Date(groupedTransactions[a][0].date);
      const dateB = new Date(groupedTransactions[b][0].date);
      return dateB - dateA;
    });
    
    let yPosition = 40;
    
    // Loop through date groups
    dateGroups.forEach(dateGroup => {
      // Add date heading
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(dateGroup, 14, yPosition);
      yPosition += 10;
      
      // Prepare table data for this date group
      const tableData = groupedTransactions[dateGroup].map(item => {
        // Safely extract type, category, source and amount with null checking
        const type = item?.type || '';
        const category = item?.category || '';
        const source = item?.source || '';
        const amount = item?.amount || 0;
        
        return [
          type === "expense" ? category : source,
          type.charAt(0).toUpperCase() + type.slice(1),
          `Rs. ${amount}`
        ];
      });
      
      // Generate table for this date group using imported autoTable function
      autoTable(doc, {
        startY: yPosition,
        head: [['Title', 'Type', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] },
        styles: { overflow: 'linebreak' },
        margin: { left: 14, right: 14 }
      });
      
      // Get the final Y position after the table
      const finalY = doc.previousAutoTable.finalY;
      yPosition = finalY + 15;
      
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Calculate total income and expenses
    const totalIncome = transactions
      .filter(t => t?.type === 'income')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);
      
    const totalExpense = transactions
      .filter(t => t?.type === 'expense')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);
    
    // Add summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, yPosition);
    yPosition += 10;
    
    // Generate summary table using imported autoTable function
    autoTable(doc, {
      startY: yPosition,
      head: [['Description', 'Amount']],
      body: [
        ['Total Income', `Rs. ${totalIncome}`],
        ['Total Expense', `Rs. ${totalExpense}`],
        ['Balance', `Rs. ${totalIncome - totalExpense}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66] },
      bodyStyles: { fontStyle: 'bold' },
      styles: { overflow: 'linebreak' },
      margin: { left: 14, right: 14 }
    });
    
    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Helper function to group transactions by date
const groupTransactionsByDate = (transactions) => {
  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) return {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const groups = {};
  
  transactions.forEach(transaction => {
    // Skip invalid transactions
    if (!transaction || typeof transaction !== 'object' || !transaction.date) {
      console.warn("Skipping invalid transaction:", transaction);
      return;
    }
    
    try {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);
      
      let dateLabel;
      
      if (transactionDate.getTime() === today.getTime()) {
        dateLabel = 'Today';
      } else if (transactionDate.getTime() === yesterday.getTime()) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = formatNepalDate(transaction.date);
      }
      
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      
      groups[dateLabel].push(transaction);
    } catch (error) {
      console.warn("Error processing transaction date:", transaction, error);
    }
  });
  
  return groups;
}; 