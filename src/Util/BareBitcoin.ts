import { Account, Holding, PriceHistory, Transaction } from "../types/Types";

const isLocal = false;
const baseUrl = isLocal
  ? "http://localhost:3000"
  : "https://portfolio-balance-backend.onrender.com";

export async function fetchBBTransactions(
  account: Account
): Promise<Transaction[]> {
  try {
    const response = await fetch(`${baseUrl}/barebitcoin/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessKey: account.apiInfo ? account.apiInfo.accessKey : "",
      }),
    });

    const res = await response.json();
    console.log("Fetched Bare bitcoin transactions", res);
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchBBHoldings(account: Account): Promise<Holding[]> {
  try {
    const response = await fetch(`${baseUrl}/barebitcoin/balance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessKey: account.apiInfo ? account.apiInfo.accessKey : "",
        accountKey: account.key,
      }),
    });

    const res = await response.json();
    console.log("Fetched Bare Bitcoin holdings", res);
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchPrice() {
  return fetch(`${baseUrl}/barebitcoin/price`).then((res) => res.json());
}

export async function fetchPriceHistory(startDate: string): Promise<PriceHistory> {
    const body = JSON.stringify({
        symbol: "BTC/USDT",
        timeframe: "1d",
        since: new Date(startDate).getTime(),
        limit: 1000,
      })

  const response: PriceHistory = await fetch(`${baseUrl}/btcwallet/price`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((res) => res.json())
    console.log('Fetched price history', response)
    return response
}
