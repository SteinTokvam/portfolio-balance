import { Account, Holding, Transaction } from "../types/Types";

const isLocal = true
const baseUrl = isLocal ? 'http://localhost:3000' : 'https://portfolio-balance-backend.onrender.com'

export async function fetchBBTransactions(account: Account): Promise<Transaction[]> {
    try {
        const response = await fetch(`${baseUrl}/barebitcoin/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'accessKey': account.apiInfo ? account.apiInfo.accessKey : '',
            })
        })
    
        const res = await response.json()
        console.log('Fetched Bare bitcoin transactions', res)
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'accessKey': account.apiInfo ? account.apiInfo.accessKey : '',
                'accountKey': account.key
            })
        })
    
        const res = await response.json()
        console.log('Fetched Bare Bitcoin holdings', res)
        return res
    } catch(error){
        console.log(error)
        return []
    }
}