
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
            const isManual = currentAccounts[index].isManual
            const transactionsPayload = action.payload.transactions
            const currentTransactionKeys = currentAccounts[index].transactions.map(transaction => transaction.key)
            const newTransactions = transactionsPayload.filter(transaction => !currentTransactionKeys.includes(transaction.key))
            
            const currentHoldings = [...state.accounts[index].holdings]
            
            action.payload.holdings.forEach(newHolding => {
                const index = currentHoldings.findIndex(curr => curr.e24Key === newHolding.e24Key)
                if(index !== -1) {
                    currentHoldings[index] = {...currentHoldings[index], equityShare: currentHoldings[index].equityShare + newHolding.equityShare}
                } else {
                    currentHoldings.push(newHolding)
                }
            });

            if(!isManual) {
                currentAccounts[index] = {
                    ...currentAccounts[index], 
                    transactions: transactionsPayload, 
                    holdings: action.payload.holdings, 
                }
                window.localStorage.setItem("accounts", JSON.stringify(currentAccounts))
                return {
                    ...state,
                    accounts: currentAccounts
                }
            }

            if(newTransactions.length === 0) {
                console.log("no new transactions")
                return {...state}
            }
            currentAccounts[index] = {
                ...currentAccounts[index], 
                transactions: [...currentAccounts[index].transactions, ...newTransactions], 
                holdings: currentHoldings, 
            }
            window.localStorage.setItem("accounts", JSON.stringify(currentAccounts))
            return {
                ...state,
                accounts: currentAccounts
            }
        case 'IMPORT_ACCOUNTS':
            window.localStorage.setItem("accounts", JSON.stringify(action.payload.accounts))
            console.log(action.payload.accounts)
            return {
                ...state,
                accounts: action.payload.accounts
            }
        case 'DELETE_ALL_ACCOUNTS':
            return initialState
        default:
            return state
    }
}

export default accountReducer