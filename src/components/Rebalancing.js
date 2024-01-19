import { Button, Checkbox, Input, Spacer, useDisclosure } from "@nextui-org/react";
import { textInputStyle } from "../Util/Global";
import { useTranslation } from "react-i18next";
import RebalancingModal from "./RebalancingModal";
import { useDispatch, useSelector } from "react-redux";
import { setMinimumSumToInvest, setSumToInvest } from "../actions/rebalancing";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Rebalancing() {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { t } = useTranslation()

    const selectedSum = useSelector(state => state.rootReducer.rebalancing.sum)
    const selectedMinimumSum = useSelector(state => state.rootReducer.rebalancing.minimumSum)
    const dispatch = useDispatch()

    const investments = useSelector(state => state.rootReducer.investments.investments)
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)
    const totalValueByType = accountTypes.map(accountType => {
        return { 
            accountTypeGoalPercentage: accountType.accountTypeGoalPercentage, 
            accountType: accountType.name, 
            value: investments.filter(investment => investment.type === accountType.key).reduce((sum, investment) => sum + investment.value, 0) }
    })
    const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0);

    const [investmentByType, setInvestmentByType] = useState([])
    const [canSell, setCanSell] = useState(false);
    const [closestToTarget, setClosestToTarget] = useState(false);

    function handleInvestmentTypeRebalance(investmentType) {
        setInvestmentByType(investments.filter(investment => investment.type === investmentType))
        onOpen()
    }

    return (
        <>
            <RebalancingModal isOpen={isOpen} onOpenChange={onOpenChange} investmentByType={investmentByType} canSell={canSell} closestToTarget={closestToTarget} />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-large font-semibold leading-none text-default-600">{t('rebalancer.header')}</h1>
                <Spacer y={4} />
                <div className="w-3/4 md:w-1/2 lg:w-1/2 ">
                    <Spacer y={10} />
                    <h4 className="text-small font-semibold leading-none text-default-800">{t('rebalancer.text')}</h4>
                    <Spacer y={2} />
                    <Input type="number" classNames={textInputStyle} label={t('rebalancer.textbox')} value={selectedSum} onValueChange={s => dispatch(setSumToInvest(s))} />
                    <Spacer y={2} />
                    <Input type="number" classNames={textInputStyle} label={t('rebalancer.minimumSum')} value={selectedMinimumSum} onValueChange={s => dispatch(setMinimumSumToInvest(s))} />
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
                        totalValueByType.map(type => {
                            return (
                                <Button key={type + uuidv4()} onPress={() => handleInvestmentTypeRebalance(type.accountType)} variant="light" color="success" className="h-max grid grid-cols-1 gap-1 justify-between">
                                    <h2 className="text-medium font-semibold leading-none text-default-600">{type.accountType}</h2>
                                    <Spacer y={2} />
                                    <h4 className="text-large font-bold leading-none text-default-400">{((type.value / totalValue) * 100).toFixed(2)}{t('valuators.percentage')}</h4>
                                </Button>)
                        })
                    }
                    <Spacer y={10} />
                </div>
            </div>
        </>
    );
}