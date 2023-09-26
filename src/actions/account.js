export const addNewAccountType = (account) => {
    return {
        type: 'ADD_NEW_ACCOUNT_TYPE',
        payload: account
    }
}

export const deleteAccountTypes = (defaultAccountType) => {
    return {
        type: 'DELETE_ACCOUNT_TYPES',
        payload: [defaultAccountType]
    }
}

export const addInitialAccountTypes = (accountTypes) => {
    return {
        type: 'ADD_INITIAL_ACCOUNT_TYPES',
        payload: accountTypes
    }
}