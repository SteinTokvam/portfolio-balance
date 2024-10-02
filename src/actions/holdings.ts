import { Account, Holding } from "../types/Types";

export const updateHoldings = (holdings: Holding[], accountKey: string) => {
    return {
        type: "UPDATE_HOLDINGS",
        payload: { holdings, accountKey }
    }
}

export const addHoldings = (holdings: Holding[], accountKey: string) => {
    return {
        type: "ADD_HOLDINGS",
        payload: {holdings, accountKey}
    }
}

export const deleteAllHoldings = () => {
    return {
        type: "DELETE_ALL_HOLDINGS"
    }
}

export const deleteHoldingsForAccount = (account: Account) => {
    return {
        type: "DELETE_HOLDINGS_FOR_ACCOUNT",
        payload: {accountKey: account.key}
    }
}