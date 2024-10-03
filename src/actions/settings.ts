export const toggleHideNumbers = (hideNumbers: boolean) => {
    return {
        type: 'TOGGLE_HIDE_NUMBERS',
        payload: { hideNumbers }
    }
}