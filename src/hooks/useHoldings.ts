import { getHoldings } from "../Util/Global";
import { Account, Holding, Transaction } from "../types/Types";
import { useEffect, useState } from "react";

export const useholdings = (accounts: Account[], transactions: Transaction[]) => {
    const [holdings, setholdings] = useState<Holding[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const results = await Promise.all(
                    accounts.map(async (account) => 
                        await getHoldings(account, transactions.filter(transaction => transaction.accountKey === account.key))
                    )
                );
                setholdings(results.flat());
            } catch (error) {
                setError(error as string)
            } finally {
                setLoading(false);
            }
        };

        fetchData()
    }, [transactions]);

    return { holdings, loading, error }
}