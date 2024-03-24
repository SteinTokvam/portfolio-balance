import { v4 as uuidv4 } from 'uuid';

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

export const editAccount = (account) => {
    return {
        type: 'EDIT_ACCOUNT',
        payload: account
    }
}

export const deleteAllAccountTypes = (defaultAccountType) => {
    return {
        type: 'DELETE_ACCOUNT_TYPES',
        payload: [{ key: uuidv4(), name: defaultAccountType, goalPercentage: 0 }][defaultAccountType]
    }
}

export const deleteAllAccounts = () => {
    return {
        type: 'DELETE_ALL_ACCOUNTS'
    }
}

export const deleteAccountType = (accountType) => {
    return {
        type: 'DELETE_ACCOUNT_TYPE',
        payload: accountType
    }
}

export const addInitialAccountTypes = (accountTypes) => {
    return {
        type: 'ADD_INITIAL_ACCOUNT_TYPES',
        payload: accountTypes
    }
}

export const setAccountToEdit = (account) => {
    return {
        type: 'SET_ACCOUNT_TYPE_TO_EDIT',
        payload: account
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

export const setTotalValueForInvestments = (totalValue) => {
    return {
        type: 'SET_TOTAL_VALUE_FOR_INVESTMENTS',
        payload: totalValue
    }
}