import {
  Account,
  AccountsAndHoldings,
  EquityType,
  Holding,
  Transaction,
} from "../types/Types";
import { supabase } from "../supabaseClient";

export async function getAccounts(key: String = ""): Promise<Account[]> {
  const { data, error } =
    key === ""
      ? await supabase.from("accounts").select()
      : await supabase.from("accounts").select().eq("key", key);
  if (error) {
    console.log(error);
  }

  return data?.map((data) => {
    return {
      name: data.name,
      key: data.key,
      type: data.type,
      totalValue: data.totalValue,
      isManual: data.isManual,
      apiInfo: {
        accessKey: data.accessKey,
        kronAccountId: data.kronAccountId,
      },
    };
  }) as Account[];
}

export function setTotalValue(accountsAndHoldings: AccountsAndHoldings) {
  accountsAndHoldings.accounts.forEach(async (account) => {
    const { error } = await supabase
      .from("accounts")
      .update({
        totalValue: accountsAndHoldings.holdings.reduce(
          (acc: number, curr: Holding) => {
            if (curr.accountKey === account.key) {
              return acc + curr.value;
            }
            return acc;
          },
          0
        ),
      })
      .eq("key", account.key);
    console.error(error);
  });
}

export async function logNewValueOverTime(totalValue: number) {
  const { data, error } = await supabase
    .from("value_over_time")
    .select("*")
    .order("created_at", { ascending: false });

  if (data?.length === 0 || (data?.[data.length - 1].created_at.split(" ")[0] !== new Date().toISOString().split(" ")[0])) {
    const err = (
      await supabase.from("value_over_time").insert({
        value: totalValue,
      })
    ).error;
    if (err) {
      console.log(error);
    }
  }
}

export async function getEquityTypes(): Promise<EquityType[]> {
  const { data, error } = await supabase.from("equity_types").select();
  if (error) {
    console.log(error);
  }

  return data?.map((data) => {
    return {
      label: data.name,
      key: data.id,
      goalPercentage: data.goal_percentage,
    } as EquityType;
  }) as EquityType[];
}

export const importAccountsToSupabase = (accounts: Account[]) => {
  accounts.forEach((account) => {
    addAccount(account).then(() => {
      addTransactions(account.transactions, account.key);
    });
  });
};

export async function addAccount(account: Account): Promise<Account> {
  const { error } = await supabase.from("accounts").insert(
    [account].map((account: Account) => {
      return {
        name: account.name,
        key: account.key,
        type: account.type,
        totalValue: account.totalValue,
        isManual: account.isManual,
        accessKey: account.apiInfo?.accessKey,
        kronAccountId: account.apiInfo?.kronAccountId,
      };
    })
  );
  if (error) {
    console.log(error);
  }
  return account;
}

export async function updateAccount(account: Account): Promise<Boolean> {
  const { data, error } = await supabase
    .from("accounts")
    .update(
      [account].map((account: Account) => {
        return {
          name: account.name,
          key: account.key,
          type: account.type,
          totalValue: account.totalValue,
          isManual: account.isManual,
          accessKey: account.apiInfo?.accessKey,
          kronAccountId: account.apiInfo?.kronAccountId,
        };
      })
    )
    .eq("key", account.key)
    .select();

  console.log(data);

  if (error) {
    console.log(error);
  }
  return error ? false : true;
}

export async function deleteAccountSupabase(
  accountKey: string
): Promise<Boolean> {
  const response = await supabase
    .from("accounts")
    .delete()
    .eq("key", accountKey);

  console.log(response);
  return response.status === 204;
}

export async function deleteAllAccountsSupabase(): Promise<Boolean> {
  const response = await supabase
    .from("accounts")
    .delete()
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

  return response.status === 204;
}

export async function getTransactions(
  accountKey: string
): Promise<Transaction[]> {
  return supabase
    .from("transactions")
    .select()
    .eq("accountKey", accountKey)
    .then((res) => res.data as Transaction[]);
}

export async function addTransaction(
  transaction: Transaction,
  accountKey: string
): Promise<Transaction> {
  const { error } = await supabase
    .from("transactions")
    .insert(
      [transaction].map((transaction: Transaction) =>
        mapTransaction(transaction, accountKey)
      )
    );
  if (error) {
    console.log(error);
  }
  return transaction;
}

async function addTransactions(
  transactions: Transaction[],
  accountKey: string
): Promise<Transaction[]> {
  const { error } = await supabase
    .from("transactions")
    .insert(
      transactions.map((transaction: Transaction) =>
        mapTransaction(transaction, accountKey)
      )
    );
  if (error) {
    console.log(error);
  }
  return transactions;
}

export async function deleteTransactionSupabase(
  transactionKey: string
): Promise<Boolean> {
  const response = await supabase
    .from("transactions")
    .delete()
    .eq("transactionKey", transactionKey);
  return response.status === 204;
}

function mapTransaction(transaction: Transaction, accountKey: string) {
  return {
    transactionKey: transaction.transactionKey,
    cost: transaction.cost,
    name: transaction.name,
    type: transaction.type,
    date: transaction.date,
    equityPrice: transaction.equityPrice,
    e24Key: transaction.e24Key,
    equityShare: transaction.equityShare,
    equityType: transaction.equityType,
    accountKey: accountKey,
  };
}
