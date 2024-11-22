import { useTheme } from "../../hooks/use-theme";
import { TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

export default function CustomTooltipYield({ active, payload }: TooltipProps<ValueType, NameType>) {
    const { theme } = useTheme();
    
    if (active && payload && payload.length) {
        return (
            <div>
                {payload.map((pld: any) => (
                    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-400'} text-gey p-2 rounded-xl`} key={pld.payload.created_at}>
                        <div className={`${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-200'} text-grey p-2 font-bold rounded-md`}>{pld.payload.created_at}</div>
                        <div>
                            <p>
                                Markedsverdi: {parseInt(pld.payload.value).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                            </p>
                            {pld.payload.yield && <p>
                                Avkastning: {parseInt(pld.payload.yield).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                            </p>}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};