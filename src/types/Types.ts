import { SVGProps } from "react"

export type State = {
    rootReducer: {
        accounts: {
            accounts: Account[]
        },
        equity: {
            equityTypes: EquityType[]
        },
        holdings: {
            holdings: Holding[]
        },
        transactions: {
            transactions: Transaction[]
        },
        settings: {
            hideNumbers: boolean
        }
    }
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
  };

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

export type AccountsAndHoldings = {
    accounts: Account[],
    holdings: Holding[],
    equityTypes: EquityType[],
    valueOverTime: ValueOverTime[]
}

export type ValueOverTime = {
    value: number,
    created_at: string
}

export type KronDevelopment = {
    yield_percentage: number,
    date: string,
    yield_in_currency: number,
    market_value: number
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

export type E24Ticker = {
    date: Date,
    value: number
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
    WRITEDOWN = "WRITE-DOWN"
}

export enum AccountTypes {
    AKSJESPAREKONTO = "Aksjesparekonto",
    INDIVIDUELL_PENSJONSKONTO = "Individuell pensjonsparing",
    CRYPTOCURRENCY = "Kryptovaluta",
    AKSJEFONDSKONTO = "Aksjefondskonto",
    EGEN_PENSJONSKONTO = "Egen pensjonskonto",
    LOAN = "Obligasjon"

}