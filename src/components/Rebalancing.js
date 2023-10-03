import { useState } from "react";
import { Button, Input, Spacer, useDisclosure } from "@nextui-org/react";
import { textInputStyle } from "../Util/Global";
import { useTranslation } from "react-i18next";
import RebalancingModal from "./RebalancingModal";
import { useDispatch, useSelector } from "react-redux";
import { setSumToInvest } from "../actions/rebalancing";

export default function Rebalancing() {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { t } = useTranslation()

    const selectedSum = useSelector(state => state.rootReducer.rebalancing.sum)
    const dispatch = useDispatch()

    const investments = useSelector(state => state.rootReducer.investments.investments)
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)
    const totalValueByType = accountTypes.map(accountType => {//Denne må endres til å hente målprosent. dette er noe jeg ikke har pr i dag.
        return { accountType: accountType, value: investments.filter(investment => investment.type === accountType).reduce((sum, investment) => sum + investment.value, 0) }
    })

    function handleSubmit() {
        onOpen()
        console.log("submitted rebalancer")
    }

    return (
        <>
            <RebalancingModal isOpen={isOpen} onOpenChange={onOpenChange} />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-large font-semibold leading-none text-default-600">{t('rebalancer.header')}</h1>
                <Spacer y={4} />
                <h4 className="text-small font-semibold leading-none text-default-600">Målfordeling:</h4>
                <Spacer y={4} />
                <div className="grid grid-cols-2 gap-20 justify-between">
                    {
                        totalValueByType.map(type => {
                            return (
                                <div key={type}>
                                    <h2 className="text-medium font-semibold leading-none text-default-600">{type.accountType}</h2>
                                    <Spacer y={2} />
                                    <h4 className="text-large font-bold leading-none text-default-400">{type.value} {t('valuators.currency')}</h4>
                                </div>)
                        })
                    }
                    <Spacer y={10} />
                </div>
                <div className="w-1/4">
                <h4 className="text-small font-semibold leading-none text-default-800">{t('rebalancer.text')}</h4>
                <Spacer y={2} />
                    <Input type="number" classNames={textInputStyle} label={t('rebalancer.textbox')} value={selectedSum} onValueChange={s => dispatch(setSumToInvest(s))} />
                </div>
                <div className="w-full mx-auto text-center">
                    <Spacer y={4} />
                    <Button color="success" aria-label={t('rebalancer.rebalanceButton')} onPress={handleSubmit}>
                        {t('rebalancer.rebalanceButton')}
                    </Button>
                </div>
            </div>
        </>
    );
}