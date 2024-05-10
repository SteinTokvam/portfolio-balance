
/*
 *
 * {
            name: "",
            key: "",
            type: "",
            transactions: [
                {
                    key: "",
                    cost: 0,
                    name: "",
                    type: "",
                    date: "",
                    equityPrice: 0,
                    e24Key: "",
                    equityShare: 0,
                }
            ],
            goalPercentage: 0,
            totalValue: 0,
            yield: 0,
            isManual: false,
            apiInfo: {
                endPoint: "",
                accessKey: ""
            },
            holdings: [
                {
                    name: "",
                    accountKey: UUID,
                    equityShare: 0,
                    e24Key: "",
                    goalPercentage: 0
                }
            ]
        }
 *
 */

import { Account, Transaction } from "../types/Types"

const initialState = {
    // @ts-ignore
    accounts: window.localStorage.getItem('accounts') ? JSON.parse(window.localStorage.getItem('accounts')) : [],
}

const accountReducer = (state = initialState, action: { type: string; payload: {key: string, transactions: Transaction[], transactionKey: string, accounts: Account[], accountKey: string} }) => {
    var currentAccounts = []
    var index = -1
    switch (action.type) {
        case 'ADD_NEW_ACCOUNT':
            window.localStorage.setItem("accounts", JSON.stringify([...state.accounts, action.payload]))
            return {
                ...state,
                accounts: [...state.accounts, action.payload.accounts[0]]
            }
            case 'EDIT_ACCOUNT':
                const edited = [...state.accounts.filter((account: Account) => account.key !== action.payload.key), ...action.payload.accounts]
                window.localStorage.setItem("accounts", JSON.stringify(edited))
                return {
                    ...state,
                    accounts: edited
                }
        case 'ADD_AUTOMATIC_ACCOUNT':
            window.localStorage.setItem("accounts", JSON.stringify([...state.accounts, action.payload]))
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
                window.localStorage.setItem("accounts", JSON.stringify(currentAccounts))
                return {
                    ...state,
                    accounts: currentAccounts
                }
            }

            const transactionsPayload = action.payload.transactions
            const currentTransactionKeys = currentAccounts[index].transactions.map((transaction: Transaction) => transaction.key)
            const newTransactions = transactionsPayload.filter((transaction: Transaction) => !currentTransactionKeys.includes(transaction.key))

            if (newTransactions.length === 0) {
                console.log("no new transactions")
                return { ...state }
            }
            currentAccounts[index] = {
                ...currentAccounts[index],
                transactions: [...currentAccounts[index].transactions, ...newTransactions],
            }
            window.localStorage.setItem("accounts", JSON.stringify(currentAccounts))
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

            window.localStorage.setItem("accounts", JSON.stringify(currentAccounts))
            return {
                ...state,
                accounts: currentAccounts
            }
        case 'IMPORT_ACCOUNTS':
            window.localStorage.setItem("accounts", JSON.stringify(action.payload.accounts))
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

            const remainingTransactions = currentAccounts[index].transactions.filter((transaction: Transaction) => transaction.key !== action.payload.transactionKey)

            const newAccounts = [
                ...currentAccounts.filter(account => account.key !== action.payload.accountKey), 
                {
                    ...currentAccounts[index],
                    transactions: remainingTransactions
                }
            ]
            window.localStorage.setItem("accounts", JSON.stringify(newAccounts))
            return {
                ...state,
                accounts: newAccounts
            }
        case 'DELETE_ACCOUNT':
            console.log(action.payload.accountKey)
            currentAccounts = [...state.accounts]
            const remainingAccounts = currentAccounts.filter(account => account.key !== action.payload.accountKey)

            window.localStorage.setItem("accounts", JSON.stringify(remainingAccounts))
            return {
                ...state,
                accounts: remainingAccounts
            }
        case 'DELETE_ALL_ACCOUNTS':
            return initialState
        default:
            return state
    }
}

export default accountReducer