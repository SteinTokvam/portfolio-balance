import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { GraphIcon } from "../icons/GraphIcon";
import { useTranslation } from "react-i18next";

export default function Statistics() {

    const { t } = useTranslation();
    const accounts = useSelector(state => state.rootReducer.accounts.accounts);
    const totalValue = accounts.length > 0 ? accounts[0].transactions.reduce((sum, account) => {
        console.log(account.fund_name)
        console.log(parseFloat(account.amount))
        return sum + parseFloat(account.amount)
    }, 0) : [];
    console.log(totalValue)

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
                {totalValue > 0 ? accounts.map(account => {
                    const investmentSum = account.transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
                    return investmentSum > 0 ? <li key={account.key}>{t('statistics.cardShareOfValue', { investment: account.type, percentage: ((investmentSum / totalValue) * 100).toFixed(2) })}</li> : ""
                }) : ""}        
            </CardBody>
        </Card>
    );
}