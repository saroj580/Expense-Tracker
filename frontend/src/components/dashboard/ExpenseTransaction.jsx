import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import { formatNepalDate } from '../../utils/helper'
import TransactionInfoCard from '../cards/TransactionInfoCard'

export default function ExpenseTransaction({ transactions, onSeeMore }) {
     console.log("ExpenseTransaction Data:", transactions);
    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Expense</h5>
                <button className="card-btn" onClick={onSeeMore}>See All <LuArrowRight className='text-base'/></button>
            </div>
            <div className="mt-6">
                {transactions?.slice(0, 5)?.map((expene) => (
                    <TransactionInfoCard
                        key={expene._id}
                        title={expene.category}
                        icon={expene.icon}
                        date={formatNepalDate(expene.date)}
                        amount={expene.amount}
                        type="expene"
                        hideDeleteBtn
                    />
                    
                ))}
            </div>
        </div>
    )
}
