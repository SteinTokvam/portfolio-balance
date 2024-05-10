import { Holding } from "../types/Types";

const initialState = {
    holdings: window.localStorage.getItem('holdings') ? JSON.parse(window.localStorage.getItem('holdings') + '') : [],
}

const holdingsReducer = (state = initialState, action: { type: string; payload: {holdings: Holding[]; accountKey: string} }) => {
    var newHoldings = []

    switch (action.type) {
        case 'ADD_HOLDING':
            window.localStorage.setItem("holdings", JSON.stringify([...state.holdings, action.payload]))
            return {
                ...state,
                holdings: [...state.holdings, action.payload]
            }
        case 'UPDATE_HOLDING':
            /**
             * forventer at man sender inn 1 transaksjon på holdingen og oppdaterer verdien tilvarende den transaksjonen
             */
            const holdingsWithUpdate = [...state.holdings].map((holding: Holding) => {
                if (holding.accountKey === action.payload.holdings[0].accountKey && holding.name === action.payload.holdings[0].name) {
                    return { ...holding, value: holding.value + action.payload.holdings[0].value }
                }
                return holding
            })
            window.localStorage.setItem("holdings", JSON.stringify(holdingsWithUpdate))
            return {
                ...state,
                holdings: holdingsWithUpdate
            }
        case 'UPDATE_HOLDINGS':
            /**
             * Forventer at alle transaksjoner for en holding sendes inn. beregn holdingen på nytt
             */
            newHoldings = [...[...state.holdings].filter((holding: Holding) => holding.accountKey !== action.payload.accountKey), ...action.payload.holdings]
            window.localStorage.setItem("holdings", JSON.stringify(newHoldings))
            return {
                ...state,
                holdings: newHoldings
            }
        case 'ADD_HOLDINGS':
            newHoldings = [...action.payload.holdings].filter((holding: Holding) => !state.holdings.some((existingHolding: Holding) => existingHolding.name === holding.name && existingHolding.accountKey === holding.accountKey))
            const allHoldings = [...state.holdings, ...newHoldings]
            localStorage.setItem('holdings', JSON.stringify(allHoldings))
            return {
                ...state,
                holdings: allHoldings
            }
        case 'DELETE_HOLDING':
            const remainingHoldings = state.holdings.filter((holding: Holding) => holding.accountKey !== action.payload.accountKey)
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