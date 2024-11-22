import { useTheme } from "../../hooks/use-theme";
import { TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"


export default function CustomToolTip({ active, payload }: TooltipProps<ValueType, NameType>) {
    const { theme } = useTheme();
    if (active && payload && payload.length) {
        return (
            <>
                {
                    payload.map((_) => (
                        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-400'} text-gey p-2 rounded-xl`} key={payload[0].payload.date}>
                            <div className={`${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-200'} text-grey p-2 font-bold rounded-md`}>{payload[0].payload.date}</div>
                            <div>
                                <p>
                                    Markedsverdi: {payload[0].payload.market_value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                                </p>
                            </div>
                            <div>
                                <p>
                                    Avkastning i kroner: {payload[0].payload.yield_in_currency.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                                </p>
                            </div>
                            <div>
                                <p>
                                    Avkastning i porsent: {payload[0].payload.yield_percentage}%
                                </p>
                            </div>
                        </div >
                    ))
                }
            </>
        )
    }
    return null
}