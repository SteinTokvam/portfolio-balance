import { E24Ticker } from "@/types/Types";

export async function fetchTicker(ticker: string, exchange = "OSE", type: string, period = "1weeks"): Promise<E24Ticker[]> {
    if (!type) {
        return [{ date: new Date(), value: 0 }]
    }

    if (!ticker || ticker === "") {
        return []
    }
    const response = await fetch(`https://portfolio-balance-backend.onrender.com/e24`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ticker,
            exchange,
            type,
            period
        })
    })
        .then(res => res.json())

        .catch(error => {
            console.log(error)
            return []
        });
    return await response;
}