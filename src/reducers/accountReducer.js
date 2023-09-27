//export const investmentTypes = ["Aksje", "Fond", "Krypto", "Kontanter"];


const initialState = {
    accountTypes: window.localStorage.getItem("accountTypes") ? JSON.parse(window.localStorage.getItem("accountTypes")) : []    
}

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_INITIAL_ACCOUNT_TYPES':
            window.localStorage.setItem('accountTypes', JSON.stringify(action.payload))
            return {
                accountTypes: action.payload
            }
        case 'ADD_NEW_ACCOUNT_TYPE':
            window.localStorage.setItem('accountTypes', JSON.stringify([...state.accountTypes, action.payload]))
            return {
                ...state,
                accountTypes: [...state.accountTypes, action.payload]
            }
        case 'DELETE_ACCOUNT_TYPES':
            return {
                accountTypes: action.payload
            }
        default:
            return state
    }
}

export default accountReducer