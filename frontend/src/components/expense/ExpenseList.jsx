import React from 'react'
import { LuDownload } from 'react-icons/lu'
import { FiFileText } from 'react-icons/fi'
import TransactionInfoCard from '../cards/TransactionInfoCard'
import { formatNepalDate } from '../../utils/helper'

export default function ExpenseList({transactions, onDelete, onDownload, onPdfDownload}) {
    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>All Expenses</h5>
                <div className="flex gap-2">
                    <button className='card-btn' onClick={onPdfDownload}>
                        <FiFileText className='text-base'/>PDF
                    </button>
                    <button className='card-btn' onClick={onDownload}>
                        <LuDownload className='text-base'/>Excel
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                {
                    transactions?.map((expense) => (
                        <TransactionInfoCard 
                            key={expense._id}
                            title={expense.category}
                            icon={expense.icon}
                            date={formatNepalDate(expense.date)}
                            amount={expense.amount}
                            type="expense"
                            onDelete={() => onDelete(expense._id)}
                        />
                    ))
                }
            </div>
        </div>
    )
}
