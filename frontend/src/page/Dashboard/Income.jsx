import React, { useEffect } from 'react'
import DahboardLayout from '../../components/layout/DahboardLayout'
import { useState } from 'react'
import IncomeOverview from '../../components/income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useFetcher } from 'react-router-dom';
import Modal from '../../components/income/Modal';
import AddIncomeForm from '../../components/income/AddIncomeForm';

export default function Income() {
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
  const handleAddIncome = async (income) => { };

  //delete income 
  const deleteIncome = async (id) => { };

  //Handle Download income
  const handleDownloadIncomeDetails = async () => { };

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
      </div>
    </DahboardLayout>
  )
}
