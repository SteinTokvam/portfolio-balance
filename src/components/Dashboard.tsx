import React from "react";
import { Spacer, useDisclosure, Button, Divider, Skeleton } from "@nextui-org/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux"

import EmptyModal from "./Modal/EmptyModal";
import ChangeGoalPercentageModalContent from "./Modal/ChangeGoalPercentageModalContent";
import { Account, EquityType, Holding, Transaction } from "../types/Types";
import { addHoldings, deleteAllHoldings } from "../actions/holdings";
import { getHoldings } from "../Util/Global";
import { fetchFiriTransactions } from "../Util/Firi";
import { importTransactions } from "../actions/accounts";
import { fetchKronTransactions } from "../Util/Kron";
import { SupabaseClient } from "@supabase/supabase-js";
import HideNumbersSwitch from "./HideNumbersSwitch";

export default function Dashboard({ supabase }: { supabase: SupabaseClient }) {

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
    // @ts-ignore
    const settings = useSelector(state => state.rootReducer.settings)

    const biggestInvestment = holdings.length !== 0 && holdings.reduce((a: Holding, b: Holding) => {
        return a.value > b.value ? a : b
    }, holdings[0])

    const furthestFromGoal = equityTypes.map((equityType: EquityType) => {
        return {
            currentPercentage: parseFloat((holdings
                .filter((holding: Holding) => holding.equityType === equityType.key)
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

    useEffect(() => {
        if (!accounts) {
            return
        }
        accounts.forEach((account: Account) => {
            getHoldings(account)
                .then(holdings => {
                    if (holdings.length === 0) {
                        return
                    }
                    dispatch(addHoldings(holdings, account.key))
                })
        })
    }, [accounts, dispatch])

    equityTypes.forEach((equityType: EquityType) => {
        console.log(equityType.label)
        console.log(((holdings
            .filter((holding: Holding) => holding.equityType === equityType.key)
            .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)) * 100))
    });

    return (
        <>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true} >
                <ChangeGoalPercentageModalContent />
            </EmptyModal>
            {
                //totalverdi
            }
            <div className="flex flex-col items-center justify-center">
                <Spacer y={10} />
                <h1 className="text-medium text-left font-semibold leading-none text-default-600">{t('dashboard.total')}</h1>
                <Spacer y={2} />
                <h2 className="text-large text-left font-bold leading-none text-default-400">
                    {
                        settings.hideNumbers ? '*** Kr' : 
                        holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                    }</h2>
                <Spacer y={20} />
            </div>

            <div className="flex flex-col items-center">
                <Button
                    color="primary"
                    onPress={onOpen}
                    className="w-3/4 sm:w-1/4"
                >
                    {t('dashboard.updateGoalPercentage')}
                </Button>
                <Spacer y={2} />
                <Button
                    className="w-3/4 sm:w-1/4"
                    onClick={() => {
                        dispatch(deleteAllHoldings())
                        if (!accounts) {
                            return
                        }
                        accounts.forEach((account: Account) => {
                            getHoldings(account)
                                .then(holdings => {
                                    if (holdings.length === 0) {
                                        return
                                    }
                                    dispatch(addHoldings(holdings, account.key))
                                })

                            if (account.name === 'Kron') {
                                fetchKronTransactions(account)
                                    .then((transactions: Transaction[]) => {
                                        dispatch(importTransactions(supabase, account, transactions))
                                    })
                            } else if (account.name === 'Firi') {
                                fetchFiriTransactions(account, ['NOK'])
                                    .then((transactions: Transaction[]) => {
                                        dispatch(importTransactions(supabase, account, transactions))
                                    })
                            }
                        })
                    }}>Oppdater</Button>
                    <Spacer y={2} />
                    <HideNumbersSwitch />
            </div>

            <Spacer y={4} />
            <div className="p-4">
                <div className="grid grid-cols-2 gap-20 content-evenly">
                    {accounts && accounts.length > 0 ?
                        equityTypes.map((equityType: EquityType) => {
                            return (
                                <div key={equityType.key} className="sm:text-center sm:justify-center">
                                    <h2 className="text-medium font-semibold leading-none text-default-600">{t(`equityTypes.${equityType.key.toLowerCase()}`)}</h2>
                                    <Spacer y={2} />
                                    <Skeleton className="rounded-lg" isLoaded={
                                        holdings
                                            .filter((holding: Holding) => holding.equityType === equityType.key)
                                            .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) > 0
                                    }>
                                        <h4 className="text-large font-bold leading-none text-default-400">{//verdien
                                            settings.hideNumbers ? '*** Kr' : holdings
                                                .filter((holding: Holding) => holding.equityType === equityType.key)
                                                .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                        }</h4>
                                    </Skeleton>
                                    <Skeleton className="rounded-lg" isLoaded={
                                        holdings
                                            .filter((holding: Holding) => holding.equityType === equityType.key)
                                            .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) > 0}>
                                        <h4
                                            className="text-large font-bold leading-none text-default-400"
                                        ><span className={
                                            Math.abs(((holdings
                                                .filter((holding: Holding) => holding.equityType === equityType.key)
                                                .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)) * 100) - equityType.goalPercentage) >= 3 ?
                                                'text-red-500' : 'text-green-500'}>
                                                {//andel i prosent av total
                                                    ((holdings
                                                        .filter((holding: Holding) => holding.equityType === equityType.key)
                                                        .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)) * 100).toFixed(2)
                                                }%</span> / {equityType.goalPercentage}%</h4>
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
                        <h4 className="text-large font-bold leading-none text-default-400">{settings.hideNumbers ? '*** Kr' : biggestInvestment.value ? biggestInvestment.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) : 0}</h4>
                    </div>
                </div>
            }


            {
                //Furthest and closest to goal
            }
            <Spacer y={4} />
            {
                accounts && accounts.length > 0 ?
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
            }
        </>
    )
}