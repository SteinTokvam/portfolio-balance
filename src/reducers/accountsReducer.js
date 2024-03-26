
/*
 *
 * {
            name: "",
            key: "",
            type: "",
            transactions: [
                {
                    key: "",
                    cost: 0,
                    name: "",
                    type: "",
                    date: "",
                    equityPrice: 0,
                    e24Key: "",
                    equityShare: 0,
                }
            ],
            goalPercentage: 0,
            totalValue: 0,
            yield: 0,
            isManual: false,
            apiInfo: {
                endPoint: "",
                accessKey: ""
            },
            holdings: [
                {
                    name: "",
                    accountKey: UUID,
                    equityShare: 0,
                    e24Key: "",
                    goalPercentage: 0
                }
            ]
        }
 *
 */

const initialState = {
    accounts: window.localStorage.getItem('accounts') ? JSON.parse(window.localStorage.getItem('accounts')) : [],
}

/*
const accountTypes = [
    "MUTUAL_FUND",
	"STOCK",
	"CRYPTOCURRENCY",
	"ETF"
]

const transactionTypes = [
    "BUY",
    "SELL",
    "PLATFORM_FEE",
    "DIVIDEND",
    "DEPOSIT",
    "WITHDRAWAL",
]
*/

const accountReducer = (state = initialState, action) => {
    var currentAccounts = []
    var index = -1
    switch (action.type) {
        case 'ADD_NEW_ACCOUNT':
            window.localStorage.setItem("accounts", JSON.stringify([...state.accounts, action.payload]))
            return {
                ...state,
                accounts: [...state.accounts, action.payload]
            }
        case 'ADD_AUTOMATIC_ACCOUNT':
            window.localStorage.setItem("accounts", JSON.stringify([...state.accounts, action.payload]))
            return {
                ...state,
                accounts: [...state.accounts, action.payload]
            }
        case 'IMPORT_TRANSACTIONS':
            currentAccounts = [...state.accounts]
            index = currentAccounts.findIndex(account => account.key === action.payload.key)
            const transactionsPayload = action.payload.transactions
            const currentTransactionKeys = currentAccounts[index].transactions.map(transaction => transaction.key)
            const newTransactions = transactionsPayload.filter(transaction => !currentTransactionKeys.includes(transaction.key))
            console.log(newTransactions)
            if(newTransactions.length === 0) {
                console.log("no new transactions")
                return {...state}
            }
            currentAccounts[index] = {
                ...currentAccounts[index], 
                transactions: [...currentAccounts[index].transactions, ...newTransactions], 
                holdings: action.payload.holdings, 
            }
            window.localStorage.setItem("accounts", JSON.stringify(currentAccounts))
            return {
                ...state,
                accounts: currentAccounts
            }
        case 'SET_TOTAL_VALUE_FOR_INVESTMENTS':
            return {
                ...state,
                totalValue: action.payload
            }
        default:
            return state
    }
}

export default accountReducer