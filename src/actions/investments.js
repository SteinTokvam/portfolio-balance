export const addNewInvestment = (investment) => {
    return {
        type: 'ADD_NEW_INVESTMENT',
        payload: investment
    }
}

export const editInvestment = (investment) => {
    return {
        type: 'EDIT_INVESTMENT',
        payload: investment
    }
}

export const setInvestmentToEdit = (investment) => {
    return {
        type: 'SET_INVESTMENT_TO_EDIT',
        payload: investment
    }
}

export const deleteInvestment = (key) => {
    return {
        type: 'DELETE_INVESTMENT',
        payload: key
    }
}

export const deleteInvestments = () => {
    return {
        type: 'DELETE_INVESTMENTS',
        payload: []
    }
}