import { v4 as uuidv4 } from 'uuid';
import { Account, FiriOrder, FiriPrice, FiriPricePoint, Holding, Transaction } from '../types/Types';

export async function fetchFiriTransactions(account: Account, currenciesToExclude: string[]): Promise<Transaction[]> {

    const firiOrders = await getTransactionsFromFiri(account.apiInfo && account.apiInfo.accessKey, currenciesToExclude)
    const currencies = [...new Set(firiOrders.map((order: FiriOrder) => order.currency))]
    const price = await fetchPriceInFiat(currencies as string[], account.apiInfo && account.apiInfo.accessKey)
    
    const transactions: Transaction[] = firiOrders.map((firiOrder: FiriOrder) => {
        const lastPrice = price.find(price => price.cryptocurrency === firiOrder.currency)?.price.last || '0'
        return {
            key: uuidv4(),
            cost: parseFloat(firiOrder.amount) * parseFloat(lastPrice),
            name: firiOrder.currency,
            type: firiOrder.type,
            date: firiOrder.date,
            equityPrice: parseFloat(lastPrice),
            e24Key: '',
            equityShare: parseFloat(parseFloat(firiOrder.amount).toFixed(8)),
            equityType: 'Cryptocurrency',
        }
    })

    return new Promise((resolve, reject) => {
        resolve(transactions)
    })
}

export async function fetchFiriHoldings(account: Account): Promise<Holding[]> {

    const transactions = await fetchFiriTransactions(account, ['NOK'])
    
    const currencies = [...new Set(transactions.map((transaction: Transaction) => transaction.name))].filter((currency: string) => currency !== 'DOGE')
    const price = await fetchPriceInFiat(currencies as string[], account.apiInfo && account.apiInfo.accessKey)
    const firiPricePoint: FiriPricePoint[] = []

    currencies.forEach(currency => {
        firiPricePoint.push({
            equityShare: parseFloat(transactions
                .filter((transaction: Transaction) => transaction.name === currency)
                .reduce((sum: number, transaction: Transaction) => sum + transaction.equityShare, 0).toFixed(8)),
            currency: currency as string,
            price: price.filter(price => price.cryptocurrency === currency)[0].price
        })
    })
    console.log(firiPricePoint)
    const holdings: Holding[] = firiPricePoint
        .filter(equityShare => equityShare.equityShare > 0.00000001)
        .filter(equityShare => !equityShare.price?.message)
        .map(equityShare => {
            return {
                name: equityShare.currency,
                key: uuidv4(),
                accountKey: account.key,
                value: parseFloat(equityShare.price.last) * equityShare.equityShare,
                equityType: 'Cryptocurrency',
                equityShare: equityShare.equityShare,
                e24Key: '',
                yield: 0
            }
        })

    return new Promise((resolve, reject) => {
        resolve(holdings)
    })
}

async function getTransactionsFromFiri(accessKey: string | undefined, excludedCurrencies = ['NOK']): Promise<FiriOrder[]> {
    if (accessKey === undefined) {
        return []
    }
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
        .then((orders: FiriOrder[]) => {
            return orders.filter(order =>  !excludedCurrencies.includes(order.currency))
        })
}

async function fetchPriceInFiat(currencies: string[], accessKey: string | undefined): Promise<{ price: FiriPrice, cryptocurrency: string }[]> {//henter siste pris for alle valutaer
    const notSupportedCurrencies = ['DOGE']

    if (accessKey === undefined) {
        return []
    }
    const value = currencies
        .filter(currency => !notSupportedCurrencies.includes(currency))
        .map(async cryptocurrency => {
            const response = await fetch(`https://api.firi.com/v2/markets/${cryptocurrency}nok`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'firi-access-key': accessKey
                }
            });
            const price = await response.json();
            return { price, cryptocurrency }
        })

    const ret = Promise.all(value)
    return await ret
}