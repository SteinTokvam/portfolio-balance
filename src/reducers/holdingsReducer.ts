import { stat } from "fs";
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
            return {
                ...state, 
                holdings: [...state.holdings].map((holding: Holding) => {
                if(holding.accountKey === action.payload[0].accountKey && holding.name === action.payload[0].name) {
                    return {...holding, value: holding.value + action.payload[0].value}
                }
                return holding
            })}
        case 'UPDATE_HOLDINGS':
            const holdingsForOtherAccounts = [...state.holdings].filter((holding: Holding) => holding.accountKey !== action.payload[0].accountKey)
            const updatedHoldings = [...holdingsForOtherAccounts, ...action.payload]
            console.log(updatedHoldings)
            localStorage.setItem('holdings', JSON.stringify(updatedHoldings))
            return {
                ...state,
                holdings: updatedHoldings
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

function updateHolding(currentHolding: Holding, newHolding: Holding) {
    return {
        ...currentHolding,
        value: currentHolding.value + newHolding.value
    }
}

export default holdingsReducer;