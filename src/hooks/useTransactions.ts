import { supabase } from "../supabaseClient";
import { Transaction } from "../types/Types";
import { getTransactions } from "../Util/Supabase";
import { useEffect, useState } from "react";

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsByAccount, setTransactionsByAccount] = useState<Map<string, Transaction[]>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response: Transaction[] = await getTransactions(supabase);
                setTransactions(response);
                const map = new Map<string, Transaction[]>();
                response.forEach(transaction => {
                    if (map.has(transaction.accountKey)) {
                        map.get(transaction.accountKey)?.push(transaction);
                    } else {
                        map.set(transaction.accountKey, [transaction]);
                    }
                })

                setTransactionsByAccount(map);
            } catch (error) {
                setError(error as string)
            } finally {
                setLoading(false);
            }
        };

        fetchData()

    }, []);

    return { transactions, transactionsByAccount, loading, error }
}