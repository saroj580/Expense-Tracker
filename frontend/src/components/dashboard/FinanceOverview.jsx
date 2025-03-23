import React, { useMemo } from 'react'
import CustomPieChart from '../charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

export default function FinanceOverview({totalBalance, totalIncome, totalExpense}) {
    const balanceData = useMemo(() => {
        return [
            { name: "Income", amount: totalIncome || 0 },
            { name: "Expense", amount: totalExpense || 0 },
            { name: "Balance", amount: totalBalance || 0 },
        ].filter(item => item.amount > 0); // Only include positive values
    }, [totalBalance, totalIncome, totalExpense]);

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Finance Overview</h5>
            </div>

            <CustomPieChart
                data={balanceData.length > 0 ? balanceData : [{ name: "No Data", amount: 1 }]}
                label="Total Balance"
                totalAmount={`$${totalBalance || 0}`}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    )
}
