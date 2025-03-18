import React, { useEffect, useState } from 'react'
import { prepareExpenseChartData } from '../../utils/helper';
import CustomBarChart from '../../components/charts/CustomBarChart';

export default function Last30daysExpense({ data, total }) {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        console.log("Last30daysExpense Data:", data);
        const result = prepareExpenseChartData(data);
        setChartData(result);
        return () => { };
    },[data,])
    return (
        <div className='card col-span-1'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Last 30 days Expense</h5>
                <p className='text-lg font-semibold text-green-600'>${total}</p>
            </div>

            <CustomBarChart
                data={chartData}
            />
        </div>
    )
}
