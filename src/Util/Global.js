import { getValueInFiat } from "./Firi";

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

export const equityTypes = ["Fund", "Stock", "Cryptocurrency", "Loan"]

export const accountTypes = [
  "Aksjesparekonto",
  "Individuell pensjonskonto",
  "Kryptovaluta",
  "Aksjefondskonto",
  "Egen pensjonskonto",
  "Obligasjon"
]

export function getHoldings(transactions, account) {
  if (!transactions) {
    return
  }

  if (!account.isManual) {
    const allCurrencies = [...new Set(transactions.map(order => order.name))]
    const holdings = []

    allCurrencies.forEach(name => {
      const equityShare = transactions.filter(transaction => transaction.name === name).reduce((sum, transaction) => sum + parseFloat(transaction.equityShare), 0)
      holdings.push(
        {
          accountKey: account.key,
          equityType: "Cryptocurrency",
          goalPercentage: 0,
          equityShare,
          name: name,
        }
      )
    })
    return holdings.filter(holding => holding.equityShare > 0.00000001)
  }

  if (transactions.length === transactions.filter(transaction => transaction.e24Key).length) {
    const holdings = []
    const uniqueHoldingKeys = [...new Set(transactions.map(transaction => transaction.e24Key))];
    uniqueHoldingKeys.forEach(e24Key => {
      const equityShare = transactions.filter(transaction => transaction.e24Key === e24Key).reduce((sum, transaction) => sum + parseFloat(transaction.equityShare), 0)

      if (equityShare > 0) {
        holdings.push(
          {
            name: transactions.find(transaction => transaction.e24Key === e24Key).name,
            accountKey: account.key,
            equityShare,
            equityType: transactions.filter(transaction => transaction.e24Key === e24Key)[0].equityType,
            e24Key,
            goalPercentage: 0
          }
        )
      }
    })
    return holdings
  } 
  const holdings = []
    const uniqueHoldingKeys = [...new Set(transactions.map(transaction => transaction.name))];
    uniqueHoldingKeys.forEach(name => {
      const equityShare = transactions.filter(transaction => transaction.name === name).reduce((sum, transaction) => sum + parseFloat(transaction.equityShare), 0)
      const cost = transactions.filter(transaction => transaction.name === name).reduce((sum, transaction) => sum + parseFloat(transaction.cost), 0)

      if (equityShare > 0) {
        holdings.push(
          {
            name: transactions.find(transaction => transaction.name === name).name,
            accountKey: account.key,
            equityShare,
            equityType: transactions.filter(transaction => transaction.name === name)[0].equityType,
            value: cost,
            goalPercentage: 0
          }
        )
      }
    })
    return holdings
}