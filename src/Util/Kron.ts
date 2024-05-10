import { Account, Holding, Transaction } from "../types/Types"


const isLocal = false
const baseUrl = isLocal ? 'http://localhost:3000' : 'https://portfolio-balance-backend.onrender.com'

function getOptions(api_key: string | undefined, account_id: string | undefined, accountKey: string | undefined) {
    if (api_key === undefined || account_id === undefined || accountKey === undefined) {
        return {
            error: "Api key, account id or account key is missing"
        }
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


export async function fetchTransactions(account: Account): Promise<Transaction[]> {

    const options = getOptions(account.apiInfo?.accessKey, account.apiInfo?.kronAccountId, account.key)
    if (options.error) {
        return []
    }
    return await fetch(`${baseUrl}/kron/transactions`, options)
        .then(response => response.json())
        .catch(error => {
            console.log(error)
            return []
        })
}

export async function fetchHoldings(account: Account): Promise<Holding[]> {
    const options = getOptions(account.apiInfo?.accessKey, account.apiInfo?.kronAccountId, account.key)
    if (options.error) {
        return []
    }
    return await fetch(`${baseUrl}/kron/holdings`, options)
        .then(response => response.json())
        .catch(error => {
            console.log(error)
            return []
        })
}