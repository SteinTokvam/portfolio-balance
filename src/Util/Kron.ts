import { Account, Holding, Transaction } from "../types/Types"
import { emptyHoldingPromise, emptyTransactionPromise } from "./Global"


const isLocal = false
const baseUrl = isLocal ? 'http://localhost:3000' : 'https://portfolio-balance-backend.onrender.com'

function getOptions(api_key: string | undefined, account_id: string | undefined, accountKey: string) {
    if(!api_key || !account_id) {
        return { error: 'No api_key or account_id' }
    }
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'account_id': account_id,
            'accessKey': api_key,
            'accountKey': accountKey
        })
    }    
}


export async function fetchKronTransactions(account: Account): Promise<Transaction[]> {
    const options = getOptions(account.apiInfo?.accessKey, account.apiInfo?.kronAccountId, account.key)
    if(options.error) {
        return emptyTransactionPromise()
    }
    try {
        const response = await fetch(`${baseUrl}/kron/transactions`, options)
        return await response.json()
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function fetchKronHoldings(account: Account): Promise<Holding[]> {
    const options = getOptions(account.apiInfo?.accessKey, account.apiInfo?.kronAccountId, account.key)
    if(options.error) {
        return emptyHoldingPromise()
    }
    try {
        const response = await fetch(`${baseUrl}/kron/holdings`, options)
        return await response.json()
    } catch (error) {
        console.log(error)
        return []
    }
}