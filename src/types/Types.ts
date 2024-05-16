
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

export type ApiInfo = {
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
}

export type Transaction = {
    key: string
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

export type TotalValue = {
    value: number,
    accountKey: string,
    name: string
}