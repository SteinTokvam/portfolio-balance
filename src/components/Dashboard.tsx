import React from "react";
import { Spacer, useDisclosure, Button } from "@nextui-org/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux"

import EmptyModal from "./Modal/EmptyModal";
import ChangeGoalPercentageModalContent from "./Modal/ChangeGoalPercentageModalContent";
import { Account, Holding, Transaction } from "../types/Types";
import { addHoldings, deleteAllHoldings } from "../actions/holdings";
import { getHoldings, styles, useDb } from "../Util/Global";
import { fetchFiriTransactions } from "../Util/Firi";
import { deleteAllAccounts, importTransactions, initSupabaseData } from "../actions/accounts";
import { fetchKronTransactions } from "../Util/Kron";
import { SupabaseClient } from "@supabase/supabase-js";
import HideNumbersSwitch from "./HideNumbersSwitch";
import { getAccounts, getTransactions } from "../Util/Supabase";
import GoalAnalysis from "./GoalAnalysis";
import EquityTypesView from "./EquityTypesView";

export default function Dashboard({ supabase }: { supabase: SupabaseClient }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accounts = useSelector((state: any) => state.rootReducer.accounts.accounts)
    const holdings = useSelector((state: any) => state.rootReducer.holdings.holdings)
    const settings = useSelector((state: any) => state.rootReducer.settings)
    const totalValue: number = holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)
    const biggestInvestment = holdings.length !== 0 && holdings.reduce((a: Holding, b: Holding) => {
        return a.value > b.value ? a : b
    }, holdings[0])

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

    function getAccountsAndHoldings(account: Account) {
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
    }

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
                <h1 className={styles.valueHeaderText}>{t('dashboard.total')}</h1>
                <Spacer y={2} />
                <h2 className={styles.valueText}>
                    {
                        settings.hideNumbers ? '*** Kr' :
                            totalValue.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                    }
                </h2>
                <Spacer y={2} />
                <h1 className={styles.valueHeaderText}>Avkastning</h1>
                <Spacer y={2} />
                <h2 className={styles.valueText}>
                    {
                        settings.hideNumbers ? '*** Kr' :
                            holdings.filter((holding: Holding) => holding.yield).reduce((a: number, b: Holding) => b.yield ? a + b.yield : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                    }
                </h2>
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
                        dispatch(deleteAllAccounts(supabase, false))
                        if (!accounts) {
                            return
                        }
                        if (useDb) {
                            getAccounts(supabase)
                                .then(accounts => {
                                    accounts.forEach(account => {
                                        getTransactions(supabase, account.key)
                                            .then(transactions => {
                                                dispatch(initSupabaseData({ ...account, transactions }))
                                                getAccountsAndHoldings({ ...account, transactions })
                                            })

                                        
                                    });
                                })
                        } else {
                            accounts.forEach((account: Account) => {
                                getAccountsAndHoldings(account)
                            })
                        }


                    }}>Oppdater</Button>
                <Spacer y={2} />
                <HideNumbersSwitch />
            </div>

            <Spacer y={4} />
            <EquityTypesView totalValue={totalValue} />

            {
                biggestInvestment &&
                <div className="full mx-auto flex justify-center">
                    <div>
                        <Spacer y={20} />
                        <h1 className={styles.valueHeaderText}>{t('dashboard.biggestInvestment')}</h1>
                        <Spacer y={2} />
                        <h2 className={styles.valueText}>{biggestInvestment.name}</h2>
                        <h4 className={styles.valueText}>{settings.hideNumbers ? '*** Kr' : biggestInvestment.value ? biggestInvestment.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) : 0}</h4>
                    </div>
                </div>
            }

            <Spacer y={4} />
            <GoalAnalysis />
        </>
    )
}