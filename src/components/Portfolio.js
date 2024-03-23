import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import AccountsWithTransactions from "./AccountsWithTransactions";
import { useDispatch, useSelector } from "react-redux";
import AddAccountButton from "./AddAccountButton";
import CompanyIcon from "../icons/CompanyIcon";
import { setE24Prices } from "../actions/account";
import { fetchTicker } from "../Util/E24";
import { useEffect } from "react";


export default function Portfolio() {

    const accounts = useSelector(state => state.rootReducer.accounts.accounts);
    const e24Prices = useSelector(state => state.rootReducer.accounts.e24Prices);

    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchE24Data(account) {
            if (account.e24_ids === undefined) {
                return []
            }
            var tmp = []

            for (let j = 0; j < account.e24_ids.length; j++) {
                const e24_id = account.e24_ids[j];
                tmp.push(
                    await fetchTicker(e24_id, "OSE", account.type, "1months").then(res => res)
                        .then(e24Data => {
                            return {
                                account: account.key,
                                e24_id,
                                value: e24Data[e24Data.length - 1].value
                            }
                        })
                )
            }
            dispatch(setE24Prices(account.key, tmp))
        }

        for (let i = 0; i < accounts.length; i++) {
            fetchE24Data(accounts[i])
        }
    }, [accounts, dispatch])

    const accordionSubTilte = (account, e24Ids) => {
        const holdings = e24Ids?.map(e24_id => {
            const transactionsForId = account.transactions.filter(transaction => transaction.e24_id === e24_id);
            const shareAmount = transactionsForId.reduce((sum, transaction) => sum + parseFloat(transaction.share_amount), 0);
            return { e24_id, shareAmount };
        })
            .filter(item => item.shareAmount > 0);

        if (!holdings) {
            return
        }

        const holdingValues = holdings.map(item => {
            const transaction = account.transactions.find(transaction => transaction.e24_id === item.e24_id);
            if (!transaction || !e24Prices.length || !account.transactions.length) {
                return null;
            }

            const accountPrices = e24Prices.find(price => price.accountKey === account.key)?.prices;
            if (!accountPrices) {
                return null;
            }

            const price = accountPrices.find(price => price.e24_id === item.e24_id)?.value;
            const value = price * item.shareAmount;

            return { transaction, value };
        })
            .filter(item => item && item.value >= 1);

        return { holdingValues: holdingValues, totalValue: holdingValues.reduce((sum, item) => sum + item.value, 0) }
    }

    const holdings = new Map()
    var investmentsTotalValue = 0

    accounts.forEach(account => {
        const value = accordionSubTilte(account, account.e24_ids)
        holdings.set(account.key, value)
        investmentsTotalValue += value.totalValue
    })

    return (
        <div>
            <div className="flex flex-col space-y-4">
                <AddAccountButton />
                {accounts.length > 0 ?
                    <div>
                        {investmentsTotalValue.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                        {
                            accounts.map((account) => {
                                return (
                                    <>

                                        <Accordion key={account.key} >
                                            <AccordionItem aria-label="Accordion"
                                                title={account.name}
                                                startContent={
                                                    <Avatar isBordered showFallback radius="full" size="md" src={`https://logo.uplead.com/${account.name.toLowerCase()}.no`} fallback={<CompanyIcon />} />
                                                }
                                                className="border border-default-300 rounded-3xl p-4"
                                                subtitle={
                                                    <div>
                                                        <p>{account.type}</p>
                                                        <div className="">
                                                            <div>
                                                                <div className="pr-4">
                                                                    <p>{holdings.get(account.key).totalValue.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p>
                                                                </div>
                                                                <div className="hidden sm:flex border-t border-default-300">
                                                                    {holdings.get(account.key).holdingValues.map(item => (
                                                                        <div className="flex flex-col justify-between pr-4" key={item.transaction.fund_name}>
                                                                            <p>{item.transaction.fund_name}</p>
                                                                            <p>{item.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>}
                                            >
                                                <AccountsWithTransactions account={account} />
                                            </AccordionItem>
                                        </Accordion>
                                    </>
                                )
                            })
                        }
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    )
}