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
                    await fetchTicker(e24_id, "OSE", account.type, "1weeks").then(res => res)
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
        var totalValue = 0
        const ret = e24Ids !== undefined && e24Ids.map((e24_id) => {
            return { e24_id, share_amount: account.transactions.filter(transaction => transaction.e24_id === e24_id).reduce((sum, transaction) => sum + parseFloat(transaction.share_amount), 0) }
        })
            .filter(fund_name => fund_name.share_amount > 0)
            .map((fund_name) => {
                if (e24Prices.length === 0 || account.transactions.length === undefined) {
                    return (
                        <>
                        </>
                    )
                }

                const allPricesForAccount = e24Prices
                    .filter(e24Price => e24Price.accountKey === account.key)[0]

                if (allPricesForAccount === undefined || allPricesForAccount.prices === undefined) {
                    return (
                        <>
                        </>
                    )
                }

                const priceForInvestment = allPricesForAccount.prices
                    .filter(price => price.e24_id === fund_name.e24_id)[0].value

                const value = priceForInvestment * fund_name.share_amount

                totalValue += value

                if (value < 1) {
                    return (
                        <>
                        </>
                    )
                }
                return (
                    <div className="flex flex-col justify-between pr-4">
                        <p>{account.transactions.find(transaction => transaction.e24_id === fund_name.e24_id).fund_name}</p>
                        <p>{value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p>
                    </div>
                )
            })

        return (
            <div className="">
                <div className="pr-4">
                    <p>{totalValue.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p>
                </div>
                <div className="hidden sm:flex border-t border-default-300">
                    {ret}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col space-y-4">
                <AddAccountButton />
                {accounts.length > 0 ?
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
                                                    {
                                                        accordionSubTilte(account, account.e24_ids)
                                                    }
                                                </div>

                                            </div>}
                                    >
                                        <AccountsWithTransactions account={account} />
                                    </AccordionItem>
                                </Accordion>
                            </>
                        )
                    })
                    :
                    ""
                }
            </div>
        </div>
    )
}