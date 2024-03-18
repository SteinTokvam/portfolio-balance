//export const investmentTypes = ["Aksje", "Fond", "Krypto", "Kontanter"];


const initialState = {
    accountTypes: window.localStorage.getItem("accountTypes") ? JSON.parse(window.localStorage.getItem("accountTypes")) : [] ,
    accountToEdit: {},
    firi: window.localStorage.getItem("firi") ? window.localStorage.getItem("firi") : ""
}

const accountReducer = (state = initialState, action) => {
    var currentAccountTypes = []
    var index = -1
    switch (action.type) {
        case 'ADD_INITIAL_ACCOUNT_TYPES':
            window.localStorage.setItem('accountTypes', JSON.stringify(action.payload))
            return {
                accountTypes: action.payload,
                accountToEdit: initialState.accountToEdit
            }
        case 'ADD_NEW_ACCOUNT_TYPE':
            window.localStorage.setItem('accountTypes', JSON.stringify([...state.accountTypes, action.payload]))
            return {
                ...state,
                accountTypes: [...state.accountTypes, action.payload]
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
        default:
            return state
    }
}

export default accountReducer