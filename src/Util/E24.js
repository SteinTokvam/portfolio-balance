
export async function fetchTicker(ticker, exchange = "OSE", type, period = "1weeks") {
    if(!type) {
        return [{date: "", value: 0}]
    }
    const proxy = 'https://corsproxy.io/?'
    const useProxy = false
    const response = await fetch(`${useProxy ? proxy : ''}https://api.e24.no/bors/chart/${ticker}.${exchange}?period=${period}&type=${type.toLowerCase()}`)
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