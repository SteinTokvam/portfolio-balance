import { fetchKronDevelopment } from "../Util/Kron";
import { Account } from "../types/Types";
import { useEffect, useState } from "react";

export const useKronDevelopment = (account: Account) => {
    const [kronDevelopment, setKronDevelopment] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if(!account || account.name !== 'Kron') {
            setLoading(true);
            return;
        }
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await fetchKronDevelopment(account);
            setKronDevelopment(response);
          } catch (error) {
            setError(error as string)
          } finally {
            setLoading(false);
          }
        };
    
        fetchData()
    
      }, []);

      return { kronDevelopment, loading, error }
}