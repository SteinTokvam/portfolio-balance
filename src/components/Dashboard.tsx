import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { SupabaseClient } from "@supabase/supabase-js"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardBody, CardHeader, Button, Switch, Progress, useDisclosure, Spacer } from "@nextui-org/react"

import { Account, EquityType, Holding, KronDevelopment, State, Transaction, TransactionType } from "../types/Types"
import { addHoldings, deleteAllHoldings } from "../actions/holdings"
import { getHoldings, useDb } from "../Util/Global"
import { fetchFiriTransactions } from "../Util/Firi"
import { deleteAllAccounts, importTransactions, initSupabaseData } from "../actions/accounts"
import { fetchKronDevelopment, fetchKronTransactions } from "../Util/Kron"
import { getAccounts, getTransactions } from "../Util/Supabase"
import { toggleHideNumbers } from "../actions/settings"
import GoalAnalysis from "./GoalAnalysis"
import EmptyModal from "./Modal/EmptyModal"
import ChangeGoalPercentageModalContent from "./Modal/ChangeGoalPercentageModalContent"

export default function Dashboard({ supabase }: { supabase: SupabaseClient }) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const accounts = useSelector((state: State) => state.rootReducer.accounts.accounts)
    const holdings: Holding[] = useSelector((state: State) => state.rootReducer.holdings.holdings).filter((holding: Holding) => holding.value > 0.001)
    const settings = useSelector((state: State) => state.rootReducer.settings)
    const totalValue: number = holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)
    const totalYield: number = holdings.filter((holding: Holding) => holding.yield).reduce((a: number, b: Holding) => b.yield ? a + b.yield : 0, 0)
    const [development, setDevelopment] = useState<KronDevelopment[]>([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const equityTypes = useSelector((state: State) => state.rootReducer.equity.equityTypes)

    useEffect(() => {
        if (!accounts) return
        getAccounts(supabase)
            .then(accounts => {
                accounts.forEach(account => {
                    getTransactions(supabase, account.key)
                        .then(transactions => dispatch(initSupabaseData({ ...account, transactions })))
                });
            })
        accounts.forEach((account: Account) => {
            if (account.name === 'Kron') {
                fetchKronDevelopment(account)
                    .then((development: KronDevelopment[]) => setDevelopment(development))
            }
            getHoldings(account)
                .then(holdings => {
                    if (holdings.length === 0) return
                    dispatch(addHoldings(holdings, account.key))
                })
        })
    }, [accounts, dispatch])

    function getAccountsAndHoldings(account: Account) {
        getHoldings(account)
            .then(holdings => {
                if (holdings.length === 0) return
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

    const updateData = () => {
        dispatch(deleteAllHoldings())
        dispatch(deleteAllAccounts(supabase, false))
        if (!accounts) return
        if (useDb) {
            getAccounts(supabase)
                .then(accounts => {
                    accounts.forEach(account => {
                        getTransactions(supabase, account.key)
                            .then(transactions => {
                                dispatch(initSupabaseData({ ...account, transactions }))
                                getAccountsAndHoldings({ ...account, transactions })
                            })
                    })
                })
        } else {
            accounts.forEach((account: Account) => {
                getAccountsAndHoldings(account)
            })
        }
    }

    const equityTypeData = holdings.reduce((acc: any[], holding: Holding) => {
        const existingType = acc.find(item => item.name === t(`equityTypes.${holding.equityType.toLowerCase()}`))
        if (existingType) {
            existingType.value += holding.value
        } else {
            acc.push({ name: t(`equityTypes.${holding.equityType.toLowerCase()}`), equityType: holding.equityType, value: holding.value })
        }
        return acc
    }, [])

    const accountData = accounts.map((account: Account) => {
        const accountValue = holdings.filter((holding: Holding) => holding.accountKey === account.key).reduce((a: number, b: Holding) => a + b.value, 0)
        var yieldForAccount = "0"
        if (account.name === "FundingPartner") {
            yieldForAccount = account.transactions.filter((transaction: Transaction) => transaction.type === TransactionType.YIELD).reduce((a: number, b: Transaction) => a + b.cost, 0).toFixed(0)
        } else if (account.name === "Kron") {
            yieldForAccount = development && development.length > 0 ? development[development.length - 1].yield_in_currency.toFixed(0) : "0"
        } else if (account.name === "Bare Bitcoin") {
            yieldForAccount = holdings.filter((holding: Holding) => holding.accountKey === account.key).reduce((a: number, b: Holding) => a + b.yield, 0).toFixed(0)
        } else {
            yieldForAccount = (accountValue - account.transactions.reduce((a: number, b: Transaction) => a + b.cost, 0)).toFixed(0)
        }
        return {
            name: account.name,
            value: accountValue.toFixed(0),
            yield: yieldForAccount,

        }
    }).sort((a: any, b: any) => b.name - a.name)

    function getHoldingCard() {
        const tmpHoldings = [...holdings]
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {
                    tmpHoldings
                        .sort((a: Holding, b: Holding) => b.value - a.value)
                        .map((holding: Holding) => (
                            <div>
                                <h3 className="text-xl font-semibold">{holding.name}</h3>
                                <p className="text-lg">
                                    {settings.hideNumbers ? '*** Kr' : holding.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })} ({t(`equityTypes.${holding.equityType.toLowerCase()}`)} - {accounts.filter((account: Account) => account.key === holding.accountKey)[0].name})
                                </p>
                                <p className={`text-md ${holding.yield >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    ({settings.hideNumbers ? '*** Kr' : holding.yield.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })})
                                </p>
                                <Progress
                                    value={(holding.value / totalValue) * 100}
                                    color="primary"
                                    className="mt-2"
                                />
                            </div>
                        ))
                }
            </div>
        )
    }

    return (
        <div className="mx-auto p-4">
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true} >
                <ChangeGoalPercentageModalContent />
            </EmptyModal>
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t('dashboard.total')}</h2>
                    </CardHeader>
                    <CardBody>
                        <h3 className="text-3xl font-bold">
                            {settings.hideNumbers ? '*** Kr' : totalValue.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                        </h3>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t('dashboard.yield')}</h2>
                    </CardHeader>
                    <CardBody>
                        <h3 className="text-3xl font-bold">
                            {settings.hideNumbers ? '*** Kr' : totalYield.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                        </h3>
                    </CardBody>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t('dashboard.equityDistribution')}</h2>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={equityTypeData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    paddingAngle={3}
                                    innerRadius={40}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label={({ equityType, percent }) => `${(percent * 100).toFixed(1)}% / ${equityTypes.filter((equityTypeElem: EquityType) => equityTypeElem.key === equityType)[0].goalPercentage}%`}
                                >
                                    {equityTypeData.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t('dashboard.accountPerformance')}</h2>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={accountData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" name={t('dashboard.total')} />
                                <Bar dataKey="yield" fill="#82ca9d" name={t('dashboard.yield')} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-4">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t('dashboard.holdings')}</h2>
                    </CardHeader>
                    <CardBody>
                        {
                            getHoldingCard()
                        }
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{t('dashboard.analysis')}</h2>
                    </CardHeader>
                    <CardBody>
                        <GoalAnalysis />
                    </CardBody>
                </Card>
            </div>
            <div className="mt-4 flex flex-col items-center">
                <Button color="primary" onPress={updateData} className="mb-2">
                    {t('dashboard.update')}
                </Button>
                <Button
                    color="primary"
                    onPress={onOpen}
                >
                    {t('dashboard.updateGoalPercentage')}
                </Button>
                <Spacer y={2} />
                <Switch
                    checked={settings.hideNumbers}
                    onChange={() => dispatch(toggleHideNumbers(!settings.hideNumbers))}
                >
                    {t('dashboard.hideNumbers')}
                </Switch>
            </div>
        </div>
    )
}