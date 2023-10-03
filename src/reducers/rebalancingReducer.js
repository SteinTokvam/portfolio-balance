const initialState = {
    sum: 0
}

const rebalancingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SUM_TO_INVEST':
            return {
                ...state,
                sum: action.payload
            }
        default:
            return state
    }
}

export default rebalancingReducer