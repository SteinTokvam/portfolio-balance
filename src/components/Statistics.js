import { Card, CardHeader, CardBody, Divider, Spacer } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { GraphIcon } from "../icons/GraphIcon";
import { useTranslation } from "react-i18next";
import { Transaction } from "@react-stately/virtualizer";

export default function Statistics() {

    const { t } = useTranslation();
    const investments = useSelector(state => state.rootReducer.investments.investments);
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes);

    const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0);

    function doRebalance() {
        const ret = []
        ret.push(accountTypes
            .map(type => {
                const ret = calculateRebalance(type)
                return ret
            }))

        return ret.flat().flat()
    }

    function calculateRebalance(investmentType) {
        const typeOfInvestment = investments.filter(investment => investment.type === investmentType)
        const totalValueForType = typeOfInvestment.reduce((sum, investment) => sum + investment.value, 0);

        //(målprosent-nåværende prosent) * totalValueForType = mengde å kjøpe/selge

        return typeOfInvestment.map(investment => {
            const percentageDiff = ((investment.percentage / 100) - ((investment.value / totalValueForType)).toFixed(2))
            var toBuy = (percentageDiff * totalValueForType).toFixed(0)

            if (toBuy < 99 && toBuy > -99) {
                console.log("fjerner " + toBuy + " fra investering " + investment.name)
                toBuy = 0
            }
            const key = investment.key

            if (parseInt(investment.percentage) === 0) {
                return { key: key, name: investment.name, toBuy: 0}//-investment.value }
            }

            return { key: key, name: investment.name, toBuy: toBuy }
        })
    }

    return (

        <Card className="max-w-[500px] min-w-[250px] ">
            <CardHeader className="flex gap-3">
                <GraphIcon />
                <div className="flex flex-col">
                    <p className="text-md">{t('statistics.cardTitle')}</p>
                    <p className="text-small text-default-500">{t('statistics.cardSubTitle')}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <li>{t('statistics.cardTotalValue', { value: totalValue, currency: t('valuators.currency') })} </li>
                {totalValue > 0 ? accountTypes.map(investmentType => {
                    const investmentSum = investments.filter(investment => investment.type === investmentType).reduce((sum, investment) => sum + investment.value, 0)
                    return investmentSum > 0 ? <li key={investmentType}>{t('statistics.cardShareOfValue', { investment: investmentType, percentage: ((investmentSum / totalValue) * 100).toFixed(2) })}</li> : ""
                }) : ""}

                <Spacer y={4} />
                <h4 className="text-small font-semibold leading-none text-default-600">Rebalansering uten nye innskudd</h4>
                {
                    //calculateRebalance("Fond")
                    doRebalance().map(transaction => {
                        return transaction.toBuy === 0 ? "" : <li key={transaction.key}>{transaction.name}: {transaction.toBuy}</li>
                    })
                }
            </CardBody>

        </Card>

    );
}