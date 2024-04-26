export function addNewAccount(account: any): {
    type: string;
    payload: any;
};
export function addAutomaticAccount(account: any): {
    type: string;
    payload: any;
};
export function deleteAccount(accountKey: any): {
    type: string;
    payload: {
        accountKey: any;
    };
};
export function deleteAllAccounts(): {
    type: string;
};
export function setFiriAccessKey(accessKey: any): {
    type: string;
    payload: any;
};
export function importTransactions(transactions: any): {
    type: string;
    payload: any;
};
export function setE24Prices(accountKey: any, prices: any): {
    type: string;
    payload: {
        accountKey: any;
        prices: any;
    };
};
export function importAccounts(accounts: any): {
    type: string;
    payload: any;
};
export function newTransaction(accountKey: any, transaction: any, holdings: any): {
    type: string;
    payload: {
        accountKey: any;
        transaction: any;
        holdings: any;
    };
};
export function deleteTransaction(transactionKey: any, accountKey: any): {
    type: string;
    payload: {
        transactionKey: any;
        accountKey: any;
    };
};
