import { Button, Checkbox, Input, Spacer } from "@nextui-org/react";
import { textInputStyle } from "../Util/Global";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setMinimumSumToInvest, setSumToInvest } from "../actions/rebalancing";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Rebalancing() {

    const { t } = useTranslation()
    const dispatch = useDispatch()

    const sumToInvest = useState(1)
    const minimumToInvest = useState(100)
    const [totalValue, setTotalValue] = useState(0)

    const accounts = useSelector(state => state.rootReducer.accounts.accounts)

    const [investmentByType, setInvestmentByType] = useState([])
    const [canSell, setCanSell] = useState(false);
    const [closestToTarget, setClosestToTarget] = useState(false);

    const allHoldings = accounts.map(account => account.holdings).flat()
    const investmentTypes = allHoldings.map(holding => {
        if(holding.fiatValue) {
            return {
                accountKey: holding.accountKey,
                e24Key: holding.e24Key,
                equityShare: holding.equityShare,
                equityType: holding.equityType,
                fiatValue: holding.fiatValue
            }    
        }
        return {
            accountKey: holding.accountKey,
            e24Key: holding.e24Key,
            equityShare: holding.equityShare,
            equityType: holding.equityType,
        }
    })

    const uniqueInvestmentTypes = Array.from(new Set(investmentTypes.map(investmentType => investmentType.equityType)))
    
    useEffect(() => {
        var totalValue = 0
        uniqueInvestmentTypes.forEach(investmentType => {
            investmentTypes.forEach(investment => {
                if (investment.equityType === investmentType) {
                    if(investment.fiatValue) {
                        totalValue += investment.fiatValue
                    } else {
                        //TODO: må hente pris fra e24
                        totalValue += investment.equityShare
                    }
                }
            })

            setInvestmentByType(investmentByType => {
                if(investmentByType.filter(investment => investment.type === investmentType).length > 0) {
                    return investmentByType
                }
                return [...investmentByType, { type: investmentType, totalValue: totalValue }]
            })
        })
        setTotalValue(totalValue)
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    console.log(investmentByType)

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-large font-semibold leading-none text-default-600">{t('rebalancer.header')}</h1>
                <Spacer y={4} />
                <div className="w-3/4 md:w-1/2 lg:w-1/2 ">
                    <Spacer y={10} />
                    <h4 className="text-small font-semibold leading-none text-default-800">{t('rebalancer.text')}</h4>
                    <Spacer y={2} />
                    <Input type="number" classNames={textInputStyle} label={t('rebalancer.textbox')} value={sumToInvest} onValueChange={s => dispatch(setSumToInvest(s))} />
                    <Spacer y={2} />
                    <Input type="number" classNames={textInputStyle} label={t('rebalancer.minimumSum')} value={minimumToInvest} onValueChange={s => dispatch(setMinimumSumToInvest(s))} />
                    <Spacer y={2} />
                    <Checkbox isSelected={canSell} onValueChange={setCanSell}>
                        {t('rebalancer.canSellInvestmentsCheck')}
                    </Checkbox>
                    {
                        !canSell &&
                        <>
                            <Spacer y={2} />
                            <Checkbox isSelected={closestToTarget} onValueChange={setClosestToTarget}>
                                {t('rebalancer.closestToGoalCheck')}
                            </Checkbox>
                        </>
                    }
                    <Spacer y={10} />
                </div>
                <h4 className="text-small font-semibold leading-none text-default-600">{t('rebalancer.subTitle')}</h4>
                <Spacer y={4} />
                <div className="grid grid-cols-2 gap-20 justify-between">
                    {
                        investmentByType.map(type => {
                            return (
                                <Button key={type + uuidv4()} onPress={() => {}} variant="light" color="success" className="h-max grid grid-cols-1 gap-1 justify-between">
                                    <h2 className="text-medium font-semibold leading-none text-default-600">{type.type}</h2>
                                    <Spacer y={1} />
                                    <h4 className="text-medium leading-none text-default-400">{type.totalValue.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h4>
                                    <h4 className="text-medium leading-none text-default-400">{((type.totalValue / totalValue) * 100).toFixed(2)}{t('valuators.percentage')}</h4>
                                </Button>)
                        })
                    }
                    <Spacer y={10} />
                </div>
            </div>
        </>
    );
}