export type Account = {
    name: string
    key: string
    type: string
    transactions: Transaction[]
    totalValue: number
    yield: number
    isManual: boolean
    apiInfo?: ApiInfo
}

type ApiInfo = {
    accessKey: string
    kronAccountId: string
}

export type Holding = {
    name: string
    key: string
    accountKey: string
    value: number
    equityType: string
    equityShare: number
    e24Key: string
    yield: number
    isin?: string
}

export type Transaction = {
    transactionKey: string
    cost: number
    name: string
    type: string
    date: string
    equityPrice: number
    e24Key: string
    equityShare: number
    equityType: string
}

export type EquityType = {
    key: string,
    label: string,
    goalPercentage: number
}

export type FiriOrder = {
    id: string,
    amount: string,
    currency: string,
    type: string,
    date: string,
    details: {
        match_id: string,
        deposit_id: string,
        deposit_address: string,
        deposit_txid: string,
        withdraw_id: string,
        withdraw_address: string,
        withdraw_txid: string
    }
}

export type FiriPricePoint = {
    equityShare: number,
    currency: string,
    price: FiriPrice
}

export type FiriPrice = {
    id: string,
    last: string,
    high: string,
    change: string,
    low: string,
    volume: string,
    message?: string
}

export enum TransactionType {
    BUY = "BUY",
    SELL = "SELL",
    PLATFORM_FEE = "PLATFORM_FEE",
    DIVIDEND = "DIVIDEND",
    YIELD = "YIELD",
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
}

export enum EquityTypes {
    FUND = "Fund",
    STOCK = "Stock",
    CRYPTOCURRENCY = "Cryptocurrency",
    LOAN = "Loan",
}

export enum AccountTypes {
    AKSJESPAREKONTO = "Aksjesparekonto",
    INDIVIDUELL_PENSJONSKONTO = "Individuell pensjonsparing",
    CRYPTOCURRENCY = "Kryptovaluta",
    AKSJEFONDSKONTO = "Aksjefondskonto",
    EGEN_PENSJONSKONTO = "Egen pensjonskonto",
    LOAN = "Obligasjon"

}