import { Account, AccountTypes, EquityTypes, Holding, Transaction } from "../types/Types";
import { v4 as uuidv4 } from 'uuid';
import { fetchKronHoldings } from "./Kron";
import { fetchFiriHoldings } from "./Firi";
import { fetchTicker } from "./E24";
import { fetchBBHoldings, fetchPrice } from "./BareBitcoin";

export const languages = ["us", "no"];

export const useDb = true

export const styles = {
    valueText: 'text-large font-bold leading-none text-default-400',
    valueHeaderText: 'text-medium font-semibold leading-none text-default-600',
    textInputStyle: {
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
}

export const routes = {
    dashboard: '/dashboard',
    portfolio: '/portfolio',
    account: '/account/:accountKey',
    confirmMail: '/confirm-mail',
    login: '/login'
}

export async function getHoldings(account: Account, transactions: Transaction[]): Promise<Holding[]> {
    if (!account) {
        return Promise.resolve([])
    }

    if (account.isManual) {
        return getManualHoldings(account, transactions)
    } else {
        //automatic account
        if (account.name === "Kron") {
            return fetchKronHoldings(account)
        } else if (account.name === "Firi") {
            const firiHoldings = fetchFiriHoldings(account)
            return firiHoldings
        } else if (account.name === "Bare Bitcoin") {
            return fetchBBHoldings(account)
        }
    }

    return emptyHoldingPromise()
}

async function getManualHoldings(account: Account, transactions: Transaction[]): Promise<Holding[]> {

    const holdings: Holding[] = []
    const transactionsWithe24 = transactions.filter(transaction => transaction.e24Key)
    const transactionsWithoute24 = transactions.filter(transaction => !transaction.e24Key)

    if (account.isManual && account.type === AccountTypes.CRYPTOCURRENCY) {
        const price = await fetchPrice()
        const equityShare = transactions.reduce((sum, transaction) => sum + transaction.equityShare, 0)
        const value = equityShare * price.midBtcnok
        return [
            {
                name: transactions.length > 0 ? account.transactions[0].name : "BTC",
                key: uuidv4(),
                accountKey: account.key,
                value,
                equityType: EquityTypes.CRYPTOCURRENCY,
                equityShare,
                e24Key: '',
                yield: account.transactions.reduce((sum, transaction) => sum + transaction.cost, 0) - value,
            }
        ]
    }

    const uniqueE24Keys = [...new Set(transactionsWithe24.map(transaction => transaction.e24Key))]
        .map(uniqueE24Key => {
            return {
                e24Key: uniqueE24Key,
                equityShare: transactions
                    .filter(transaction => transaction.e24Key === uniqueE24Key)
                    .reduce((sum, transaction) => sum + transaction.equityShare, 0),
                equityType: transactions.filter(transaction => transaction.e24Key === uniqueE24Key)[0].equityType,
            }
        })
        .filter(equityShare => equityShare.equityShare > 0.01);

    const tickers = await fetchTickers(uniqueE24Keys)

    for (let i = 0; i < uniqueE24Keys.length; i++) {
        const transactionName: Transaction | undefined = transactions.find(transaction => transaction.e24Key === uniqueE24Keys[i].e24Key)
        const value = uniqueE24Keys[i].equityShare * tickers[i]
        holdings.push(
            {
                name: transactionName !== undefined ? transactionName.name : '',
                accountKey: account.key,
                equityShare: uniqueE24Keys[i].equityShare,
                equityType: transactions.filter(transaction_1 => transaction_1.e24Key === uniqueE24Keys[i].e24Key)[0].equityType,
                e24Key: uniqueE24Keys[i].e24Key,
                key: uuidv4(),
                value,
                yield: value - transactions.filter(transaction => transaction.e24Key === uniqueE24Keys[i].e24Key).filter(transaction => transaction.type === "BUY" || transaction.type === "SELL").reduce((sum, transaction) => sum + transaction.cost, 0),
            }
        )
    }
    console.log(holdings)


    const uniquieHoldingNames = [...new Set(transactionsWithoute24.map(transaction => transaction.name))];

    uniquieHoldingNames.forEach(name => {
        const buysAndSells = transactions.filter(transaction => transaction.name === name).filter(transaction => transaction.type === "BUY" || transaction.type === "SELL")
        const equityShare = buysAndSells.reduce((sum, transaction) => sum + transaction.equityShare, 0)
        const value = name === "Bare Bitcoin" ? equityShare * 650000 : buysAndSells.reduce((sum, transaction) => sum + transaction.cost, 0)

        if (value > 0.5) {
            holdings.push(
                {
                    name,
                    accountKey: account.key,
                    equityShare,
                    equityType: buysAndSells.filter(transaction => transaction.name === name)[0].equityType,
                    e24Key: buysAndSells.filter(transaction => transaction.name === name)[0].e24Key,
                    key: uuidv4(),
                    value,
                    yield: transactions.filter(transaction => transaction.name === name).filter(transaction => transaction.type === "YIELD").reduce((sum, transaction) => sum + transaction.cost, 0),
                }
            )
        }
    })

    return new Promise((resolve, _) => {
        resolve(holdings)
    })
}

async function fetchTickers(uniqueE24Keys: { e24Key: string, equityShare: number, equityType: string }[]): Promise<number[]> {
    const tickers = uniqueE24Keys.map(async uniqueE24Key => {
        const period = uniqueE24Key.equityType === 'Stock' ? '1opendays' : '1weeks'
        return await fetchTicker(uniqueE24Key.e24Key, "OSE", uniqueE24Key.equityType, period)
            .then(res => res[res.length - 1].value)
    })
    const ret = Promise.all(tickers)
    return await ret
}

export function emptyHoldingPromise(): Promise<Holding[]> {
    return new Promise((resolve, _) => {
        resolve([])
    })
}

export function emptyTransactionPromise(): Promise<Transaction[]> {
    return new Promise((resolve, _) => {
        resolve([])
    })
}