import { Holding } from "../types/Types";

const initialState = {
    holdings: window.localStorage.getItem('holdings') ? JSON.parse(window.localStorage.getItem('holdings') + '') : [],
}

const holdingsReducer = (state = initialState, action: { type: string; payload: Holding[] }) => {

    switch (action.type) {
        case 'ADD_HOLDING':
            return {
                ...state,
                holdings: [...state.holdings, action.payload]
            }
        case 'UPDATE_HOLDINGS':
            const holdingsToUpdate = [...action.payload].filter((holding: Holding) => !state.holdings.some((existingHolding: Holding) => existingHolding.name === holding.name && existingHolding.accountKey === holding.accountKey))
            const currentHoldings = [...state.holdings].map((holding: Holding) => {
                if(holdingsToUpdate.some((updatedHolding: Holding) => updatedHolding.name === holding.name && updatedHolding.accountKey === holding.accountKey)) {
                    return holdingsToUpdate.filter((updatedHolding: Holding) => updatedHolding.name === holding.name && updatedHolding.accountKey === holding.accountKey)[0]
                }
                return holding
            })
            localStorage.setItem('holdings', JSON.stringify(currentHoldings))
            return {
                ...state,
                holdings: currentHoldings
            }
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