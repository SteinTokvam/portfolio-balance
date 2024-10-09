import { v4 as uuidv4 } from 'uuid';
import { Account, EquityTypes, FiriOrder, FiriPrice, FiriPricePoint, Holding, Transaction } from '../types/Types';

export async function fetchFiriTransactions(account: Account, currenciesToExclude: string[]): Promise<Transaction[]> {
    const firiOrders = await getTransactionsFromFiri(account.apiInfo && account.apiInfo.accessKey, currenciesToExclude)
    const currencies = [...new Set(firiOrders.map((order: FiriOrder) => order.currency))]
    const price = await fetchLatestPriceInFiat(currencies as string[], account.apiInfo && account.apiInfo.accessKey)
    
    const transactions: Transaction[] = firiOrders.map((firiOrder: FiriOrder) => {
        const lastPrice = price.find(price => price.cryptocurrency === firiOrder.currency)?.price.last || '0'
        return {
            transactionKey: uuidv4(),
            accountKey: account.key,
            cost: parseFloat(firiOrder.amount) * parseFloat(lastPrice),
            name: firiOrder.currency,
            type: firiOrder.type,
            date: firiOrder.date,
            equityPrice: parseFloat(lastPrice),
            e24Key: '',
            equityShare: parseFloat(parseFloat(firiOrder.amount).toFixed(8)),
            equityType: EquityTypes.CRYPTOCURRENCY,
        }
    })

    return new Promise((resolve, _) => {
        resolve(transactions)
    })
}

export async function fetchFiriHoldings(account: Account): Promise<Holding[]> {

    const transactions = await fetchFiriTransactions(account, ['NOK'])
    
    const currencies = [...new Set(transactions.map((transaction: Transaction) => transaction.name))].filter((currency: string) => currency !== 'DOGE')
    const price = await fetchLatestPriceInFiat(currencies as string[], account.apiInfo && account.apiInfo.accessKey)
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
    
    const holdings: Holding[] = firiPricePoint
        .filter(equityShare => equityShare.equityShare > 0.00000001)
        .filter(equityShare => !equityShare.price?.message)
        .map(equityShare => {
            const value = parseFloat(equityShare.price.last) * equityShare.equityShare
            return {
                name: equityShare.currency,
                key: uuidv4(),
                accountKey: account.key,
                value,
                equityType: EquityTypes.CRYPTOCURRENCY,
                equityShare: equityShare.equityShare,
                e24Key: '',
                yield: 0//value-transactions.filter(transaction => transaction.name === equityShare.currency && (transaction.type === 'Match' || transaction.type === 'StakingReward' || transaction.type === 'AffiliateBonus' || transaction.type === 'Bonus' || transaction.type === 'FeebackBonus' || transaction.type === 'WelcomeBonus')).reduce((sum, transaction) => sum + transaction.cost, 0)
            }
            
        })
        console.log('Fetched Firi Holdings', holdings)

    return new Promise((resolve, _) => {
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
            const res = orders.filter(order =>  !excludedCurrencies.includes(order.currency))
            console.log('Fetched Firi Transactions', res)
            return res
        })
}

async function fetchLatestPriceInFiat(currencies: string[], accessKey: string | undefined): Promise<{ price: FiriPrice, cryptocurrency: string }[]> {
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