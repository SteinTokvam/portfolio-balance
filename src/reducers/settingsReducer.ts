const initialState = {
    hideNumbers: false
}

const settingsReducer = (state = initialState, action: { type: string; payload: any }) => {
    switch (action.type) {
        case 'TOGGLE_HIDE_NUMBERS':
            return {
                ...state,
                hideNumbers: action.payload.hideNumbers
            }
        default:
            return state
    }
}

export default settingsReducer