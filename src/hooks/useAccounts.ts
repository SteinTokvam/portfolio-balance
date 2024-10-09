import { supabase } from "../supabaseClient";
import { Account } from "../types/Types";
import { getAccounts } from "../Util/Supabase";
import { useEffect, useState } from "react";

export const useAccounts = (accountKey: string = "") => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await getAccounts(supabase);
            if(accountKey !== "") {
                setAccounts(response.filter(account => account.key === accountKey));
            } else {
                setAccounts(response);
            }
          } catch (error) {
            setError(error as string)
          } finally {
            setLoading(false);
          }
        };
    
        if(accountKey !== "" || accounts.length === 0) {
            fetchData()    
        }
      }, []);

      return { accounts, loading, error }
}