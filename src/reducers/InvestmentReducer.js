
const initialState = {investments: window.localStorage.getItem("investments") ? JSON.parse(window.localStorage.getItem("investments")) : []}

const investmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_NEW_INVESTMENT':
            window.localStorage.setItem("investments", JSON.stringify([...state.investments, action.payload])) 
            return {
                ...state,
                investments: [...state.investments, action.payload],
            }
        
        default: 
            return state;
        
    }
}

export default investmentReducer