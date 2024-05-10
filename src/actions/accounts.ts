import { Account, Transaction } from "../types/Types"

export const addNewAccount = (account: Account) => {
    return {
        type: 'ADD_NEW_ACCOUNT',
        payload: {accounts: [account]}
    }
}

export const editAccount = (account: Account) => {
    return {
        type: 'EDIT_ACCOUNT',
        payload: {accounts: [account]}
    }
}

export const addAutomaticAccount = (account: Account) => {
    return {
        type: 'ADD_AUTOMATIC_ACCOUNT',
        payload: {accounts: [account]}
    }
}

export const deleteAccount = (accountKey: string) => {
    return {
        type: 'DELETE_ACCOUNT',
        payload: { accountKey: accountKey }
    }
}

export const deleteAllAccounts = () => {
    return {
        type: 'DELETE_ALL_ACCOUNTS'
    }
}

export const importTransactions = (key: string, transactions: Transaction[]) => {
    return {
        type: 'IMPORT_TRANSACTIONS',
        payload: {accountKey: key, transactions}
    }
}

export const importAccounts = (accounts: Account[]) => {
    return {
        type: 'IMPORT_ACCOUNTS',
        payload: accounts
    }
}

export const newTransaction = (accountKey: string, transaction: Transaction) => {
    return {
        type: 'NEW_TRANSACTION',
        payload: { accountKey, transactions: [transaction] }
    }
}

export const deleteTransaction = (transactionKey: string, accountKey: string) => {
    return {
        type: 'DELETE_TRANSACTION',
        payload: { transactionKey, accountKey }
    }
}