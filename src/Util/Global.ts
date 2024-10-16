import { Account, AccountTypes, EquityTypes, Holding, Transaction } from "../types/Types";
import { v4 as uuidv4 } from 'uuid';
import { fetchKronHoldings } from "./Kron";
import { fetchFiriHoldings } from "./Firi";
import { fetchTicker } from "./E24";
import { fetchBBHoldings, fetchPrice } from "./BareBitcoin";
import { get } from "http";

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

export async function getHoldings(account: Account): Promise<Holding[]> {
    if (!account) {
        return Promise.resolve([])
    }

    if (account.isManual) {
        return getManualAccountHoldings(account)
    } else {
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

async function getManualAccountHoldings(account: Account): Promise<Holding[]> {
    if (!account.transactions) {
        console.log('No transactions. Aborting.')
        return emptyHoldingPromise()
    }

    const holdings: Holding[] = []
    const transactionsWithe24 = account.transactions.filter(transaction => transaction.e24Key)
    const transactionsWithoute24 = account.transactions.filter(transaction => !transaction.e24Key)

    if (account.type === AccountTypes.CRYPTOCURRENCY) {
        const price = await fetchPrice()
        const equityShare = account.transactions.reduce((sum, transaction) => sum + transaction.equityShare, 0)
        const value = equityShare * price.midBtcnok
        return [
            {
                name: account.transactions.length > 0 ? account.transactions[0].name : "BTC",
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

    if (transactionsWithe24.length + transactionsWithoute24.length === account.transactions.length) {

        const uniqueE24Keys = [...new Set(transactionsWithe24.map(transaction => transaction.e24Key))]
            .map(uniqueE24Key => {
                return {
                    e24Key: uniqueE24Key,
                    equityShare: account.transactions
                        .filter(transaction => transaction.e24Key === uniqueE24Key)
                        .reduce((sum, transaction) => sum + transaction.equityShare, 0),
                    equityType: account.transactions.filter(transaction => transaction.e24Key === uniqueE24Key)[0].equityType,
                }
            })
            .filter(equityShare => equityShare.equityShare > 0.01);

        const tickers = await fetchTickers(uniqueE24Keys)

        for (let i = 0; i < uniqueE24Keys.length; i++) {
            const transactionName: Transaction | undefined = account.transactions.find(transaction => transaction.e24Key === uniqueE24Keys[i].e24Key)
            const value = uniqueE24Keys[i].equityShare * tickers[i]
            const transactions = account.transactions.filter(transaction => transaction.e24Key === uniqueE24Keys[i].e24Key)
            holdings.push(
                {
                    name: transactionName !== undefined ? transactionName.name : '',
                    accountKey: account.key,
                    equityShare: uniqueE24Keys[i].equityShare,
                    equityType: transactions[0].equityType,
                    e24Key: uniqueE24Keys[i].e24Key,
                    key: uuidv4(),
                    value,
                    yield: value - transactions
                        .filter(transaction => transaction.type === "BUY" || transaction.type === "SELL")
                        .reduce((sum, transaction) => sum + transaction.cost, 0),
                }
            )
        }

        holdings.push(...getHoldingsWithoutE24Ticker(account, transactionsWithoute24))

        return new Promise((resolve, _) => {
            resolve(holdings)
        })
    }
    return emptyHoldingPromise()
}

function getHoldingsWithoutE24Ticker(account: Account, transactions: Transaction[] = []): Holding[] {
    const holdings: Holding[] = []
    const uniquieHoldingNames = [...new Set(transactions.map(transaction => transaction.name))];

    uniquieHoldingNames.forEach(uniqueHoldingName => {
        const buysAndSells = account.transactions
            .filter(transaction => transaction.name === uniqueHoldingName)
            .filter(transaction => transaction.type === "BUY" || transaction.type === "SELL")
        const equityShare = buysAndSells
            .reduce((sum, transaction) => sum + transaction.equityShare, 0)
        const value = uniqueHoldingName === "Bare Bitcoin" ?
            equityShare * 650000 :
            buysAndSells.reduce((sum, transaction) => sum + transaction.cost, 0)//TODO: fiks dummy btc pris

        if (value > 0.5) {
            const transaction = buysAndSells.filter(transaction => transaction.name === uniqueHoldingName)[0]
            holdings.push(
                {
                    name: uniqueHoldingName,
                    accountKey: account.key,
                    equityShare,
                    equityType: transaction.equityType,
                    e24Key: transaction.e24Key,
                    key: uuidv4(),
                    value,
                    yield: account.transactions
                        .filter(transaction => transaction.name === uniqueHoldingName)
                        .filter(transaction => transaction.type === "YIELD")
                        .reduce((sum, transaction) => sum + transaction.cost, 0),
                }
            )
        }
    })

    return holdings

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