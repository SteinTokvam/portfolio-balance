import React from "react"

// @ts-ignore
export default function CustomToolTip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <>
                {
                    payload.map((pld: any) => (
                        <div className="bg-slate-800 text-white p-2">
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