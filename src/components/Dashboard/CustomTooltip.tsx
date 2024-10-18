import { TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

export default function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <div>
                    {payload.map((pld: any) => (
                        <div className="bg-slate-800 text-white p-2">
                            <div className="bg-slate-600 text-white p-2 font-bold">{label}</div>
                            <div>
                                <p>
                                    Markedsverdi: {parseInt(pld.payload.totalValue).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                                </p>
                                <p>
                                    Avkastning: {parseInt(pld.payload.yield).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};