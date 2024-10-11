import { Account, Transaction } from "../types/Types"
import { addAccount, addTransaction, deleteAccountSupabase, deleteAllAccountSupabase, deleteTransactionSupabase, importAccountsToSupabase, updateAccount } from "../Util/Supabase"

export const initSupabaseData = (account: Account) => {
    return {
        type: 'INIT_SUPABASE_DATA',
        payload: {accounts: [account]}
    }

}

export const addNewAccount = (account: Account) => {
    addAccount(account)
    return {
        type: 'ADD_NEW_ACCOUNT',
        payload: { accounts: [account] }
    }
}

export const editAccount = (account: Account) => {
    updateAccount(account)
    return {
        type: 'EDIT_ACCOUNT',
        payload: { accounts: [account] }
    }
}

export const addAutomaticAccount = (account: Account) => {
    addAccount(account)
    return {
        type: 'ADD_AUTOMATIC_ACCOUNT',
        payload: { accounts: [account] }
    }
}

export const deleteAccount = (accountKey: string) => {
    deleteAccountSupabase(accountKey)
    return {
        type: 'DELETE_ACCOUNT',
        payload: { accountKey: accountKey }
    }
}

export const resetState = () => {
    return {
        type: 'RESET_STATE',
    }
}

export const importTransactions = (account: Account, transactions: Transaction[]) => {
    if(account.isManual) {
        transactions.forEach(transaction => {
            addTransaction(transaction, account.key)    
        })
    }
    
    return {
        type: 'IMPORT_TRANSACTIONS',
        payload: { accountKey: account.key, transactions }
    }
}

export const importAccounts = (accounts: Account[]) => {
    importAccountsToSupabase(accounts)
    return {
        type: 'IMPORT_ACCOUNTS',
        payload: accounts
    }
}

export const newTransaction = (accountKey: string, transaction: Transaction) => {
    addTransaction(transaction, accountKey)
    return {
        type: 'NEW_TRANSACTION',
        payload: { accountKey, transactions: [transaction] }
    }
}

export const deleteTransaction = (transactionKey: string, accountKey: string) => {
    deleteTransactionSupabase(transactionKey)
    return {
        type: 'DELETE_TRANSACTION',
        payload: { transactionKey, accountKey }
    }
}