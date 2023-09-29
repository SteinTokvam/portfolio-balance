import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { GraphIcon } from "../icons/GraphIcon";
import { useTranslation } from "react-i18next";

export default function Statistics() {

    const { t } = useTranslation();
    const investments = useSelector(state => state.rootReducer.investments.investments);
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes);

    const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0);

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
            </CardBody>
        </Card>
    );
}