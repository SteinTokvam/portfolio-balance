import { FiriOrder } from "../types/Types"

export async function getTransactionsFromFiri(accessKey: string) {
    return await fetch('https://api.firi.com/v2/history/transactions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'firi-access-key': accessKey
        }
    })
        .then(response => {
            return response.json()
        })
}

export function calculateValue(orders: FiriOrder[], currencies: string[]) {
    return currencies.map(currency => {
        var cryptoValue = 0.0
        orders.reverse()
            .filter(order => order.currency === currency).forEach(order => {
                cryptoValue += parseFloat(order.amount)
            })

        return { cryptoValue, currency }
    })
}

export async function getValueInFiat(currencies: string[], accessKey: string) {
    const value = currencies.map(async cryptocurrency => {
        const response = await fetch(`https://api.firi.com/v1/markets/${cryptocurrency}nok`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'firi-access-key': accessKey
            }
        });
        return await response.json();
    })

    const ret = Promise.all(value)
    return await ret
}