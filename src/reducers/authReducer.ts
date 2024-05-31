
const initialState = {
    // @ts-ignore
    session: null
}

const authReducer = (state = initialState, action: { payload: any; type: string }) => {
    switch (action.type) {
        case 'SET_SESSION': 
            return {
                ...state,
                session: action.payload
            }
        default:
            return state
    }
}

export default authReducer