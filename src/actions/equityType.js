
export const changeGoalPercentage = (goalPercentage) => {
    return {
        type: 'CHANGE_GOAL_PERCENTAGE',
        payload: goalPercentage
    }
}

export const setAllPercentages = (allPercentages) => {
    return {
        type: 'SET_ALL_PERCENTAGES',
        payload: allPercentages
    }
}