import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import TransactionsTable from "./TransactionsTable";
import { useSelector } from "react-redux";
import AddAccountButton from "./AddAccountButton";
import CompanyIcon from "../icons/CompanyIcon";
import { fetchTicker } from "../Util/E24";
import { useEffect, useState } from "react";



export default function Portfolio() {

    const accounts = useSelector(state => state.rootReducer.accounts.accounts);

    const [totalValue, setTotalValue] = useState([]);

    useEffect(() => {
        accounts.forEach(account => setTotalValues(account.holdings))
    }, [])

    function setTotalValues(holdings) {
        if (holdings.length === 0) {
            console.log("no holdings")
            setTotalValue(prevState => [...prevState, 0])
            return
        }

        holdings.forEach(holding => fetchTicker(holding.e24Key, "OSE", holding.equityType, "1months").then(res => res)
            .then(prices => prices[prices.length - 1])
            .then(price => setTotalValue(prevState => {
                if(price.date === "") {
                    return prevState
                }
                if (prevState.filter(item => item.name === holding.name).length === 0) {
                    return [...prevState, { name: holding.name, value: price.value * holding.equityShare, accountKey: holding.accountKey }]
                }
                if (prevState.length === 0) {
                    return [{ name: holding.name, value: price.value * holding.equityShare, accountKey: holding.accountKey }]
                }
                return prevState
            })))
    }

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
                                                className="border border-default-300 rounded-3xl p-4"
                                                subtitle={
                                                    <div>
                                                        <p>{account.type}</p>
                                                        <div className="">
                                                            <div>

                                                                {
                                                                    totalValue.filter(totalValue => totalValue.accountKey === account.key).reduce((sum, item) => sum + item.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                                                }
                                                                <div className="hidden sm:flex border-t border-default-300">
                                                                    {
                                                                        totalValue.map(totalValue => {
                                                                            if (totalValue.accountKey === account.key) {
                                                                                return (
                                                                                    <div key={totalValue.name} className="pr-4">
                                                                                        <p>{totalValue.name}</p>
                                                                                        <p>{totalValue.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <TransactionsTable account={account} />
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