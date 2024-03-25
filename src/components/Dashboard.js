import { Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { fetchTicker } from "../Util/E24";

export default function Dashboard() {

    const { t } = useTranslation();
    const accounts = useSelector(state => state.rootReducer.accounts.accounts)
    const [totalValue, setTotalValue] = useState([]);
    const biggestInvestment = totalValue.length !== 0 && totalValue.reduce((a, b) => a.value > b.value ? a : b)

    useEffect(() => {
        accounts.forEach(account => {
            setTotalValues(account.type, account.holdings)
        })
    }, [accounts])

    function setTotalValues(accountType, holdings) {//Denne er kopiert fra Portfolio. burde sette ting i global state, så koden er på en plass. alternativt flytte ut metoden en plass og få den til å returnere hele state
        if (!holdings || holdings.length === 0) {
            console.log("no holdings")
            setTotalValue(prevState => [...prevState, 0])
            return
        }

        if (accountType === 'Cryptocurrency') {
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
        } else {
            holdings.forEach(holding => fetchTicker(holding.e24Key, "OSE", holding.equityType, "1months").then(res => res)
                .then(prices => prices[prices.length - 1])
                .then(price => setTotalValue(prevState => {
                    if (price.date === "") {
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
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <Spacer y={10} />
                <h1 className="text-medium text-left font-semibold leading-none text-default-600">{t('dashboard.total')}</h1>
                <Spacer y={2} />
                <h2 className="text-large text-left font-bold leading-none text-default-400">{totalValue.reduce((a, b) => a + b.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h2>
                <Spacer y={20} />
            </div >
            <div className="w-full text-center flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-20 justify-between">
                    {
                        accounts.map(account => {
                            return (
                                <div key={account.key}>
                                    <h2 className="text-medium font-semibold leading-none text-default-600">{account.name}</h2>
                                    <Spacer y={2} />
                                    <h4 className="text-large font-bold leading-none text-default-400">{
                                        account.type === 'Cryptocurrency' ?
                                            account.holdings.reduce((sum, item) => sum + item.fiatValue, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) :
                                            totalValue
                                                .filter(holding => holding.accountKey === account.key)
                                                .reduce((acc, cur) => acc + cur.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                    }</h4>
                                </div>)
                        })
                    }
                </div>
            </div>

            {
                biggestInvestment &&
                <div className="full text-center mx-auto flex flex-col justify-center">
                    <Spacer y={20} />
                    <h1 className="text-medium font-semibold leading-none text-default-600">{t('dashboard.biggestInvestment')}</h1>
                    <Spacer y={2} />
                    <h2 className="text-large font-bold leading-none text-default-400">{biggestInvestment.name}</h2>
                    <h4 className="text-large font-bold leading-none text-default-400">{biggestInvestment.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h4>
                </div>
            }
        </>
    )
}