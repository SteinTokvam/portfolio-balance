//export const investmentTypes = ["Aksje", "Fond", "Krypto", "Kontanter"];


const initialState = {
    accounts: window.localStorage.getItem('accounts') ? JSON.parse(window.localStorage.getItem('accounts')) : [],
    accountTypes: window.localStorage.getItem("accountTypes") ? JSON.parse(window.localStorage.getItem("accountTypes")) : [],
    accountToEdit: {},
    e24Prices: [],
    firi: window.localStorage.getItem("firi") ? window.localStorage.getItem("firi") : ""
}

const accountReducer = (state = initialState, action) => {
    var currentAccountTypes = []
    var currentAccounts = []
    var index = -1
    switch (action.type) {
        case 'ADD_INITIAL_ACCOUNT_TYPES':
            window.localStorage.setItem('accountTypes', JSON.stringify(action.payload))
            return {
                accountTypes: action.payload,
                accountToEdit: initialState.accountToEdit
            }
        case 'ADD_NEW_ACCOUNT_NAME':
            window.localStorage.setItem('accounts', JSON.stringify([...state.accounts, action.payload]))
            return {
                ...state,
                accounts: [...state.accounts, action.payload]
            }
        case 'EDIT_ACCOUNT':
            currentAccountTypes = [...state.accountTypes]
            index = currentAccountTypes.findIndex(account => account.key === action.payload.key)
            currentAccountTypes[index] = action.payload
            window.localStorage.setItem("accountTypes", JSON.stringify(currentAccountTypes))
            return {
                ...state,
                accountTypes: currentAccountTypes
            }
        case 'SET_ACCOUNT_TYPE_TO_EDIT':
            return {
                ...state,
                accountToEdit: action.payload
            }
        case 'SET_FIRI_ACCESS_KEY':
            window.localStorage.setItem('firi', action.payload)
            return {
                ...state,
                firi: action.payload
            }
        case 'DELETE_ACCOUNT_TYPE':
            currentAccountTypes = [...state.accountTypes]
            index = currentAccountTypes.findIndex(accountType => accountType.key === action.payload.key)
            currentAccountTypes.splice(index, 1)
            window.localStorage.setItem("accountTypes", JSON.stringify(currentAccountTypes))
            return {
                ...state,
                accountTypes: currentAccountTypes
            }
        case 'DELETE_ACCOUNT_TYPES':
            return {
                ...state,
                accountTypes: initialState.accountTypes,
                accountToEdit: initialState.accountToEdit
            }
        case 'DELETE_ALL_ACCOUNTS':
            return {
                ...state,
                accounts: []
            }
        case 'IMPORT_TRANSACTIONS':
            currentAccounts = [...state.accounts]
            index = currentAccounts.findIndex(account => account.key === action.payload.key)
            currentAccounts[index] = {
                ...currentAccounts[index], 
                transactions: action.payload.transactions, 
                e24_ids: action.payload.transactions
                    .map(transaction => transaction.e24_id)
                    .filter((v, i, self) => {
                        return i === self.indexOf(v);
                    })
            }
            window.localStorage.setItem("accounts", JSON.stringify(currentAccounts))
            return {
                ...state,
                accounts: currentAccounts
            }
        case 'SET_E24_PRICES':
            if(state.e24Prices.filter(price => price.accountKey === action.payload.accountKey).length !== 0) {
                return state
            }
            return {
                ...state,
                e24Prices: [...state.e24Prices, { accountKey: action.payload.accountKey, prices: action.payload.prices}]
            }
        default:
            return state
    }
}

export default accountReducer