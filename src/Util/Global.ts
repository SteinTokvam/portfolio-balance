import {
  Account,
  AccountsAndHoldings,
  AccountTypes,
  Holding,
  Transaction,
} from "../types/Types";
import { v4 as uuidv4 } from "uuid";
import { fetchKronHoldings, fetchKronTransactions } from "./Kron";
import { fetchFiriHoldings, fetchFiriTransactions } from "./Firi";
import { fetchTicker } from "./E24";
import {
  fetchBBHoldings,
  fetchBBTransactions,
  fetchPrice,
} from "./BareBitcoin";
import {
  getAccounts,
  getEquityTypes,
  getTransactions,
  getValueOverTime,
  logNewValueOverTime,
} from "./Supabase";

export const languages = ["us", "no"];

export const useDb = true;

export const styles = {
  valueText: "text-large font-bold leading-none text-default-400",
  valueHeaderText: "text-medium font-semibold leading-none text-default-600",
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
  },
};

export const routes = {
  dashboard: "/",
  portfolio: "/portfolio",
  account: "/account/:accountKey",
  confirmMail: "/confirm-mail",
  login: "/login",
};

export async function getAccountsAndHoldings(
  key: string = ""
): Promise<AccountsAndHoldings> {
  const accounts = await getAccounts(key).then(async (accounts) => {
    const accountsWithTransactions = accounts.map(async (account) => {
      return {
        ...account,
        transactions: await getAllTransactions(account),
      };
    });
    return await Promise.all(accountsWithTransactions);
  });

  logNewValueOverTime(accounts.reduce((acc, curr) => acc + curr.totalValue, 0));
  return {
    accounts,
    holdings: await getAllHoldings(accounts),
    equityTypes: await getEquityTypes(),
    valueOverTime: await getValueOverTime(),
  };
}

export async function getAllTransactions(
  account: Account
): Promise<Transaction[]> {
  if (account.isManual) {
    return getTransactions(account.key);
  }
  if (account.name === "Kron") {
    return fetchKronTransactions(account);
  } else if (account.name === "Firi") {
    return fetchFiriTransactions(account, ["NOK"]);
  } else if (account.name === "Bare Bitcoin") {
    return fetchBBTransactions(account);
  }
  return emptyTransactionPromise();
}

export async function getAllHoldings(accounts: Account[]): Promise<Holding[]> {
  const holdings = accounts.map(async (account: Account) => {
    return getHoldings(account);
  });
  return (await Promise.all(holdings)).flat();
}

export async function getHoldings(account: Account): Promise<Holding[]> {
  if (!account) {
    return Promise.resolve([]);
  }

  if (account.isManual) {
    return getManualAccountHoldings(account);
  } else {
    if (account.name === "Kron") {
      return fetchKronHoldings(account);
    } else if (account.name === "Firi") {
      const firiHoldings = fetchFiriHoldings(account);
      return firiHoldings;
    } else if (account.name === "Bare Bitcoin") {
      return fetchBBHoldings(account);
    }
  }

  return emptyHoldingPromise();
}

async function getManualAccountHoldings(account: Account): Promise<Holding[]> {
  if (!account.transactions) {
    console.log("No transactions. Aborting.");
    return emptyHoldingPromise();
  }

  const holdings: Holding[] = [];

  if (account.type === AccountTypes.CRYPTOCURRENCY) {
    const price = await fetchPrice();
    const equityShare = account.transactions.reduce(
      (sum, transaction) => sum + transaction.equityShare,
      0
    );
    const value = equityShare * price.midBtcnok;
    return [
      {
        name: account.transactions[0].name,
        key: uuidv4(),
        accountKey: account.key,
        value,
        equityType: "CRYPTOCURRENCY",
        equityShare,
        e24Key: "",
        yield:
        value - account.transactions.reduce(
            (sum, transaction) => sum + transaction.cost,
            0
          ),
      },
    ];
  }

  holdings.push(...(await getHoldingsWithE24Ticker(account)));

  holdings.push(...getHoldingsWithoutE24Ticker(account));

  return new Promise((resolve, _) => {
    resolve(holdings);
  });
}

