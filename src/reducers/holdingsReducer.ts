import { Holding } from "../types/Types";

const initialState = {
    holdings: window.localStorage.getItem('holdings') ? JSON.parse(window.localStorage.getItem('holdings') + '') : [],
}

const holdingsReducer = (state = initialState, action: { type: string; payload: Holding[] }) => {

    switch (action.type) {
        case 'ADD_HOLDING':
            window.localStorage.setItem("holdings", JSON.stringify([...state.holdings, action.payload]))
            return {
                ...state,
                holdings: [...state.holdings, action.payload]
            }
        case 'UPDATE_HOLDING':
            console.log(action.payload)
            const updatedHoldings = [...state.holdings].map((holding: Holding) => {
                if(holding.name === action.payload[0].name && holding.accountKey === action.payload[0].accountKey) {
                    return action.payload[0]
                }
            })
            localStorage.setItem('holdings', JSON.stringify(updatedHoldings))
            return {
                ...state,
                ...updatedHoldings
            }
        case 'UPDATE_HOLDINGS':
            //TODO: implement
            return 
        case 'ADD_HOLDINGS':
            const newHoldings = [...action.payload].filter((holding: Holding) => !state.holdings.some((existingHolding: Holding) => existingHolding.name === holding.name && existingHolding.accountKey === holding.accountKey))
            const allHoldings = [...state.holdings, ...newHoldings]
            localStorage.setItem('holdings', JSON.stringify(allHoldings))
            return {
                ...state,
                holdings: allHoldings
            }
        case 'DELETE_HOLDING':
            const remainingHoldings = state.holdings.filter((holding: Holding) => holding.key !== action.payload[0].key)
            localStorage.setItem('holdings', JSON.stringify(remainingHoldings))
            return {
                ...state,
                holdings: remainingHoldings
            }
        case 'DELETE_ALL_HOLDINGS':
            localStorage.removeItem('holdings')
            return {
                ...state,
                holdings: []
            }
        default:
            return state
    }
}

export default holdingsReducer;