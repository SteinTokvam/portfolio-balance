import { Select, SelectItem, Spacer } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { fetchTicker } from "../Util/E24";
import { equityTypes, getHoldings } from "../Util/Global";
import { getValueInFiat } from "../Util/Firi";

export default function Dashboard() {

    const { t } = useTranslation();
    const accounts = useSelector(state => state.rootReducer.accounts.accounts)
    const [totalValue, setTotalValue] = useState([]);
    const biggestInvestment = totalValue.length !== 0 && totalValue.reduce((a, b) => a.value > b.value ? a : b)


    const filters = ["Konto", "Investeringstype"]
    const [selectedKeys, setSelectedKeys] = useState([filters[0]]);
    const selectedFilter = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    useEffect(() => {
        accounts.forEach(account => {
            setTotalValues(selectedFilter, account.type, account, getHoldings(account.transactions, account))
        })
    }, [accounts, selectedFilter])


    function setTotalValues(filter, accountType, account, holdings) {//Denne er kopiert fra Portfolio. burde sette ting i global state, så koden er på en plass. alternativt flytte ut metoden en plass og få den til å returnere hele state
        if (!holdings || holdings.length === 0) {
            console.log("no holdings")
            setTotalValue(prevState => [...prevState, 0])
            return
        }

        if (accountType === 'Kryptovaluta') {
            holdings.forEach(holding => {
                getValueInFiat([holding.name], account.apiInfo.accessKey)
                    .then(cryptoPrice => {
                        const last = parseFloat(cryptoPrice[0].last) * holding.equityShare
                        setTotalValue(prevState => {
                            if (prevState.length === 0) {
                                return [{ name: holding.name, value: parseFloat(last), accountKey: holding.accountKey, type: holding.equityType }]
                            }
                            if (prevState.filter(item => item.name === holding.name && item.accountKey === holding.accountKey).length === 0) {
                                return [...prevState, { name: holding.name, value: parseFloat(last), accountKey: holding.accountKey, type: holding.equityType }]
                            }
                            return [{ name: holding.name, value: parseFloat(last), accountKey: holding.accountKey, type: holding.equityType }]
                        })
                    })
            })
        } if (accountType === 'Obligasjon') {
            holdings.forEach(holding => {
                setTotalValue(prevState => {
                    if (prevState.length === 0) {
                        return [{ name: holding.name, value: holding.value, accountKey: holding.accountKey, type: holding.equityType }]
                    }
                    if (prevState.filter(item => item.name === holding.name).length === 0) {
                        return [...prevState, { name: holding.name, value: holding.value, accountKey: holding.accountKey, type: holding.equityType }]
                    }
                    return [{ name: holding.name, value: holding.value, accountKey: holding.accountKey, type: holding.equityType }]
                })
            })
        } else {
            holdings.forEach(holding => fetchTicker(holding.e24Key, "OSE", holding.equityType, "1months").then(res => res)
                .then(prices => prices[prices.length - 1])
                .then(price => setTotalValue(prevState => {
                    if (price === undefined || price.length === 0 || price.date === undefined || price.date === "") {
                        return prevState
                    }
                    if (prevState.filter(item => item.name === holding.name && item.accountKey === holding.accountKey).length === 0) {
                        return [...prevState, { name: holding.name, value: price.value * holding.equityShare, accountKey: holding.accountKey, type: holding.equityType }]
                    }
                    if (prevState.length === 0) {
                        return [{ name: holding.name, value: price.value * holding.equityShare, accountKey: holding.accountKey, type: holding.equityType }]
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
                <h2 className="text-large text-left font-bold leading-none text-default-400">{totalValue.reduce((a, b) => b.value ? a + b.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h2>
                <Spacer y={20} />
            </div >
            <Select
                selectionMode="single"
                label="Filtrer"
                className="max-w-xs"
                onSelectionChange={setSelectedKeys}
                selectedKeys={selectedKeys}
            >
                {filters.map((filter) => (
                    <SelectItem key={filter} value={filter}>
                        {filter}
                    </SelectItem>
                ))}
            </Select>
            <Spacer y={4} />
            <div className="w-full text-center flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-20 justify-between">
                    {accounts.length > 0 ?
                        selectedFilter === filters[0] ? accounts.map(account => {
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
                                    <h4 className="text-large font-bold leading-none text-default-400">{
                                        ((totalValue
                                            .filter(holding => holding.accountKey === account.key)
                                            .reduce((acc, cur) => cur.value ? acc + cur.value : 0, 0) / totalValue.reduce((a, b) => b.value ? a + b.value : 0, 0)) * 100).toFixed(2)
                                    }%</h4>
                                </div>)
                        }) :
                            equityTypes.map(equityType => {
                                return (
                                    <div key={equityType}>
                                        <h2 className="text-medium font-semibold leading-none text-default-600">{equityType}</h2>
                                        <Spacer y={2} />
                                        <h4 className="text-large font-bold leading-none text-default-400">{
                                            totalValue
                                                .filter(holding => holding.type === equityType)
                                                .reduce((acc, cur) => cur.value ? acc + cur.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                        }</h4>
                                        <h4 className="text-large font-bold leading-none text-default-400">{
                                            ((totalValue
                                                .filter(holding => holding.type === equityType)
                                                .reduce((acc, cur) => cur.value ? acc + cur.value : 0, 0) / totalValue.reduce((a, b) => b.value ? a + b.value : 0, 0)) * 100).toFixed(2)
                                        }%</h4>
                                    </div>)
                            })
                        : <h4 className="text-large font-bold leading-none">Du har ingen kontoer</h4>
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
                    <h4 className="text-large font-bold leading-none text-default-400">{biggestInvestment.value ? biggestInvestment.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) : 0}</h4>
                </div>
            }
        </>
    )
}