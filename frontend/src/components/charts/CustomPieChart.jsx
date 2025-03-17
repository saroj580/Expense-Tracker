import React, { useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

export default function CustomPieChart({ data = [], label, totalAmount, colors, showTextAnchor }) {

    useEffect(() => {
        console.log("Chart Props: ", { data, label, totalAmount, colors });
    }, [data, label, totalAmount, colors]);
    
    return (
        <ResponsiveContainer width="100%" height={380}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={100}
                    labelLine = {false}
                >
                    {Array.isArray(data) ? data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    )) : null }
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend content={<CustomLegend/>}/>

                {showTextAnchor && (
                    <>
                        <text
                            x="50%"
                            y="50%"
                            dy={-25}
                            textAnchor='middle'
                            dominantBaseline="central"
                            fill='#666'
                            fontSize="14px"
                        >
                            {label}
                        </text>
                        <text
                            x="50%"
                            y="50%"
                            dy={20}
                            textAnchor='middle'
                            dominantBaseline="central"
                            fill='#333'
                            fontSize="24px"
                            fontWeight="semi-bold"
                        
                        >
                            {totalAmount}
                        </text>
                    </>
                )}
            </PieChart>
        </ResponsiveContainer>
    )
}
