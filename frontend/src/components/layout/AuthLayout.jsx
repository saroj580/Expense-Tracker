import React from 'react'
import card1 from "../../assets/img/card1.png";
import { LuTrendingUpDown } from "react-icons/lu";

export default function AuthLayout({children}) {
    return (
        <div className='flex'>
            <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
                <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>
                {children}
            </div>
            <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
                <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5'></div>
                <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[20%] -right-10'></div>
                <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5'></div>
                <div className='grid grid-cols-1 z-20'>
                    <StatsInfoCard icon = {<LuTrendingUpDown />}  label = "Track your Income & Expense" value = "430,000" color = "bg-primary" />

                </div>

                <img src= {card1} className='w-80 h-80 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15' />
            </div>
          
        </div>
    )
}


const StatsInfoCard = ({icon, label, value, color}) => {
    return <div className='flex gap-10 bg-white rounded-xl shadow-purple-400/10 border border-gray-200/50 z-10 relative'>
        <div className={`w-12 h-12 justify-center flex items-center absolute top-3 left-5 text-[26px] text-white ${color} rounded-full drop-shadow-lg`} >
            {icon}
        </div>

        <div className={`w-18 h-18 flex items-center justify-center text-[20px] text-black ${label} `}>
            <h6 className='absolute left-22 text-xs mb-8 text-gray-500'>{label}</h6>
            <span className='text-[22px]  mb-[-20px] absolute left-22'>${value}</span>
        </div>
    </div>
}
