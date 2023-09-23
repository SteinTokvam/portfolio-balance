
const initialState = {investments: window.localStorage.getItem("investments") ? JSON.parse(window.localStorage.getItem("investments")) : []}

const investmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_NEW_INVESTMENT':
            window.localStorage.setItem("investments", JSON.stringify([...state.investments, action.payload])) 
            return {
                ...state,
                investments: [...state.investments, action.payload],
            }
        case 'EDIT_INVESTMENT':
            const currentInvestments = [...state.investments]
            const index = currentInvestments.findIndex(investment => investment.key === action.payload.key)
            currentInvestments[index] = action.payload
            window.localStorage.setItem("investments", JSON.stringify(currentInvestments))
            return {
                ...state,
                investments: currentInvestments
            }
        case 'SET_INVESTMENT_TO_EDIT':
            return {
                ...state,
                investmentToEdit: action.payload
            }
        default: 
            return state;
        
    }
}

export default investmentReducer