import React from 'react'
import CustomPieChart from '../charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];


export default function FinanceOverview({totalBalance, totalIncome,totalExpense,}) {

    const balanceData = [
        { name: "Total Balance", amount: totalBalance || 0},
        { name: "Total Expense", amount: totalExpense || 0},
        { name: "Total Income", amount: totalIncome || 0},
    ];

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Finanace Overview</h5>
            </div>

            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                totalAmount={`${totalBalance}`}
                colors = {COLORS}
                showTextAnchor
            />
        </div>
    )
}
