import { Holding } from "../types/Types";

const initialState = {
    holdings: [],
}

const holdingsReducer = (state = initialState, action: { type: string; payload: {holdings: Holding[]; accountKey: string} }) => {
    var newHoldings = []

    switch (action.type) {
        case 'UPDATE_HOLDINGS':
            /**
             * Forventer at alle transaksjoner for en holding sendes inn. beregn holdingen på nytt
             */
            newHoldings = [...[...state.holdings].filter((holding: Holding) => holding.accountKey !== action.payload.accountKey), ...action.payload.holdings]
            return {
                ...state,
                holdings: newHoldings
            }
        case 'ADD_HOLDINGS':
            newHoldings = [...action.payload.holdings].filter((holding: Holding) => !state.holdings.some((existingHolding: Holding) => existingHolding.name === holding.name && existingHolding.accountKey === holding.accountKey))
            const allHoldings = [...state.holdings, ...newHoldings]
            return {
                ...state,
                holdings: allHoldings
            }
        case 'RESET_STATE':
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