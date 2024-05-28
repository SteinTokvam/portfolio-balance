import { Holding } from "../types/Types";

const initialState = {
    holdings: window.localStorage.getItem('holdings') ? JSON.parse(window.localStorage.getItem('holdings') + '') : [],
}

const holdingsReducer = (state = initialState, action: { type: string; payload: {holdings: Holding[]; accountKey: string} }) => {
    var newHoldings = []
    window.localStorage.removeItem('holdings')

    switch (action.type) {
        case 'ADD_HOLDING':
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
            return {
                ...state,
                holdings: holdingsWithUpdate
            }
        case 'UPDATE_HOLDINGS':
            /**
             * Forventer at alle transaksjoner for en holding sendes inn. beregn holdingen på nytt
             */
            newHoldings = [...[...state.holdings].filter((holding: Holding) => holding.accountKey !== action.payload.accountKey), ...action.payload.holdings]
            console.log(newHoldings)
            console.log('lol')
            return {
                ...state,
                holdings: newHoldings
            }
        case 'ADD_HOLDINGS':
            newHoldings = [...action.payload.holdings].filter((holding: Holding) => !state.holdings.some((existingHolding: Holding) => existingHolding.name === holding.name && existingHolding.accountKey === holding.accountKey))
            const allHoldings = [...state.holdings, ...newHoldings]
            console.log(allHoldings.filter((holding: Holding) => holding.equityType === 'Loan'))
            return {
                ...state,
                holdings: allHoldings
            }
        case 'DELETE_HOLDING':
            const remainingHoldings = state.holdings.filter((holding: Holding) => holding.accountKey !== action.payload.accountKey)
            return {
                ...state,
                holdings: remainingHoldings
            }
        case 'DELETE_ALL_HOLDINGS':
            return {
                ...state,
                holdings: []
            }
        case 'DELETE_HOLDINGS_FOR_ACCOUNT':
            return {
                ...state,
                holdings: state.holdings.filter((holding: Holding) => holding.accountKey !== action.payload.accountKey)
            }
        default:
            return state
    }
}

export default holdingsReducer;