import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Account, EquityType, Holding } from "../types/Types"
import { Input, Spacer } from "@nextui-org/react"
import { getHoldings, styles } from "../Util/Global"
import { useTranslation } from "react-i18next"
import { addHoldings } from "../actions/holdings"
import HoldingsDiagram from "./HoldingsDiagram";

export default function Analysis() {

    // @ts-ignore
    const accounts = useSelector(state => state.rootReducer.accounts.accounts)
    // @ts-ignore
    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)
    // @ts-ignore
    const holdings = useSelector(state => state.rootReducer.holdings.holdings)

    const totalValue = holdings.reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0)
    const [toInvest, setToInvest] = useState("0")
    const {t} = useTranslation()
    const dispatch = useDispatch()

    const rebalancedValue = equityTypes.map((equityType: EquityType) => {
        return {
            current_percentage: (holdings
                .filter((holding: Holding) => holding.equityType === equityType.key)
                .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)) * 100,
            goal_percentage: equityType.goalPercentage,
            current_value: holdings.filter((holding: Holding) => holding.equityType === equityType.key).reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0),
            equityType: equityType,
            distanceToGoal: (((totalValue+parseFloat(toInvest)) * (equityType.goalPercentage / 100)) - holdings
                .filter((holding: Holding) => holding.equityType === equityType.key)
                .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0))
        }

    });

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
    
    return (
        <div className="w-full p-4 mx-auto md:w-1/2 sm:w-3/4">
            <h1>Analyse</h1>
            <h2 className="text-4xl">{totalValue.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h2>
            <p>Nåværende fordeling:</p>
            <HoldingsDiagram data={rebalancedValue.map((rebalancedValue: any) => { return { value: rebalancedValue.current_percentage, type: rebalancedValue.equityType.key } })} />
            <Spacer y={4} />
            <Input type="number"
                classNames={styles.textInputStyle}
                label={"Ny investering"}
                value={toInvest}
                isInvalid={parseFloat(toInvest) < 0}
                onValueChange={setToInvest}
            />
            <Spacer y={4} />
            <p>Ved å investere {toInvest} kr, blir din nye totalverdi {(totalValue + parseFloat(toInvest)).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })} og følgende justeringer må gjennomføres:</p>
            {
                rebalancedValue.map((rebalancedValue: { current_percentage: number, goal_percentage: number, equityType: EquityType, distanceToGoal: number, current_value: number }) => {
                    return <div key={rebalancedValue.equityType.key} className="grid grid-cols-2 p-4 shadow-md rounded">
                        <h1 className="text-xl">{t(`equityTypes.${rebalancedValue.equityType.key.toLowerCase()}`)}</h1>
                        <h2 className="text-lg">{rebalancedValue.distanceToGoal.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h2>
                        <h1 className="text-xl">Ny verdi:</h1>
                        <h2 className="text-lg">{(rebalancedValue.current_value + rebalancedValue.distanceToGoal).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h2>
                    </div>
                })
            }
        </div>
    )
}