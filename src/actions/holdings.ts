import { Holding } from "../types/Types";


export const addHolding = (holding: Holding) => {
    return {
        type: "ADD_HOLDING",
        payload: holding
    }
}

export const updateHolding = (holding: Holding, accountKey: string) => {
    return {
        type: "UPDATE_HOLDING",
        payload: {holdings: [holding], accountKey}
    }
}

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

export const deleteHolding = (holding: Holding, accountKey: string) => {
    return {
        type: "DELETE_HOLDING",
        payload: {holding, accountKey}
    }
}

export const deleteAllHoldings = () => {
    return {
        type: "DELETE_ALL_HOLDINGS"
    }
}