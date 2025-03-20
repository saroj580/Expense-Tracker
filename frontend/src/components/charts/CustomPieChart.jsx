import React, { useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

export default function CustomPieChart({ data, label, totalAmount, colors, showTextAnchor }) {

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
                    outerRadius={100}
                    innerRadius={60}
                    labelLine = {false}
                >
                    {/* {Array.isArray(data) ? data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    )) : entry} */}
                    
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
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
                            fill='#666'
                            fontSize="14px"
                        >
                            {label}
                        </text>
                        <text
                            x="50%"
                            y="50%"
                            dy={8}
                            textAnchor='middle'
                            fill='#333'
                            fontSize="24px"
                            fontWeight="600"
                        
                        >
                            {totalAmount}
                        </text>
                    </>
                )}
            </PieChart>
        </ResponsiveContainer>
    )
}
