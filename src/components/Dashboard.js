import { Select, SelectItem, Spacer } from "@nextui-org/react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { equityTypes, getHoldings, setTotalValues } from "../Util/Global";

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

    const hasLoadedBefore = useRef(true)
    useEffect(() => {
        if(hasLoadedBefore.current) {
            accounts.forEach(account => {
                Promise.all(setTotalValues(account, getHoldings(account.transactions, account))).then(newHoldings => {
                    const mergedWithTotalValue = [...totalValue, ...newHoldings]
                    const removeDuplicates = mergedWithTotalValue.filter((value, index) => mergedWithTotalValue.indexOf(value) === index)
                    setTotalValue(prevState => {
                        return [...prevState, ...removeDuplicates]
                    })
                })
            })
            hasLoadedBefore.current = false
        }
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

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
                                            account.holdings.reduce((sum, item) => sum + item.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) :
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
                            equityTypes.map((equityType, index) => {
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
                                        }% / {equityGoalPercentage[index]}%</h4>
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