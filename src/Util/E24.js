
export async function fetchTicker(ticker, exchange = "OSE", type, period = "1weeks") {
    const response = await fetch(`https://api.e24.no/bors/chart/${ticker}.${exchange}?period=${period}&type=${type.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
            return data.data.map(item => {
                return {
                    date: new Date(item[0]),
                    value: item[1]
                }
            })
        })
        .catch(error => {
            console.log(error)
            return []
        });
    return await response;
}