import { Select, SelectItem, Spacer, useDisclosure, Button, Divider } from "@nextui-org/react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { getHoldings, setTotalValues } from "../Util/Global";
import EmptyModal from "./Modal/EmptyModal";
import ChangeGoalPercentageModalContent from "./Modal/ChangeGoalPercentageModalContent";

export default function Dashboard() {

    const { t } = useTranslation();
    const accounts = useSelector(state => state.rootReducer.accounts.accounts)
    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)
    const [totalValue, setTotalValue] = useState([]);
    const biggestInvestment = totalValue.length !== 0 && totalValue.reduce((a, b) => a.value > b.value ? a : b)
    const furthestFromGoal = equityTypes.map(equityType => {
        return {
            currentPercentage: parseFloat((totalValue
                .filter(holding => holding.type === equityType.key)
                .reduce((acc, cur) => cur.value ? acc + cur.value : 0, 0) / totalValue.reduce((a, b) => b.value ? a + b.value : 0, 0) * 100).toFixed(2)),
            equityType
        }
    }).map(furthest => {
        return {
            ...furthest,
            distanceFromGoalPercentage: furthest.equityType.goalPercentage - furthest.currentPercentage
        }
    }).sort((a, b) => {
        if (a.distanceFromGoalPercentage < b.distanceFromGoalPercentage) {
            return 1
        } else if (a.distanceFromGoalPercentage > b.distanceFromGoalPercentage) {
            return -1
        }
        return 0
    })

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    const filters = ["Konto", "Investeringstype"]
    const [selectedKeys, setSelectedKeys] = useState([filters[1]]);
    const selectedFilter = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const hasLoadedBefore = useRef(true)
    useEffect(() => {
        if (hasLoadedBefore.current) {
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
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true} >
                <ChangeGoalPercentageModalContent />
            </EmptyModal>
            <div className="flex flex-col items-center justify-center">
                <Spacer y={10} />
                <h1 className="text-medium text-left font-semibold leading-none text-default-600">{t('dashboard.total')}</h1>
                <Spacer y={2} />
                <h2 className="text-large text-left font-bold leading-none text-default-400">{totalValue.reduce((a, b) => b.value ? a + b.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h2>
                <Spacer y={20} />
            </div>
            <div className="flex flex-col items-center">
                <Select
                    selectionMode="single"
                    label="Filtrer"
                    className="w-3/4 mb-4 sm:w-1/4"
                    onSelectionChange={setSelectedKeys}
                    selectedKeys={selectedKeys}
                >
                    {filters.map((filter) => (
                        <SelectItem key={filter} value={filter}>
                            {filter}
                        </SelectItem>
                    ))}
                </Select>
                {
                    selectedFilter === filters[1] ? <Button
                        color="primary"
                        onPress={onOpen}
                        className="w-3/4 sm:w-1/4"
                    >
                        {t('dashboard.updateGoalPercentage')}
                    </Button> :
                        ''
                }
            </div>
            <Spacer y={4} />
            <div className="p-4">
                <div className="grid grid-cols-2 gap-20 content-evenly">
                    {accounts.length > 0 ?
                        selectedFilter === filters[0] ? accounts.map(account => {
                            return (
                                <div key={account.key} className="sm:text-center">
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
                            equityTypes.map(equityType => {
                                return (
                                    <div key={equityType.key} className="sm:text-center">
                                        <h2 className="text-medium font-semibold leading-none text-default-600">{t(`equityTypes.${equityType.key.toLowerCase()}`)}</h2>
                                        <Spacer y={2} />
                                        <h4 className="text-large font-bold leading-none text-default-400">{
                                            totalValue
                                                .filter(holding => holding.type === equityType.key)
                                                .reduce((acc, cur) => cur.value ? acc + cur.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                        }</h4>
                                        <h4 className="text-large font-bold leading-none text-default-400">{
                                            ((totalValue
                                                .filter(holding => holding.type === equityType.key)
                                                .reduce((acc, cur) => cur.value ? acc + cur.value : 0, 0) / totalValue.reduce((a, b) => b.value ? a + b.value : 0, 0)) * 100).toFixed(2)
                                        }% / {equityType.goalPercentage}%</h4>
                                    </div>)
                            })
                        : <h4 className="text-large font-bold leading-none">Du har ingen kontoer</h4>
                    }
                </div>
            </div>

            {
                biggestInvestment &&
                <div className="full mx-auto flex justify-center">
                    <div>
                        <Spacer y={20} />
                        <h1 className="text-medium font-semibold leading-none text-default-600">{t('dashboard.biggestInvestment')}</h1>
                        <Spacer y={2} />
                        <h2 className="text-large font-bold leading-none text-default-400">{biggestInvestment.name}</h2>
                        <h4 className="text-large font-bold leading-none text-default-400">{biggestInvestment.value ? biggestInvestment.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) : 0}</h4>
                    </div>
                </div>
            }

            <Spacer y={4} />
            {
                selectedFilter === filters[1] ?
                    <div className="w-full flex flex-col justify-center">
                        <Divider />

                        <div className="flex flex-col gap-20 sm:grid sm:grid-cols-2 sm:gap-8 sm:justify-between sm:p-4" >
                            <h4 className="text-large leading-none text-default-600">
                                {
                                    t('dashboard.investmentToFocus',
                                        {
                                            bullet: '\u{2022}',
                                            equityType: t(`equityTypes.${furthestFromGoal[0].equityType.key.toLowerCase()}`),
                                            distanceFromGoalPercentage: furthestFromGoal[0].distanceFromGoalPercentage.toFixed(2)
                                        }
                                    )
                                }
                            </h4>

                            <h4 className="text-large leading-none text-default-600">
                                {
                                    t('dashboard.investmentOverbought',
                                        {
                                            bullet: '\u{2022}',
                                            equityType: t(`equityTypes.${furthestFromGoal[furthestFromGoal.length - 1].equityType.key.toLowerCase()}`),
                                            distanceFromGoalPercentage: Math.abs(furthestFromGoal[furthestFromGoal.length - 1].distanceFromGoalPercentage).toFixed(2)
                                        }
                                    )
                                }
                            </h4>
                        </div>
                    </div>
                    : ''
            }
        </>
    )
}