export const addNewInvestment = (investment) => {
    return {
        type: 'ADD_NEW_INVESTMENT',
        payload: investment
    }
}