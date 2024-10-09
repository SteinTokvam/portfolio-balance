import { supabase } from "../supabaseClient";
import { Account, Holding, KronDevelopment, Transaction } from "../types/Types";
import { getAutomaticTransactions, getHoldings } from "../Util/Global";
import { fetchKronDevelopment } from "../Util/Kron";
import { getAccounts, getTransactions } from "../Util/Supabase";
import { useEffect, useState } from "react";

export const useData = (types: string[]) => {
    const [data, setData] = useState(new Map<string, any>());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchAccounts = async () => {
        try {
            const response = await getAccounts(supabase);
            return response;

        } catch (error) {
            setError(error as string)
        }
        return [{}] as Account[]
    }

    const fetchTransactions = async () => {
        try {
            const response: Transaction[] = await getTransactions(supabase);
            const results = await getAutomaticTransactions()

            response.push(...results)

            const map = new Map<string, Transaction[]>();
            response.forEach(transaction => {
                if (map.has(transaction.accountKey)) {
                    map.get(transaction.accountKey)?.push(transaction);
                } else {
                    map.set(transaction.accountKey, [transaction]);
                }
            })
            return {
                transactions: response,
                transactionsByAccount: map
            }
        } catch (error) {
            setError(error as string)
        }
        return { transactions: [] as Transaction[], transactionsByAccount: new Map() }
    }

    const fetchHoldings = async (): Promise<Holding[]> => {
        try {
            const accounts = await getAccounts(supabase);
            const transactions = await getTransactions(supabase);
            const results = await Promise.all(
                accounts.map(async (account) =>
                    await getHoldings(account, transactions.filter(transaction => transaction.accountKey === account.key))
                )
            );
            const holdings = results.flat();
            return holdings
        } catch (error) {
            setError(error as string)
        }
        return [] as Holding[]
    };

    const fetchKronDev = async () => {
        try {
            const account = await getAccounts(supabase, true);
            const response = await fetchKronDevelopment(account.filter(a => a.name === "Kron")[0]);
            return response;
        } catch (error) {
            setError(error as string)
        }
        return [] as KronDevelopment[]
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                types.forEach(async (type) => {
                    setLoading(true);
                    console.log("fetching", type)
                    if(data.get(type) !== undefined) {
                        return
                    }
                    switch (type) {
                        case "accounts":
                            const accounts = await fetchAccounts();
                            console.log("accounts", accounts)
                            setData(prevState => {
                                const newState = new Map(prevState);
                                newState.set(type, accounts);
                                return newState;
                            });
                            break;
                        case "transactions":
                            const transactions = await fetchTransactions();
                            setData(prevState => {
                                const newState = new Map(prevState);
                                newState.set(type, transactions);
                                return newState;
                            });
                            break;
                        case "holdings":
                            const holdings = await fetchHoldings();
                            setData(prevState => {
                                const newState = new Map(prevState);
                                newState.set(type, holdings);
                                return newState;
                            });
                            break;
                        case "kronDevelopment":
                            const kronDevelopment = await fetchKronDev();
                            setData(prevState => {
                                const newState = new Map(prevState);
                                newState.set(type, kronDevelopment);
                                return newState;
                            });
                            break;
                        default:
                    }
                    const response = await fetch(type);
                    const json = await response.json();
                    setData(json);
                })
            } catch (error: any) {
                setError(error)
            } finally {
                setLoading(false);
            }
        };
        console.log("fetching", types)
        fetchData()

    }, [types]);

    return { data, loading, error }
};