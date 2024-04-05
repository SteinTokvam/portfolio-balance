import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import TransactionsTable from "./TransactionsTable";
import { useSelector } from "react-redux";
import AddAccountButton from "./AddAccountButton";
import CompanyIcon from "../icons/CompanyIcon";
import { useEffect, useState } from "react";
import { getHoldings, setTotalValues } from "../Util/Global";



export default function Portfolio() {

    const accounts = useSelector(state => state.rootReducer.accounts.accounts);

    const [totalValue, setTotalValue] = useState([]);

    useEffect(() => {
        accounts.forEach(account => {//tror noe timing greier gjør at jeg ikke får inn mer enn en holding av gangen.. kanskje neste konto nullstiller igjen så en bare har sen som den ble ferdig med til slutt?
            setTotalValues(account, getHoldings(account.transactions, account), setTotalValue)
            //setTotalValues(account.type, getHoldings(account.transactions, account))
        })
    }, [accounts])

    /*function setTotalValues(accountType, holdings) {
        if (!holdings || holdings.length === 0) {
            console.log("no holdings")
            setTotalValue(prevState => [...prevState, 0])
            return
        }

        if (accountType === 'Kryptovaluta') {
            holdings.forEach(holding => {
                setTotalValue(prevState => {
                    if (prevState.length === 0) {
                        return [{ name: holding.name, value: holding.fiatValue, accountKey: holding.accountKey }]
                    }
                    if (prevState.filter(item => item.name === holding.name).length === 0) {
                        return [...prevState, { name: holding.name, value: holding.fiatValue, accountKey: holding.accountKey }]
                    }
                    return [{ name: holding.name, value: holding.fiatValue, accountKey: holding.accountKey }]
                })
            })
        }
        if(accountType === 'Obligasjon') {
            holdings.forEach(holding => {
                setTotalValue(prevState => {
                    if (prevState.length === 0) {
                        return [{ name: holding.name, value: holding.value, accountKey: holding.accountKey }]
                    }
                    if (prevState.filter(item => item.name === holding.name).length === 0) {
                        return [...prevState, { name: holding.name, value: holding.value, accountKey: holding.accountKey }]
                    }
                    return [{ name: holding.name, value: holding.value, accountKey: holding.accountKey }]
                })
            })
        } else {
            holdings.forEach(holding => fetchTicker(holding.e24Key, "OSE", holding.equityType, "1months").then(res => res)
                .then(prices => prices[prices.length - 1])
                .then(price => setTotalValue(prevState => {
                    if (price === undefined || price.length === 0 || price.date === undefined || price.date === "") {
                        return prevState
                    }
                    //Has no investment of that name on that account
                    if (prevState.filter(item => item.name === holding.name && item.accountKey === holding.accountKey).length === 0) {
                        return [...prevState, { name: holding.name, value: price.value * holding.equityShare, accountKey: holding.accountKey }]
                    }
                    //has no investment before
                    if (prevState.length === 0) {
                        return [{ name: holding.name, value: price.value * holding.equityShare, accountKey: holding.accountKey }]
                    }
                    return prevState
                })))
        }
    }*/

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
                                        <Accordion >
                                            <AccordionItem aria-label="Accordion"
                                                title={account.name}
                                                startContent={
                                                    <Avatar isBordered showFallback radius="full" size="md" src={`https://logo.uplead.com/${account.name.toLowerCase()}.no`} fallback={<CompanyIcon />} />
                                                }
                                                className="border border-default-300 rounded-3xl p-4 mb-4"
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
                                                <TransactionsTable account={account}>
                                                    <div className="max-w-full flex flex-wrap border-t border-default-300">
                                                        {
                                                            /*!account.isManual ?
                                                                account.holdings.map(holding => {
                                                                    return (
                                                                        <div key={holding.name} className="p-1 w-1/3">
                                                                            <p>{holding.name}</p>
                                                                            <p>{holding.fiatValue !== undefined ? holding.fiatValue.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) : (0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p>
                                                                        </div>
                                                                    )
                                                                }) :*/
                                                                totalValue.map(totalValue => {
                                                                    if (totalValue.accountKey === account.key) {
                                                                        
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
