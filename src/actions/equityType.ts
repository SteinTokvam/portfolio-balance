import { EquityType } from "../types/Types"

export const setEquityTypes = (equityTypes: EquityType[]) => {
    return {
        type: 'SET_EQUITY_TYPES',
        payload: equityTypes
    }
}

export const changeGoalPercentage = (goalPercentage: EquityType) => {
    return {
        type: 'CHANGE_GOAL_PERCENTAGE',
        payload: [goalPercentage]
    }
}

export const setAllPercentages = (allPercentages: EquityType[]) => {
    return {
        type: 'SET_ALL_PERCENTAGES',
        payload: allPercentages
    }
}