import { v4 as uuidv4 } from 'uuid';

export async function getTransactionsFromFiri(accessKey) {
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

export async function fetchFiriHoldings(account) {
    const transactions = (await getTransactionsFromFiri(account.apiInfo && account.apiInfo.accessKey))
        .filter(order => order.type === 'Match' && order.currency !== 'NOK' && order.type !== 'Stake' && order.type !== 'InternalTransfer')
    const currencies = [...new Set(transactions.map(order => order.currency))]
    const price = await getValueInFiat(currencies, account.apiInfo && account.apiInfo.accessKey)
    const equityShares = []

    currencies.forEach(currency => {
        equityShares.push({
            equityShare: transactions
                .filter(transaction => transaction.currency === currency)
                .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0),
            currency,
            price: price.filter(price => price.cryptocurrency === currency)[0]
        })
    })
    const holdings = equityShares
        .filter(equityShare => equityShare.equityShare > 0.00000001)
        .filter(equityShare => !equityShare.price.price.message)
        .map(equityShare => {
            return {
                name: equityShare.currency,
                key: uuidv4(),
                accountKey: account.key,
                value: equityShare.price.price.last * equityShare.equityShare,
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

export function calculateValue(orders, currencies) {//henter verdien til transactionTable
    return currencies.map(currency => {
        var cryptoValue = 0.0
        orders.reverse()
            .filter(order => order.currency === currency).forEach(order => {
                cryptoValue += parseFloat(order.amount)
            })

        return { cryptoValue, currency }
    })
}

async function getValueInFiat(currencies, accessKey) {//henter verdien til holdings
    const value = currencies.map(async cryptocurrency => {
        const response = await fetch(`https://api.firi.com/v1/markets/${cryptocurrency}nok`, {
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