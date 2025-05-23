import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import { formatNepalDate } from '../../utils/helper'
import TransactionInfoCard from '../cards/TransactionInfoCard';

export default function RecentTransaction({transactions, onSeeMore}) {
  return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Recent Transactions</h5>
                <button onClick={onSeeMore} className='card-btn'>
                    See All
                    <LuArrowRight className='text-base'/>
                </button>
            </div>
            <div className='mt-6'>
                {transactions?.slice(0, 5)?.map((item) => (
                    <TransactionInfoCard 
                        key={item._id}
                        title={item.type === "expense" ? item.category : item.source}
                        icon={item.icon}
                        date={formatNepalDate(item.date)}
                        amount={item.amount}
                        type={item.type}
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}
