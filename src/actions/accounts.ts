import { SupabaseClient } from "@supabase/supabase-js"
import { Account, Transaction } from "../types/Types"
import { addAccount, addTransaction, addTransactions, deleteAccountSupabase, deleteAllAccountSupabase, deleteTransactionSupabase, getAccounts, getTransactions, importAccountsToSupabase, updateAccount } from "../Util/Supabase"
import { supabase } from "@supabase/auth-ui-shared"

export const initSupabaseData = (account: Account) => {
    return {
        type: 'INIT_SUPABASE_DATA',
        payload: {accounts: [account]}
    }

}

export const addNewAccount = (supabaseClient: SupabaseClient, account: Account) => {
    addAccount(supabaseClient, account)
    return {
        type: 'ADD_NEW_ACCOUNT',
        payload: { accounts: [account] }
    }
}

export const editAccount = (supabaseClient: SupabaseClient, account: Account) => {
    updateAccount(supabaseClient, account)
    return {
        type: 'EDIT_ACCOUNT',
        payload: { accounts: [account] }
    }
}

export const addAutomaticAccount = (supabaseClient: SupabaseClient, account: Account) => {
    addAccount(supabaseClient, account)
    return {
        type: 'ADD_AUTOMATIC_ACCOUNT',
        payload: { accounts: [account] }
    }
}

export const deleteAccount = (supabaseClient: SupabaseClient, accountKey: string) => {
    deleteAccountSupabase(supabaseClient, accountKey)
    return {
        type: 'DELETE_ACCOUNT',
        payload: { accountKey: accountKey }
    }
}

export const deleteAllAccounts = (supabaseClient: SupabaseClient) => {
    deleteAllAccountSupabase(supabaseClient)
    return {
        type: 'DELETE_ALL_ACCOUNTS'
    }
}

export const importTransactions = (supabase: SupabaseClient, accountKey: string, transactions: Transaction[]) => {
    transactions.forEach(transaction => {
        addTransaction(supabase, transaction, accountKey)    
    })
    
    return {
        type: 'IMPORT_TRANSACTIONS',
        payload: { accountKey: accountKey, transactions }
    }
}

export const importAccounts = (supabaseClient: SupabaseClient, accounts: Account[]) => {
    // @ts-ignore
    importAccountsToSupabase(supabaseClient, accounts)
    return {
        type: 'IMPORT_ACCOUNTS',
        payload: accounts
    }
}

export const newTransaction = (supabaseClient: SupabaseClient, accountKey: string, transaction: Transaction) => {
    addTransaction(supabaseClient, transaction, accountKey)
    return {
        type: 'NEW_TRANSACTION',
        payload: { accountKey, transactions: [transaction] }
    }
}

export const deleteTransaction = (supabaseClient: SupabaseClient, transactionKey: string, accountKey: string) => {
    deleteTransactionSupabase(supabaseClient, transactionKey)
    return {
        type: 'DELETE_TRANSACTION',
        payload: { transactionKey, accountKey }
    }
}