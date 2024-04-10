const initialState = {
    equityTypes: window.localStorage.getItem('equitytypes') ? JSON.parse(window.localStorage.getItem('equitytypes')) :
        [
            {
                key: "Fund",
                label: "Fund",
                goalPercentage: 45
            },
            {
                key: "Stock",
                label: "Stock",
                goalPercentage: 29
            },
            {
                key: "Cryptocurrency",
                label: "Cryptocurrency",
                goalPercentage: 13
            },
            {
                key: "Loan",
                label: "Loan",
                goalPercentage: 13
            }],
}

const equityTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ALL_PERCENTAGES': 
            return {
                ...state,
                equityTypes: action.payload
            }
        case 'CHANGE_GOAL_PERCENTAGE':
            const currentEquityTypes = [...state.equityTypes]
            const indexToChange = currentEquityTypes.findIndex(item => item.key === action.payload.key)
            if(indexToChange === -1) {
                return state
            }

            currentEquityTypes[indexToChange] = action.payload
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