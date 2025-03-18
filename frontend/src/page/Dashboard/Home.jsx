import { useNavigate } from 'react-router-dom';
import DahboardLayout from '../../components/layout/DahboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import InfoCard from '../../components/cards/InfoCard';

import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import { addThousandsSeparator } from '../../utils/helper';
import RecentTransaction from '../../components/dashboard/RecentTransaction';
import FinanceOverview from '../../components/dashboard/FinanceOverview';
import ExpenseTransaction from './ExpenseTransaction';
import Last30daysExpense from './Last30daysExpense';
import RecentIncomeWithChart from './RecentIncomeWithChart';

export default function Home() {
  useUserAuth();

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading)
      return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      console.log("Backend Response:", response.data);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again later.", error);      
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();

  }, []);

  useEffect(() => {
    if (dashboardData) {
      console.log("Dashboard Data:", dashboardData);
      console.log("Last 30 Days Expenses:", dashboardData.last30DaysExpenses);
    }
  }, [dashboardData]);  

  return (
    <DahboardLayout activeMenu='Dashboard'>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color = "bg-primary "
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color = "bg-orange-500 "
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color = "bg-red-500 "
          />

          
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-6'>
          <RecentTransaction
            transactions={dashboardData?.recentTransaction}
            onSeeMore = {() => navigate("/expsense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransaction
            transactions={dashboardData?.recentTransaction || []}
            onSeeMore={() => navigate('/expense')}
          />
          <Last30daysExpense
            data={dashboardData?.last30DaysExpenses?.transaction || []} // Use "last30DaysExpenses" and "transaction"
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transaction?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0} 
          />
        </div>
      </div>
    </DahboardLayout>
  );
}
