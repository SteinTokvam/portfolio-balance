
export const addNewAccount = (account) => {
    return {
        type: 'ADD_NEW_ACCOUNT',
        payload: account
    }
}

export const addAutomaticAccount = (account) => {
    return {
        type: 'ADD_AUTOMATIC_ACCOUNT',
        payload: account
    }
}

export const deleteAllAccounts = () => {
    return {
        type: 'DELETE_ALL_ACCOUNTS'
    }
}

export const setFiriAccessKey = (accessKey) => {
    return {
        type: 'SET_FIRI_ACCESS_KEY',
        payload: accessKey
    }
}

export const importTransactions = (transactions) => {
    return {
        type: 'IMPORT_TRANSACTIONS',
        payload: transactions
    }
}

export const setE24Prices = (accountKey, prices) => {
    return {
        type: 'SET_LATEST_PRICE',
        payload: { accountKey, prices }
    }
}

export const importAccounts = (accounts) => {
    return {
        type: 'IMPORT_ACCOUNTS',
        payload: accounts
    }
}

export const newTransaction = (accountKey, transaction) => {
    return {
        type: 'NEW_TRANSACTION',
        payload: { accountKey, transaction }
    }
}