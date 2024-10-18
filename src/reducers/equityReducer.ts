import { EquityType } from "../types/Types";

const initialState = {
    equityTypes: [] as EquityType[]
}

const equityTypeReducer = (state = initialState, action: { type: string; payload: EquityType[] }) => {
    switch (action.type) {
        case 'SET_EQUITY_TYPES':
            return {
                ...state,
                equityTypes: action.payload
        }
        case 'SET_ALL_PERCENTAGES': 
            return {
                ...state,
                equityTypes: action.payload
            }
        case 'CHANGE_GOAL_PERCENTAGE':
            const currentEquityTypes = [...state.equityTypes]
            const indexToChange = currentEquityTypes.findIndex(item => item.key === action.payload[0].key)
            if(indexToChange === -1) {
                return state
            }

            currentEquityTypes[indexToChange] = action.payload[0]
            window.localStorage.setItem("equitytypes", JSON.stringify(currentEquityTypes))
            return {
                ...state,
                equityTypes: currentEquityTypes
            }
        default:
            return state
    }
}

export default equityTypeReducer