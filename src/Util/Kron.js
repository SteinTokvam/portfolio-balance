

const isLocal = false
const baseUrl = isLocal ? 'http://localhost:3000' : 'https://portfolio-balance-backend.onrender.com'

function getOptions(api_key, account_id, accountKey) {
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


export async function fetchTransactions(account) {
   const account_id = 'ff16ab6d-159a-4c94-908a-6606370f4570'
    const response = await fetch(`${baseUrl}/kron/transactions`, getOptions(account.apiInfo.accessKey, account_id, account.accountKey))
        .then(response => response.json())
        .catch(error => {
            console.log(error)
            return []
        })

    return await response
}

export async function fetchHoldings(account) {
    console.log(account)
    const account_id = 'ff16ab6d-159a-4c94-908a-6606370f4570'
    const response = await fetch(`${baseUrl}/kron/holdings`, getOptions(account.apiInfo.accessKey, account_id, account.accountKey))
        .then(response => response.json())
        .catch(error => {
            console.log(error)
            return []
        })
    return await response
}