import { TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"


export default function CustomToolTip({ active, payload }: TooltipProps<ValueType, NameType>) {
    if (active && payload && payload.length) {
        return (
            <>
                {
                    payload.map((_) => (
                        <div className="bg-slate-800 text-white p-2" key={payload[0].payload.date}>
                            <div className="bg-slate-600 text-white p-2 font-bold">{payload[0].payload.date}</div>
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