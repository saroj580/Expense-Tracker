import React, { useEffect, useState } from 'react';
import DahboardLayout from '../../components/layout/DahboardLayout';
import { UseUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import TransactionInfoCard from '../../components/cards/TransactionInfoCard';
import { formatNepalDate } from '../../utils/helper';
import Modal from '../../components/layout/Modal';
import DeleteAlert from '../../components/layout/DeleteAlert';
import toast from 'react-hot-toast';

export default function RecentTransactions() {
  UseUserAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });

  const fetchTransactions = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      if (response.data && response.data.recentTransaction) {
        setTransactions(response.data.recentTransaction);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id, type) => {
    try {
      if (type === 'income') {
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      } else if (type === 'expense') {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      }
      
      setOpenDeleteAlert({ show: false, data: null });
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} deleted successfully.`);
      fetchTransactions();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error.response?.data?.message || error.message);
      toast.error(`Failed to delete ${type}. Please try again.`);
    }
  };

  // Group transactions by date
  const groupTransactionsByDate = () => {
    if (!transactions || transactions.length === 0) return {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const groups = {};
    
    transactions.forEach(transaction => {
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
    });
    
    return groups;
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const groupedTransactions = groupTransactionsByDate();
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

  return (
    <DahboardLayout activeMenu='Transactions'>
      <div className='my-5 mx-auto'>
        <h3 className='text-xl font-semibold mb-4'>Recent Transactions</h3>
        
        {loading ? (
          <div className="text-center py-4">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-4">No transactions found</div>
        ) : (
          <div className='card'>
            {dateGroups.map(dateGroup => (
              <div key={dateGroup} className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2 px-3 pt-2 border-t border-gray-100">
                  {dateGroup}
                </h4>
                {groupedTransactions[dateGroup].map(item => (
                  <TransactionInfoCard 
                    key={item._id}
                    title={item.type === "expense" ? item.category : item.source}
                    icon={item.icon}
                    date={formatNepalDate(item.date)} 
                    amount={item.amount}
                    type={item.type}
                    onDelete={() => setOpenDeleteAlert({ 
                      show: true, 
                      data: { 
                        id: item._id, 
                        type: item.type 
                      } 
                    })}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title={`Delete ${openDeleteAlert.data?.type === 'income' ? 'Income' : 'Expense'}`}
      >
        <DeleteAlert
          content={`Are you sure you want to delete this ${openDeleteAlert.data?.type === 'income' ? 'income' : 'expense'} transaction?`}
          onDelete={() => openDeleteAlert.data && handleDeleteTransaction(
            openDeleteAlert.data.id, 
            openDeleteAlert.data.type
          )}
        />
      </Modal>
    </DahboardLayout>
  );
} 