async function getHoldingsWithE24Ticker(account: Account): Promise<Holding[]> {
  const holdings: Holding[] = [];
  const transactionsWithe24 = account.transactions.filter(
    (transaction) => transaction.e24Key
  );
  const uniqueE24Keys = [
    ...new Set(transactionsWithe24.map((transaction) => transaction.e24Key)),
  ]
    .map((uniqueE24Key) => {
      const transactions = account.transactions.filter(
        (transaction) => transaction.e24Key === uniqueE24Key
      );
      return {
        e24Key: uniqueE24Key,
        equityShare: transactions.reduce(
          (sum, transaction) => sum + transaction.equityShare,
          0
        ),
        equityType: transactions[0].equityType,
      };
    })
    .filter((equityShare) => equityShare.equityShare > 0.01);

  const tickers = await fetchTickers(uniqueE24Keys);

  uniqueE24Keys.forEach((uniqueE24Key, i) => {
    const name: string = account.transactions.find(
      (transaction) => transaction.e24Key === uniqueE24Key.e24Key
    )?.name as string;
    const value = uniqueE24Key.equityShare * tickers[i];
    const transactions = account.transactions.filter(
      (transaction) => transaction.e24Key === uniqueE24Key.e24Key
    );
    holdings.push({
      name,
      accountKey: account.key,
      equityShare: uniqueE24Key.equityShare,
      equityType: transactions[0].equityType,
      e24Key: uniqueE24Key.e24Key,
      key: uuidv4(),
      value,
      yield:
        value -
        transactions
          .filter(
            (transaction) =>
              transaction.type === "BUY" || transaction.type === "SELL"
          )
          .reduce((sum, transaction) => sum + transaction.cost, 0),
    });
  });
  return holdings;
}

function getHoldingsWithoutE24Ticker(account: Account): Holding[] {
  const holdings: Holding[] = [];
  const transactions = account.transactions.filter(
    (transaction) => !transaction.e24Key
  );
  const uniquieHoldingNames = [
    ...new Set(transactions.map((transaction) => transaction.name)),
  ];

  uniquieHoldingNames.forEach((uniqueHoldingName) => {
    const buysAndSells = account.transactions
      .filter((transaction) => transaction.name === uniqueHoldingName)
      .filter(
        (transaction) =>
          transaction.type === "BUY" || transaction.type === "SELL"
      );
    const equityShare = buysAndSells.reduce(
      (sum, transaction) => sum + transaction.equityShare,
      0
    );
    const value = buysAndSells.reduce(
      (sum, transaction) => sum + transaction.cost,
      0
    );

    if (value > 0.5) {
      const transaction = buysAndSells.filter(
        (transaction) => transaction.name === uniqueHoldingName
      )[0];
      holdings.push({
        name: uniqueHoldingName,
        accountKey: account.key,
        equityShare,
        equityType: transaction.equityType,
        e24Key: transaction.e24Key,
        key: uuidv4(),
        value,
        yield: account.transactions
          .filter((transaction) => transaction.name === uniqueHoldingName)
          .filter((transaction) => transaction.type === "YIELD")
          .reduce((sum, transaction) => sum + transaction.cost, 0),
      });
    }
  });

  return holdings;
}

async function fetchTickers(
  uniqueE24Keys: { e24Key: string; equityShare: number; equityType: string }[]
): Promise<number[]> {
  const tickers = uniqueE24Keys.map(async (uniqueE24Key) => {
    const period = uniqueE24Key.equityType === "Stock" ? "1opendays" : "1weeks";
    return await fetchTicker(
      uniqueE24Key.e24Key,
      "OSE",
      uniqueE24Key.equityType,
      period
    ).then((res) => (res && res.length > 0 ? res[res.length - 1].value : 0));
  });
  const ret = Promise.all(tickers);
  return await ret;
}

export function emptyHoldingPromise(): Promise<Holding[]> {
  return new Promise((resolve, _) => {
    resolve([]);
  });
}

export function emptyTransactionPromise(): Promise<Transaction[]> {
  return new Promise((resolve, _) => {
    resolve([]);
  });
}
