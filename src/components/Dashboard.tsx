import React from "react";
import { Select, SelectItem, Spacer, useDisclosure, Button, Divider, Skeleton } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux"
import { getHoldings, setTotalValues } from "../Util/Global";
import EmptyModal from "./Modal/EmptyModal";
import ChangeGoalPercentageModalContent from "./Modal/ChangeGoalPercentageModalContent";
import { Account, EquityType, Holding } from "../types/Types";
import { addHoldings } from "../actions/holdings";

export default function Dashboard() {

    type FurthestFromGoal = {
        currentPercentage: number,
        equityType: EquityType,
        goalPercentage: number,
        distanceFromGoalPercentage: number
    }

    const { t } = useTranslation();
    const dispatch = useDispatch();
    // @ts-ignore
    const accounts = useSelector(state => state.rootReducer.accounts.accounts)
    // @ts-ignore
    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)
    // @ts-ignore
    const holdings = useSelector(state => state.rootReducer.holdings.holdings)

    const biggestInvestment = holdings.length !== 0 && holdings.reduce((a: Holding, b: Holding) => {
        return a.value > b.value ? a : b
    }, holdings[0])
    const furthestFromGoal = equityTypes.map((equityType: EquityType) => {
        return {
            currentPercentage: parseFloat((holdings
                .filter((holding: Holding) => holding.type === equityType.key)
                .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0) * 100).toFixed(2)),
            equityType
        }
    }).map((furthest: FurthestFromGoal) => {
        return {
            ...furthest,
            distanceFromGoalPercentage: furthest.equityType.goalPercentage - furthest.currentPercentage
        }
    }).sort((a: FurthestFromGoal, b: FurthestFromGoal) => {
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

    useEffect(() => {
        if (holdings.length === 0) {
            accounts.forEach((account: Account) => {
                Promise.all(setTotalValues(account, getHoldings(account.transactions, account))).then(newHoldings => {
                    dispatch(addHoldings(newHoldings.filter(elem => elem.value >= 1)))
                })
            })
        }
    }, [holdings])

    return (
        <>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true} >
                <ChangeGoalPercentageModalContent />
            </EmptyModal>
            <div className="flex flex-col items-center justify-center">
                <Spacer y={10} />
                <h1 className="text-medium text-left font-semibold leading-none text-default-600">{t('dashboard.total')}</h1>
                <Spacer y={2} />
                <h2 className="text-large text-left font-bold leading-none text-default-400">{holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h2>
                <Spacer y={20} />
            </div>
            <div className="flex flex-col items-center">
                <Select
                    selectionMode="single"
                    label="Filtrer"
                    className="w-3/4 mb-4 sm:w-1/4"
                    // @ts-ignore
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
                        selectedFilter === filters[0] ? accounts.map((account: Account) => {
                            return (
                                <div key={account.key} className="sm:text-center">
                                    <h2 className="text-medium font-semibold leading-none text-default-600">{account.name}</h2>
                                    <Spacer y={2} />

                                    <Skeleton
                                        className="rounded-lg"
                                        isLoaded={
                                            account.type === 'Cryptocurrency' ?
                                                account.holdings.reduce((sum: number, item: Holding) => sum + item.value, 0) > 0 :
                                                holdings
                                                    .filter((holding: Holding) => holding.accountKey === account.key)
                                                    .reduce((acc: number, cur: Holding) => acc + cur.value, 0) > 0
                                        }><h4 className="text-large font-bold leading-none text-default-400">{
                                            account.type === 'Cryptocurrency' ?
                                                account.holdings.reduce((sum, item) => sum + item.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) :
                                                holdings
                                                    .filter((holding: Holding) => holding.accountKey === account.key)
                                                    .reduce((acc: number, cur: Holding) => acc + cur.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                        }</h4>
                                    </Skeleton>

                                    <Skeleton
                                        className="rounded-lg"
                                        isLoaded={
                                            account.type === 'Cryptocurrency' ?
                                                account.holdings.reduce((sum: number, item: Holding) => sum + item.value, 0) > 0 :
                                                holdings
                                                    .filter((holding: Holding) => holding.accountKey === account.key)
                                                    .reduce((acc: number, cur: Holding) => acc + cur.value, 0) > 0
                                        }><h4 className="text-large font-bold leading-none text-default-400">{
                                            ((holdings
                                                .filter((holding: Holding) => holding.accountKey === account.key)
                                                .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)) * 100).toFixed(2)
                                        }%</h4>
                                    </Skeleton>
                                </div>
                            )
                        }) :
                            equityTypes.map((equityType: EquityType) => {
                                return (
                                    <div key={equityType.key} className="sm:text-center sm:justify-center">
                                        <h2 className="text-medium font-semibold leading-none text-default-600">{t(`equityTypes.${equityType.key.toLowerCase()}`)}</h2>
                                        <Spacer y={2} />
                                        <Skeleton className="rounded-lg" isLoaded={holdings
                                            .filter((holding: Holding) => holding.type === equityType.key)
                                            .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) > 0}>
                                            <h4 className="text-large font-bold leading-none text-default-400">{
                                                holdings
                                                    .filter((holding: Holding) => holding.type === equityType.key)
                                                    .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                            }</h4>
                                        </Skeleton>
                                        <Skeleton className="rounded-lg" isLoaded={holdings
                                            .filter((holding: Holding) => holding.type === equityType.key)
                                            .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) > 0}>
                                            <h4 className="text-large font-bold leading-none text-default-400">{
                                                ((holdings
                                                    .filter((holding: Holding) => holding.type === equityType.key)
                                                    .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)) * 100).toFixed(2)
                                            }% / {equityType.goalPercentage}%</h4>
                                        </Skeleton>
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
                accounts.length > 0 ?
                    selectedFilter === filters[1] ?
                        <div className="w-full flex flex-col justify-center">
                            <Divider />

                            <div className="flex flex-col gap-20 p-4 sm:grid sm:grid-cols-2 sm:gap-8 sm:justify-between" >
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
                    : ''
            }
        </>
    )
}