import React from "react";
import { Accordion, AccordionItem, Avatar, Skeleton } from "@nextui-org/react";
import TransactionsTable from "./TransactionsTable";
import { useDispatch, useSelector } from "react-redux";
import AccountButton from "./AccountButton";
import CompanyIcon from "../icons/CompanyIcon";
import { useEffect } from "react";
import { getHoldings, setTotalValues } from "../Util/Global";
import { Account, Holding } from "../types/Types";
import { addHoldings } from "../actions/holdings";
import { AccountTypeModalContent } from "./Modal/AccountTypeModalContent";

type Props = {
    isDark: boolean
}

export default function Portfolio({ isDark }: Props) {

    const dispatch = useDispatch();

    // @ts-ignore
    const accounts = useSelector(state => state.rootReducer.accounts.accounts);

    // @ts-ignore
    const holdings = useSelector(state => state.rootReducer.holdings.holdings);

    useEffect(() => {
        if (holdings.length === 0) {
            accounts.forEach((account: Account) => {
                Promise.all(setTotalValues(account, getHoldings(account.transactions, account))).then(newHoldings => {
                    dispatch(addHoldings(newHoldings.filter(elem => elem.value >= 1), account.key))
                })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <div className="flex flex-col space-y-4">
                <AccountButton isEdit={false}>
                    <AccountTypeModalContent isEdit={false} />
                </AccountButton>
                {accounts.length > 0 ?
                    <div>
                        {
                            accounts.toSorted((a: Account, b: Account) => a.name.localeCompare(b.name)).map((account: Account) => {
                                return (
                                    <div key={account.key}>
                                        <Accordion
                                            isCompact
                                            variant="light"
                                        >
                                            <AccordionItem
                                                aria-label="Accordion"
                                                title={account.name}
                                                startContent={
                                                    <Avatar isBordered showFallback radius="full" size="md" src={`https://logo.uplead.com/${account.name.toLowerCase()}.no`} fallback={<CompanyIcon />} />
                                                }
                                                className="sm:mb-4"
                                                subtitle={
                                                    <div className="max-w-full flex flex-row justify-between">
                                                        <div className="flex flex-col">
                                                            <p>{account.type}</p>
                                                            <div>
                                                                <p className="text-default-800 font-bold">
                                                                    <Skeleton
                                                                        className="rounded-lg"
                                                                        isLoaded={
                                                                            holdings
                                                                                .filter((totalValue: Holding) => totalValue.accountKey === account.key)
                                                                                .reduce((sum: number, item: Holding) => sum + item.value, 0) > 0
                                                                        }>
                                                                        {
                                                                            holdings.filter((totalValue: Holding) => totalValue.accountKey === account.key).reduce((sum: number, item: Holding) => sum + item.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                                                        }
                                                                    </Skeleton>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <TransactionsTable account={account} isDark={isDark}>
                                                    <div className="max-w-full flex flex-wrap border-t border-default-300">
                                                        {
                                                            holdings.map((holding: Holding) => {
                                                                if (holding.accountKey === account.key) {
                                                                    if (holding.value < 1) {
                                                                        return ''
                                                                    }
                                                                    return (
                                                                        <div key={holding.name} className="p-1 w-1/3">
                                                                            <p className="text-default-600">{holding.name}</p>
                                                                            <Skeleton className="rounded-lg" isLoaded={holding.value > 0}><p className="text-default-800 font-bold">{holding.value && holding.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p></Skeleton>
                                                                        </div>
                                                                    )
                                                                }
                                                                return <></>
                                                            })
                                                        }
                                                    </div>
                                                </TransactionsTable>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
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
