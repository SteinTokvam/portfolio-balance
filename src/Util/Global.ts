import {
  Account,
  AccountsAndHoldings,
  AccountTypes,
  Holding,
  KronDevelopment,
  PriceHistory,
  Transaction,
  ValueOverTime,
} from "../types/Types";
import { v4 as uuidv4 } from "uuid";
import {
  fetchKronDevelopment,
  fetchKronHoldings,
  fetchKronTransactions,
} from "./Kron";
import { fetchFiriHoldings, fetchFiriTransactions } from "./Firi";
import { fetchTicker } from "./E24";
import {
  fetchBBHoldings,
  fetchBBTransactions,
  fetchPrice,
  fetchPriceHistory,
} from "./BareBitcoin";
import {
  getAccounts,
  getEquityTypes,
  getTransactions,
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

  return {
    accounts,
    holdings: await getAllHoldings(accounts),
    equityTypes: await getEquityTypes(),
  };
}

export async function calculateValueOverTime(accounts: Account[]) {
  const transactionsExceptKron = accounts
    .filter((account: Account) => account.name !== "Kron")
    .map((account) => account.transactions)
    .flat();
  const kronDevelopment: KronDevelopment[] = await fetchKronDevelopment(
    accounts.filter((account: Account) => account.name === "Kron", "total")[0]
  );

  const valueOverTimeExceptKron = await getHoldingsOverTime(
    transactionsExceptKron.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  );

  const allValueOverTime: ValueOverTime[] = [
    ...valueOverTimeExceptKron,
    ...kronDevelopment.map((kron: KronDevelopment) => {
      return {
        created_at: kron.date,
        value: kron.market_value,
      };
    }),
  ]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .reduce((acc: ValueOverTime[], curr: ValueOverTime) => {
      const existingValue = acc.find(
        (item) => item.created_at === curr.created_at
      );
      if (existingValue) {
        existingValue.value += curr.value;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  return allValueOverTime.map((item) => {
    return {
      ...item,
      value: parseFloat(item.value.toFixed(2)),
    };
  });
}

function generateDateList(startDate: Date) {
  const dateList = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date()) {
    dateList.push(new Date(currentDate).toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateList;
}

async function getHoldingsOverTime(transactions: Transaction[]): Promise<ValueOverTime[]> {
  const daysSinceFirstTransaction = Math.round(
    (new Date().getTime() - new Date(transactions[0].date).getTime()) /
      (1000 * 3600 * 24)
  );
  const dates = generateDateList(new Date(transactions[0].date));
  const holdingsOverTime = new Map<string, ValueOverTime>();
  const priceHistory = await fetchPriceHistory(transactions.filter((transaction) => transaction.name === "BTC")[0].date.split("T")[0])
  for (let i = 0; i < daysSinceFirstTransaction; i++) {
    const transactionsBeforeDate = transactions.filter(
      (transaction) =>
        new Date(transaction.date.split("T")[0]).getTime() <=
        new Date(dates[i]).getTime()
    );
    holdingsOverTime.set(
      dates[i],
      await getHoldingsForTransactions(transactionsBeforeDate, dates[i], priceHistory)
    );
  }
  return Array.from(holdingsOverTime.values()).flat();
}

async function getHoldingsForTransactions(
  transactions: Transaction[],
  date: string,
  priceHistory: PriceHistory
): Promise<ValueOverTime> {
  //TODO: Må kunne hente fra e24/binance.. trenger egentlig bare equityShare og evt e24Key for dette og ikke et helt holding objekt
  if (!transactions) return {} as ValueOverTime;

  const transactionsWithe24: Transaction[] = transactions.filter(
    (transaction) => transaction.e24Key
  );

  const uniqueE24Keys = [
    ...new Set(transactionsWithe24.map((transaction) => transaction.e24Key)),
  ];
  console.log(uniqueE24Keys);

  const transactionsWithoutE24: Transaction[] = transactions.filter(
    (transaction) => !transaction.e24Key
  );
  var value = getHoldingsWithoutE24TickerCalc(
    transactionsWithoutE24,
    ""
  ).reduce((sum, holding) => sum + holding.value, 0);

  const bitcoin = transactions.filter(
    (transaction) => transaction.name === "BTC"
  )

  if(bitcoin.length > 0) {
    const btcEquityShare = bitcoin.reduce((sum, transaction) => {
        if(transaction.type === "BUY" || transaction.type === "YIELD" || transaction.type === "DEPOSIT") 
            return sum + transaction.equityShare
        return sum - transaction.equityShare}, 0
    ) 
    
    
    const btcPriceForDate = priceHistory.data.filter(price => price.date.split("T")[0] === date)
    if(btcPriceForDate.length > 0) {
        value += btcEquityShare * (btcPriceForDate[0].close*11)
    } else {
        console.log("BTC price not found for date", date, priceHistory.data)
    }
    
  }
  
  return {
    created_at: date,
    value: parseFloat(value.toFixed(2)),
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
          account.transactions.reduce(
            (sum, transaction) => sum + transaction.cost,
            0
          ) - value,
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

function getHoldingsWithoutE24TickerCalc(
  transactions: Transaction[],
  accountKey: string
): Holding[] {
  const holdings: Holding[] = [];
  const transactionsWithoutE24 = transactions.filter(
    (transaction) => !transaction.e24Key
  );
  const uniquieHoldingNames = [
    ...new Set(transactionsWithoutE24.map((transaction) => transaction.name)),
  ];

  uniquieHoldingNames.forEach((uniqueHoldingName) => {
    const buysAndSells = transactions
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
        accountKey: accountKey,
        equityShare,
        equityType: transaction.equityType,
        e24Key: transaction.e24Key,
        key: uuidv4(),
        value,
        yield: transactions
          .filter((transaction) => transaction.name === uniqueHoldingName)
          .filter((transaction) => transaction.type === "YIELD")
          .reduce((sum, transaction) => sum + transaction.cost, 0),
      });
    }
  });

  return holdings;
}

function getHoldingsWithoutE24Ticker(account: Account): Holding[] {
  return getHoldingsWithoutE24TickerCalc(account.transactions, account.key);
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
