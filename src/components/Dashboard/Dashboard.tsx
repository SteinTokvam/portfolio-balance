import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts'
import { Card, CardBody, CardHeader, Button, Switch, Progress, useDisclosure, Spacer, Spinner } from "@nextui-org/react"
import { Account, EquityType, Holding, State, Transaction, TransactionType, ValueOverTime } from "../../types/Types"
import { addHoldings } from "../../actions/holdings"
import { getAccountsAndHoldings } from "../../Util/Global"
import { resetState, initSupabaseData } from "../../actions/accounts"
import { toggleHideNumbers } from "../../actions/settings"
import GoalAnalysis from "./GoalAnalysis"
import EmptyModal from "../Modal/EmptyModal"
import ChangeGoalPercentageModalContent from "./ChangeGoalPercentageModalContent"
import { fetchKronBalance } from "../../Util/Kron"
import CustomTooltip from "./CustomTooltip"
import { setEquityTypes } from "../../actions/equityType"
import { setTotalValue } from "../../Util/Supabase"
import CustomTooltipYield from "./CustomTooltipYield"

export default function Dashboard() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const accounts = useSelector((state: State) => state.rootReducer.accounts.accounts)
    const holdings: Holding[] = useSelector((state: State) => state.rootReducer.holdings.holdings).filter((holding: Holding) => holding.value > 0.001)
    const settings = useSelector((state: State) => state.rootReducer.settings)
    const totalValue: number = holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)
    const tangem = accounts.filter((account: Account) => account.name === "Tangem")[0]
    const totalYield: number = holdings.filter((holding: Holding) => holding.yield).filter(holding => holding.accountKey !== tangem.key).reduce((a: number, b: Holding) => b.yield ? a + b.yield : 0, 0)
    const [development, setDevelopment] = useState<{ value: number, yield: number }>({ value: 0, yield: 0 })
    const [valueOverTime, setValueOverTime] = useState<ValueOverTime[]>([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const equityTypes = useSelector((state: State) => state.rootReducer.equity.equityTypes)

    useEffect(() => {
        if (!accounts) return
        getAccountsAndHoldings()
            .then(accountsAndHoldings => {
                dispatch(initSupabaseData(accountsAndHoldings.accounts))
                dispatch(addHoldings(accountsAndHoldings.holdings))
                setTotalValue(accountsAndHoldings)
                setValueOverTime(accountsAndHoldings.valueOverTime)
                fetchKronBalance(accountsAndHoldings.accounts.filter((account: Account) => account.name === "Kron")[0])
                    .then(setDevelopment)
            })
    }, [])

    const updateData = () => {
        dispatch(resetState())
        getAccountsAndHoldings()
            .then(accountsAndHoldings => {
                dispatch(initSupabaseData(accountsAndHoldings.accounts))
                dispatch(addHoldings(accountsAndHoldings.holdings))
                dispatch(setEquityTypes(accountsAndHoldings.equityTypes))
            })
    }

    const equityTypeData = holdings.reduce((acc: any[], holding: Holding) => {
        const existingType = acc.find(item => item.equityType.toLowerCase() === holding.equityType.toLowerCase())
        if (existingType) {
            acc[acc.indexOf(existingType)] = { name: existingType.name, equityType: existingType.equityType, totalValue: existingType.totalValue + holding.value }
        } else {
            acc.push({ name: holding.equityType, equityType: holding.equityType, totalValue: holding.value })
        }
        return acc
    }, [])

    const accountData = accounts.map((account: Account) => {
        const accountValue = holdings.filter((holding: Holding) => holding.accountKey === account.key).reduce((a: number, b: Holding) => a + b.value, 0)
        var yieldForAccount = "0"
        if (account.name === "FundingPartner") {
            yieldForAccount = account.transactions
                .filter((transaction: Transaction) => transaction.type === TransactionType.YIELD)
                .reduce((a: number, b: Transaction) => a + b.cost, 0).toFixed(0)
        } else if (account.name === "Kron") {
            yieldForAccount = development.value > 0 ? development.yield.toFixed(0) : "0"
        } else if (account.name === "Bare Bitcoin") {
            yieldForAccount = holdings.filter((holding: Holding) => holding.accountKey === account.key).reduce((a: number, b: Holding) => a + b.yield, 0).toFixed(0)
        } else if (account.name === "Nordnet") {
            yieldForAccount = holdings.filter((holding: Holding) => holding.accountKey === account.key).reduce((a: number, b: Holding) => a + b.yield, 0).toFixed(0) + (accountValue - account.transactions.reduce((a: number, b: Transaction) => a + b.cost, 0)).toFixed(0)
        } else {
            const cost = account.transactions.filter(transaction => transaction.type !== TransactionType.WRITEDOWN).reduce((a: number, b: Transaction) => a + b.cost, 0)
            yieldForAccount = (accountValue - cost).toFixed(0)
        }
        return {
            name: account.name,
            value: parseInt(yieldForAccount) >= 0 ? parseInt(accountValue.toFixed(0)) - parseInt(yieldForAccount) : accountValue.toFixed(0),
            yield: yieldForAccount,
            totalValue: accountValue.toFixed(0),

        }
    }).sort((a: any, b: any) => b.name - a.name)

    const getHoldingCard = () => {
        const tmpHoldings = [...holdings]
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {
                    tmpHoldings
                        .sort((a: Holding, b: Holding) => b.value - a.value)
                        .filter(holding => holding.value > 1)
                        .map((holding: Holding) => (
                            <div key={holding.key}>
                                <h3 className="text-xl font-semibold">{holding.name}</h3>
                                <p className="text-lg">
                                    {settings.hideNumbers ? '*** Kr' : holding.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })} ({holding.equityType} - {accounts.filter((account: Account) => account.key === holding.accountKey)[0].name})
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

    if (accounts.length > 0) {

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
                <div className="grid grid-cols-1 gap-4 pt-4">
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">{"Value over time"}</h2>
                        </CardHeader>
                        <CardBody>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={valueOverTime} margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                            >
                                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                <XAxis dataKey="created_at" />
                                <YAxis domain={["auto", "auto"]} />
                                <Tooltip content={<CustomTooltipYield />}/>
                                <Legend />
                            </LineChart>
                            </ResponsiveContainer>
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
                                        dataKey="totalValue"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        paddingAngle={3}
                                        innerRadius={40}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label={({ equityType, percent }) => `${(percent * 100).toFixed(1)}% / ${equityTypes.filter((equityTypeElem: EquityType) => { 
                                            return equityTypeElem.label.toLowerCase() === equityType.toLowerCase()})[0]?.goalPercentage}%`
                                        }
                                    >
                                        {equityTypeData.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />}/>
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
                                <BarChart data={accountData}
                                    stackOffset="sign"
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[-1500, Math.ceil(parseInt(development.value.toFixed(0)) / 100) * 100]} />
                                    <Tooltip content={<CustomTooltip />} shared={false}/>

                                    <Bar dataKey="yield" stackId="a" name={t('dashboard.yield')}>
                                        {
                                            accountData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={parseInt(entry.yield) >= 0 ? "#82ca9d" : "#ff3341"} />
                                            ))
                                        }
                                    </Bar>
                                    <Bar dataKey="value" fill="#8884d8" stackId="a" name={t('dashboard.total')} />
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
                            <GoalAnalysis holdings={holdings} equityTypes={equityTypes} />
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
    return (<Spinner />)
}