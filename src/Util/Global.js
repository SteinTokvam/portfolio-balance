export const languages = ["us", "no"];

export const textInputStyle = {
    label: "text-black/50 dark:text-white/90",
    input: [
      "bg-transparent",
      "text-black/90 dark:text-white/90",
      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
    ],
    innerWrapper: "bg-transparent",
    inputWrapper: [
      "shadow-xl",
      "bg-default-200/50",
      "dark:bg-default/60",
      "backdrop-blur-xl",
      "backdrop-saturate-200",
      "hover:bg-default-200/70",
      "dark:hover:bg-default/70",
      "group-data-[focused=true]:bg-default-200/50",
      "dark:group-data-[focused=true]:bg-default/60",
      "!cursor-text",
    ],
  }

  export const routes = {
    dashboard: '/',
    portfolio: '/portfolio',
}

export const equityTypes = ["Fund", "Stock", "Cryptocurrency"]

export function getHoldings(accountKey, transactions, type, accounts) {
  if (!transactions) {
      return
  }
  if (!accounts.filter(account => account.key === accountKey)[0].isManual) {
      const currentTransactions = accounts.filter(account => account.key === accountKey)[0].transactions
      const currentTransactionKeys = currentTransactions.map(transaction => transaction.key)
      const newTransactions = transactions.filter(transaction => !currentTransactionKeys.includes(transaction.key))
      const holdings = []
      const uniqueHoldingKeys = [...new Set(newTransactions.map(transaction => transaction.e24Key))];
      uniqueHoldingKeys.forEach(e24Key => {
          const equityShare = newTransactions.filter(transaction => transaction.e24Key === e24Key).reduce((sum, transaction) => sum + parseFloat(transaction.equityShare), 0)

          if (equityShare > 0) {
              holdings.push(
                  {
                      name: newTransactions.find(transaction => transaction.e24Key === e24Key).name,
                      accountKey: accountKey,
                      equityShare,
                      equityType: type,
                      e24Key,
                      goalPercentage: 0
                  }
              )
          }
      })
      return holdings
  }
  const holdings = []
  const uniqueHoldingKeys = [...new Set(transactions.map(transaction => transaction.e24Key))];
  uniqueHoldingKeys.forEach(e24Key => {
      const equityShare = transactions.filter(transaction => transaction.e24Key === e24Key).reduce((sum, transaction) => sum + parseFloat(transaction.equityShare), 0)

      if (equityShare > 0) {
          holdings.push(
              {
                  name: transactions.find(transaction => transaction.e24Key === e24Key).name,
                  accountKey: accountKey,
                  equityShare,
                  equityType: type,
                  e24Key,
                  goalPercentage: 0
              }
          )
      }
  })
  return holdings
}