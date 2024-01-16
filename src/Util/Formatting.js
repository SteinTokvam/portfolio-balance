
export function findAccountType(accountKey, accountTypes) {
    return accountTypes.find(el => {
       return el.key === accountKey
    })?.name
}