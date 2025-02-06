import { Account, Transaction } from "../types/Types";

const isLocal = false
const baseUrl = isLocal ? 'http://localhost:3000' : 'https://portfolio-balance-backend.onrender.com'

export async function fetchFundingpartnerTransactions(account: Account): Promise<Transaction[]> {
    try {
        const response = await fetch(`${baseUrl}/fundingpartner/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: account.apiInfo?.accessKey,
                pw: account.apiInfo?.kronAccountId,
                accountKey: account.key
            })
        })
        const res = await response.json()
        console.log('Fetched Fundingpartner transactions', res)
        return res
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function fetchFundingpartnerHoldings(account: Account): Promise<any> {
    try {
        const response = await fetch(`${baseUrl}/fundingpartner/holdings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: account.apiInfo?.accessKey,
                pw: account.apiInfo?.kronAccountId,
                accountKey: account.key
            })
        })
        const res = await response.json()
        console.log('Fetched Fundingpartner holdings', res)
        return res
    } catch (error) {
        console.log(error)
        return []
    }
}