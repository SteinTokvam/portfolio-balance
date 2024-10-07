import { SupabaseClient } from "@supabase/supabase-js"
import { Account, Transaction } from "../types/Types"
import { addTransaction, importAccountsToSupabase } from "../Util/Supabase"

export const importTransactions = (supabase: SupabaseClient, account: Account, transactions: Transaction[]) => {
    if(account.isManual) {
        transactions.forEach(transaction => {
            addTransaction(supabase, transaction, account.key)    
        })
    }
    
    return {
        type: 'IMPORT_TRANSACTIONS',
        payload: { accountKey: account.key, transactions }
    }
}

export const importAccounts = (supabaseClient: SupabaseClient, accounts: Account[]) => {
    importAccountsToSupabase(supabaseClient, accounts)
    return {
        type: 'IMPORT_ACCOUNTS',
        payload: accounts
    }
}