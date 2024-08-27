import { Account, Holding, Transaction } from "../types/Types";

const isLocal = false
const baseUrl = isLocal ? 'http://localhost:3000' : 'https://portfolio-balance-backend.onrender.com'

export async function fetchBBTransactions(account: Account): Promise<Transaction[]> {
    try {
        const response = await fetch(`${baseUrl}/barebitcoin/transactions`, {
            method: 'POST',
            body: JSON.stringify({
                'accessKey': account.apiInfo?.accessKey
            })
        })
    
        const res = await response.json()
        return res
    } catch(error){
        console.log(error)
        return []
    }
}

export async function fetchBBHoldings(account: Account): Promise<Holding[]> {
    try {
        const response = await fetch(`${baseUrl}/barebitcoin/balance`, {
            method: 'POST',
            body: JSON.stringify({
                'accessKey': account.apiInfo?.accessKey,
                'accountKey': account.key
            })
        })
    
        const res = await response.json()
        return res
    } catch(error){
        console.log(error)
        return []
    }
}