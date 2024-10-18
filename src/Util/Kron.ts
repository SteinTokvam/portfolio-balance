import { Account, Holding, Transaction } from "../types/Types"
import { emptyHoldingPromise, emptyTransactionPromise } from "./Global"


const isLocal = false
const baseUrl = isLocal ? 'http://localhost:3000' : 'https://portfolio-balance-backend.onrender.com'

function getOptions(api_key: string | undefined, account_id: string | undefined, accountKey: string, haveInterval = false) {
    if (!api_key || !account_id) {
        return { error: 'No api_key or account_id' }
    }
    return haveInterval ?
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'account_id': account_id,
                'accessKey': api_key,
                'accountKey': accountKey,
                'interval': 'year-to-date'
            })
        } :
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'account_id': account_id,
                'accessKey': api_key,
                'accountKey': accountKey,
            })
        }
}


export async function fetchKronTransactions(account: Account): Promise<Transaction[]> {
    const options = getOptions(account.apiInfo?.accessKey, account.apiInfo?.kronAccountId, account.key)
    if (options.error) {
        return emptyTransactionPromise()
    }
    try {
        const response = await fetch(`${baseUrl}/kron/transactions`, options)
        const res = await response.json()
        console.log('Fetched Kron transactions', res)
        return res
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function fetchKronHoldings(account: Account): Promise<Holding[]> {
    const options = getOptions(account.apiInfo?.accessKey, account.apiInfo?.kronAccountId, account.key)
    if (options.error) {
        return emptyHoldingPromise()
    }
    try {
        const response = await fetch(`${baseUrl}/kron/holdings`, options)
        const res = await response.json()
        console.log('Fetched Kron holdings', res)
        return res
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function fetchKronBalance(account: Account): Promise<{value: number, yield: number}> {
    const options = getOptions(account.apiInfo?.accessKey, account.apiInfo?.kronAccountId, account.key)
    if (options.error) {
        return new Promise((resolve, _) => {
            resolve({value: 0, yield: 0})
        })
    }
    try {
        const response = await fetch(`${baseUrl}/kron/total_value`, options)
        const res = await response.json()
        console.log('Fetched Kron balance', res)
        return res
    } catch (error) {
        console.log(error)
        return {value: 0, yield: 0}
    }
}

export async function fetchKronDevelopment(account: Account): Promise<any> {
    console.log('fetchKronDevelopment', account)
    if(!account || account.name !== 'Kron') {
        return emptyHoldingPromise()
    }
    const options = getOptions(account.apiInfo?.accessKey, account.apiInfo?.kronAccountId, account.key, true)
    if (options.error) {
        return emptyHoldingPromise()
    }
    try {
        const response = await fetch(`${baseUrl}/kron/development`, options)
        const res = await response.json()
        console.log('Fetched Kron development', res)
        return res
    } catch (error) {
        console.log(error)
        return []
    }

}