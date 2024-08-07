import { EquityType, EquityTypes } from "../types/Types";

const initialState = {
    equityTypes: window.localStorage.getItem('equitytypes') ? JSON.parse(window.localStorage.getItem('equitytypes') as string) :
        [
            {
                key: EquityTypes.FUND,
                label: EquityTypes.FUND,
                goalPercentage: 45
            },
            {
                key: EquityTypes.STOCK,
                label: EquityTypes.STOCK,
                goalPercentage: 29
            },
            {
                key: EquityTypes.CRYPTOCURRENCY,
                label: EquityTypes.CRYPTOCURRENCY,
                goalPercentage: 13
            },
            {
                key: EquityTypes.LOAN,
                label: EquityTypes.LOAN,
                goalPercentage: 13
            }],
}

const equityTypeReducer = (state = initialState, action: { type: string; payload: EquityType[] }) => {
    switch (action.type) {
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