const initialState = {
    sum: 0,
    minimumSum: 99
}

const rebalancingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SUM_TO_INVEST':
            return {
                ...state,
                sum: action.payload
            }
        case 'SET_MINIMUM_SUM_TO_INVEST':
            return {
                ...state,
                minimumSum: action.payload
            }
        default:
            return state
    }
}

export default rebalancingReducer