import { Account, Holding, Transaction } from "../types/Types";
import { v4 as uuidv4 } from 'uuid';
import { fetchKronHoldings } from "./Kron";
import { fetchFiriHoldings } from "./Firi";
import { fetchTicker } from "./E24";

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

export const accountTypes = [
    "Aksjesparekonto",
    "Individuell pensjonskonto",
    "Kryptovaluta",
    "Aksjefondskonto",
    "Egen pensjonskonto",
    "Obligasjon"
]


export function getHoldings(account: Account): Promise<Holding[]> {
    if (account.isManual) {
        if (!account.transactions) {
            console.log('No transactions. Aborting.')
        }

        const holdings: Holding[] = []
        if (account.transactions.length === account.transactions.filter(transaction => transaction.e24Key).length) {//ser om alle transaksjoner har en e24 id
            const uniqueE24Keys = [...new Set(account.transactions.map(transaction => transaction.e24Key))]
                .map(uniqueE24Key => {
                    return {
                        e24Key: uniqueE24Key,
                        equityShare: account.transactions
                            .filter(transaction => transaction.e24Key === uniqueE24Key)
                            .reduce((sum, transaction) => sum + transaction.equityShare, 0),
                        equityType: account.transactions.filter(transaction => transaction.e24Key === uniqueE24Key)[0].equityType
                    }
                })
                .filter(equityShare => equityShare.equityShare > 0);


            return calculateE24Values(uniqueE24Keys, account)
            
        } else {//e24Id mangler. bruk kostpris som verdi
            const uniquieHoldingNames = [...new Set(account.transactions.map(transaction => transaction.name))];
            uniquieHoldingNames.forEach(name => {
                const equityShare = account.transactions.filter(transaction => transaction.name === name).reduce((sum, transaction) => sum + transaction.equityShare, 0)
                const cost = account.transactions.filter(transaction => transaction.name === name).reduce((sum, transaction) => sum + transaction.cost, 0)

                if (cost > 0) {
                    holdings.push(
                        {
                            name,
                            accountKey: account.key,
                            equityShare,
                            equityType: account.transactions.filter(transaction => transaction.name === name)[0].equityType,
                            e24Key: account.transactions.filter(transaction => transaction.name === name)[0].e24Key,
                            key: uuidv4(),
                            value: cost,
                            yield: 0,
                        }
                    )
                }
            })
            return new Promise((resolve, reject) => {
                resolve(holdings)
            })
        }
    }

    //automatic account
    if (account.name === "Kron") {
        return fetchKronHoldings(account)
    } else if (account.name === "Firi") {
        const firiHoldings = fetchFiriHoldings(account)
        return firiHoldings
    }

    return emptyHoldingPromise()
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

async function calculateE24Values(uniqueE24Keys: { e24Key: string, equityShare: number, equityType: string }[], account: Account): Promise<Holding[]> {

    const holdings: Holding[] = []
    const tickers = await fetchTickers(uniqueE24Keys)

    for (let i = 0; i < uniqueE24Keys.length; i++) {
        const transactionName: Transaction | undefined = account.transactions.find(transaction => transaction.e24Key === uniqueE24Keys[i].e24Key)
        holdings.push(
            {
                name: transactionName !== undefined ? transactionName.name : '',
                accountKey: account.key,
                equityShare: uniqueE24Keys[i].equityShare,
                equityType: account.transactions.filter(transaction_1 => transaction_1.e24Key === uniqueE24Keys[i].e24Key)[0].equityType,
                e24Key: uniqueE24Keys[i].e24Key,
                key: uuidv4(),
                value: uniqueE24Keys[i].equityShare * tickers[i],
                yield: 0,
            }
        )
    }
    return new Promise((resolve, reject) => {
        resolve(holdings)
    })
}

export function setTotalValues(account: Account, holdings: Holding[], transactions?: Transaction[]): Promise<Holding[]> {
    return new Promise((resolve, reject) => {
        resolve(holdings)
    })
}

export function emptyHoldingPromise(): Promise<Holding[]> {
    return new Promise((resolve, reject) => {
        resolve([])
    })
}

export function emptyTransactionPromise(): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
        resolve([])
    })
}