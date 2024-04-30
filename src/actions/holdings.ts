import { Holding } from "../types/Types";


export const addHolding = (holding: Holding) => {
    return {
        type: "ADD_HOLDING",
        payload: holding
    }
}

export const updateHolding = (holding: Holding) => {
    return {
        type: "UPDATE_HOLDING",
        payload: [holding]
    }
}

export const updateHoldings = (holdings: Holding[]) => {
    return {
        type: "UPDATE_HOLDINGS",
        payload: holdings
    }
}

export const addHoldings = (holdings: Holding[]) => {
    return {
        type: "ADD_HOLDINGS",
        payload: holdings
    }
}

export const deleteHolding = (holding: Holding) => {
    return {
        type: "DELETE_HOLDING",
        payload: holding
    }
}

export const deleteAllHoldings = () => {
    return {
        type: "DELETE_ALL_HOLDINGS"
    }
}