import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../cards/TransactionInfoCard'
import { formatNepalDate } from '../../utils/helper'

export default function RecentIncome({transactions, onSeeMore}) {
    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Income</h5>
                <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight/></button>
            </div>

            <div className='mt-6'>
                {transactions?.slice(0, 5).map((item) => (
                    <TransactionInfoCard
                        key={item._id}
                        title={item.source}
                        icon={item.icon}
                        date={formatNepalDate(expene.date)}
                        amount={item.amount}
                        type="income"
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}
