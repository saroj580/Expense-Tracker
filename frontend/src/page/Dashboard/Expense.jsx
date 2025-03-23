import React, { useEffect, useState } from 'react'
import { UseUserAuth } from '../../hooks/useUserAuth'
import DahboardLayout from '../../components/layout/DahboardLayout';
import { API_PATHS } from '../../utils/apiPath';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/expense/AddExpenseForm';
import Modal from '../../components/layout/Modal';
import ExpenseList from '../../components/expense/ExpenseList';
import DeleteAlert from '../../components/layout/DeleteAlert';

export default function Expense() {
  UseUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data : null
  })
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);


   //Get all expense details
  const fetchExpenseDetails = async () => { 
    if (loading) return;
    setLoading(true);

    try {
      const respone = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);
      if (respone.data) {
        setExpenseData(respone.data);
      }

    } catch (error) {
      console.log("Something went wrong ! Please try again later", error);
    } finally {
      setLoading(false);
    }
  };

  //Handle add income 
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    //validation check
    if (!category.trim()) {
      toast.error("category is required.");
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
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        icon,
        date
      })

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Eroor adding the income", error.respone?.data.message || error.message);
      
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deted successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense: ", error.respone?.data?.message || error.message)
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const respone = axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob'
      });
      //createUrl for the blob
      const url = window.URL.createObjectURL(new Blob([respone.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the expense details", error);
      toast.error("failed to download the expense details. Please Try again later!");

    }
  }
  
  useEffect(() => {
    fetchExpenseDetails();
    return () => {

    }
  },[])

  return (
    <DahboardLayout activeMenu='Expense'>
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data : id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense details?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
        </Modal>
      </div>
    </DahboardLayout>
  );
}
