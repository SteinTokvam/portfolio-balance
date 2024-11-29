import { Account, Transaction } from "../types/Types"

const initialState = {accounts: [] as Account[]}

const accountReducer = (state = initialState, action: { type: string; payload: { key: string, transactions: Transaction[], transactionKey: string, accounts: Account[], accountKey: string } }) => {
    var currentAccounts = []
    var index = -1
    switch (action.type) {
        case 'INIT_SUPABASE_DATA':
            if (state.accounts && state.accounts.find((account: Account) => account.key === action.payload.accounts[0].key)) {
                return state
            }
            return {
                ...state,
                accounts: action.payload.accounts
            }
        case 'ADD_NEW_ACCOUNT':
            return {
                ...state,
                accounts: [...state.accounts, ...action.payload.accounts]
            }
        case 'EDIT_ACCOUNT':
            const edited = [...state.accounts.filter((account: Account) => account.key !== action.payload.key), ...action.payload.accounts]
            return {
                ...state,
                accounts: edited
            }
        case 'ADD_AUTOMATIC_ACCOUNT':
            return {
                ...state,
                accounts: [...state.accounts, action.payload]
            }
        case 'IMPORT_TRANSACTIONS':
            currentAccounts = [...state.accounts]
            index = currentAccounts.findIndex(account => account.key === action.payload.accountKey)
            const isManual = currentAccounts[index].isManual

            if (!isManual) {
                currentAccounts[index] = {
                    ...currentAccounts[index],
                    transactions: action.payload.transactions,
                }
                return {
                    ...state,
                    accounts: currentAccounts
                }
            }

            const transactionsPayload = action.payload.transactions
            const currentTransactionKeys = currentAccounts[index].transactions.map((transaction: Transaction) => transaction.transactionKey)
            const newTransactions = transactionsPayload.filter((transaction: Transaction) => !currentTransactionKeys.includes(transaction.transactionKey))

            if (newTransactions.length === 0) {
                console.log("No new transactions")
                return { ...state }
            }
            currentAccounts[index] = {
                ...currentAccounts[index],
                transactions: [...currentAccounts[index].transactions, ...newTransactions],
            }
            return {
                ...state,
                accounts: currentAccounts
            }
        case 'NEW_TRANSACTION':
            currentAccounts = [...state.accounts]
            index = currentAccounts.findIndex(account => account.key === action.payload.accountKey)

            if (index === -1) {
                return {
                    ...state
                }
            }

            currentAccounts[index] = {
                ...currentAccounts[index],
                transactions: [...currentAccounts[index].transactions, action.payload.transactions[0]]
            }

            return {
                ...state,
                accounts: currentAccounts
            }
        case 'IMPORT_ACCOUNTS':
            return {
                ...state,
                accounts: action.payload.accounts
            }
        case 'DELETE_TRANSACTION':
            currentAccounts = [...state.accounts]
            index = currentAccounts.findIndex(account => account.key === action.payload.accountKey)

            if (index === -1) {
                return {
                    ...state
                }
            }

            const remainingTransactions = currentAccounts[index].transactions.filter((transaction: Transaction) => transaction.transactionKey !== action.payload.transactionKey)

            const newAccounts = [
                ...currentAccounts.filter(account => account.key !== action.payload.accountKey),
                {
                    ...currentAccounts[index],
                    transactions: remainingTransactions
                }
            ]
            return {
                ...state,
                accounts: newAccounts
            }
        case 'DELETE_ACCOUNT':
            currentAccounts = [...state.accounts]
            const remainingAccounts = currentAccounts.filter(account => account.key !== action.payload.accountKey)

            return {
                ...state,
                accounts: remainingAccounts
            }
        case 'RESET_STATE':
            return {
                ...state,
                accounts: []
            }
        default:
            return state
    }
}

export default accountReducer