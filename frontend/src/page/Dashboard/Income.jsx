import React, { useEffect } from 'react'
import DahboardLayout from '../../components/layout/DahboardLayout'
import { useState } from 'react'
import IncomeOverview from '../../components/income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import AddIncomeForm from '../../components/income/AddIncomeForm';
import Modal from '../../components/layout/Modal';
import toast from 'react-hot-toast';
import IncomeList from '../../components/income/IncomeList';
import DeleteAlert from '../../components/layout/DeleteAlert';
import { UseUserAuth } from '../../hooks/useUserAuth';
import { generateTransactionsPDF } from '../../utils/pdfGenerator';

export default function Income() {
  UseUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data : null
  })
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  //Get all income details
  const fetchIncomeDetails = async () => { 
    if (loading) return;
    setLoading(true);

    try {
      const respone = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);
      if (respone.data) {
        setIncomeData(respone.data);
      }

    } catch (error) {
      console.log("Something went wrong ! Please try again later", error);
    } finally {
      setLoading(false);
    }
  };

  //Handle add income 
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    //validation check
    if (!source.trim()) {
      toast.error("Source is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount <= 0 )) {
      toast.error("Amount should be valid number greater than the 0.");
      return;
    }

    if(!date){
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        icon,
        date
      })

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Eroor adding the income", error.respone?.data.message || error.message);
      
    }
   };

  //delete income 
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deted successfully.");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income: ", error.respone?.data?.message || error.message)
    }
  };

  //Handle Download income
  const handleDownloadIncomeDetails = async () => {
    try {
      const respone = axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob'
      });
      //createUrl for the blob
      const url = window.URL.createObjectURL(new Blob([respone.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the income details", error);
      toast.error("failed to download the income details. Please Try again later!");

    }
  };

  const handlePdfDownload = () => {
    if (!incomeData || !Array.isArray(incomeData) || incomeData.length === 0) {
      toast.error('No income data available to generate PDF');
      return;
    }
    
    console.log("PDF Download requested for", incomeData.length, "income transactions");
    try {
      // Validate income data format
      const invalidItems = incomeData.filter(item => !item || typeof item !== 'object' || !item.type);
      if (invalidItems.length > 0) {
        console.warn(`Found ${invalidItems.length} items with missing or invalid data:`, invalidItems);
      }
      
      // Add type field if missing
      const processedData = incomeData.map(item => {
        if (!item) return null;
        // Ensure all items have a type field set to 'income'
        return { ...item, type: 'income' };
      }).filter(Boolean); // Remove any null entries
      
      console.log("Starting PDF generation with", processedData.length, "income items");
      generateTransactionsPDF(processedData, 'Income Report');
      console.log("PDF generation completed successfully");
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => { };
  },[])
  return (
    <DahboardLayout activeMenu='Income'>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList 
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
            onPdfDownload={handlePdfDownload}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <div>
            <AddIncomeForm 
              onAddIncome={handleAddIncome}
            />
          </div>
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income details?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
        
      </div>
    </DahboardLayout>
  )
}
