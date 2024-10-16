import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomToolTip from "./CustomToolTip";

export default function DevelopmentGraph({ data }: {
    data: {
        date: string,
        market_value: number,
        yield_in_currency: number,
        yield_percentage: number
    }[]

}) {
    return (
        <>
            {data.length > 1 && (
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={
                                <CustomToolTip />
                            }
                            />
                            <Line
                                type="monotone"
                                dataKey="yield_percentage"
                                stroke='#67a1d4'
                                activeDot={{ r: 8 }}
                                dot={{ r: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )
            }
        </>
    );
}