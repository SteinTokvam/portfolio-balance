import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import TransactionsTable from "./TransactionsTable";
import { useSelector } from "react-redux";
import AddAccountButton from "./AddAccountButton";
import CompanyIcon from "../icons/CompanyIcon";
import { useEffect, useState, useRef } from "react";
import { getHoldings, setTotalValues } from "../Util/Global";



export default function Portfolio({ isDark }) {

    const accounts = useSelector(state => state.rootReducer.accounts.accounts);

    const [totalValue, setTotalValue] = useState([]);//TODO: dette burde vært en reducer?

    const hasLoadedBefore = useRef(true)
    useEffect(() => {
        if (hasLoadedBefore.current) {
            accounts.forEach(account => {
                Promise.all(setTotalValues(account, getHoldings(account.transactions, account))).then(newHoldings => {
                    const mergedWithTotalValue = [...totalValue, ...newHoldings]
                    setTotalValue(prevState => {
                        return [...prevState, ...mergedWithTotalValue]
                    })
                })
            })
            hasLoadedBefore.current = false
        }
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className="flex flex-col space-y-4">
                <AddAccountButton />
                {accounts.length > 0 ?
                    <div>
                        {
                            accounts.map((account) => {
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
                                                                    {
                                                                        totalValue.filter(totalValue => totalValue.accountKey === account.key).reduce((sum, item) => sum + item.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <TransactionsTable account={account} isDark={isDark}>
                                                    <div className="max-w-full flex flex-wrap border-t border-default-300">
                                                        {
                                                            totalValue.map(totalValue => {
                                                                if (totalValue.accountKey === account.key) {
                                                                    if (totalValue.value < 1) {
                                                                        return ''
                                                                    }
                                                                    return (
                                                                        <div key={totalValue.name} className="p-1 w-1/3">
                                                                            <p className="text-default-600">{totalValue.name}</p>
                                                                            <p className="text-default-800 font-bold">{totalValue.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p>
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
