import React, { useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Text } from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

export default function CustomPieChart({ data, label, totalAmount, colors, showTextAnchor }) {
    useEffect(() => {
        console.log("Chart Props: ", { data, label, totalAmount, colors });
    }, [data, label, totalAmount, colors]);
    
    // Make sure there's always data to render
    const chartData = data && data.length > 0 ? data : [{ name: "No Data", amount: 1 }];
    
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        return null; // Disable auto labels on pie segments
    };
    
    const centerLabel = showTextAnchor ? (
        <g>
            <text
                x="50%"
                y="42%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                    fontSize: '16px',
                    fill: '#666',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                {label}
            </text>
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    fill: '#333',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                {totalAmount}
            </text>
        </g>
    ) : null;
    
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={100}
                    labelLine={false}
                    label={renderCustomizedLabel}
                >
                    {/* {Array.isArray(data) ? data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    )) : entry} */}
                    
                    {chartData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={colors[index % colors.length]} 
                        />
                    ))}
                </Pie>
                
                {centerLabel}
                
                <Tooltip content={<CustomTooltip/>}/>
                <Legend content={<CustomLegend/>}/>
            </PieChart>
        </ResponsiveContainer>
    );
}
