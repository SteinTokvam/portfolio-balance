import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function HoldingsDiagram({ data }: {
    data: {
        percentage: number,
        type: string
    }[]
}) {
    console.log(data)
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const RADIAN = Math.PI / 180;
    
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, type }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius+80) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${type}: `}
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


    return (
        <>
            {data.length > 1 && (
                <div style={{ width: '100%', height: 300, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                paddingAngle={3}
                                innerRadius={40}
                                outerRadius={80}
                                label={renderCustomizedLabel}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )
            }
        </>
    );
}