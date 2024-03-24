import { Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {

    /*const { t } = useTranslation();
    const investments = useSelector(state => state.rootReducer.investments.investments)
    const accounts = useSelector(state => state.rootReducer.accounts.accounts)
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)

    const [biggestInvestment, setBiggestInvestment] = useState({})

    useEffect(() => {
        const res = Math.max.apply(Math, investments.map(function (i) { return i.value; }))

        const foundInvestment = investments.find(function (i) { return i.value === res; })
        if (foundInvestment !== undefined || foundInvestment !== Infinity) {
            setBiggestInvestment(foundInvestment)
        }
    }, [setBiggestInvestment, investments])

    const totalValueByType = accounts.map(account => {
        return { accountType: account.name, value: investments.filter(investment => investment.type === account.key).reduce((sum, investment) => sum + investment.value, 0) }
    })
    const totalValueForInvestments = useSelector(state => state.rootReducer.accounts.totalValueForInvestments)
    

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <Spacer y={10} />
                <h1 className="text-medium text-left font-semibold leading-none text-default-600">{t('dashboard.total')}</h1>
                <Spacer y={2} />
                <h2 className="text-large text-left font-bold leading-none text-default-400">{totalValueForInvestments.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h2>
                <Spacer y={20} />
            </div >
            <div className="w-full text-center flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-20 justify-between">
                    {
                        totalValueByType.map(type => {
                            return (
                                <div key={type + uuidv4()}>
                                    <h2 className="text-medium font-semibold leading-none text-default-600">{type.accountType}</h2>
                                    <Spacer y={2} />
                                    <h4 className="text-large font-bold leading-none text-default-400">{type.value} {t('valuators.currency')}</h4>
                                </div>)
                        })
                    }
                </div>
            </div>
            {
                biggestInvestment !== null && biggestInvestment !== undefined && Object.keys(biggestInvestment).length > 0 ?
                <div className="full text-center mx-auto flex flex-col justify-center">
                    <Spacer y={20} />
                    <h1 className="text-medium font-semibold leading-none text-default-600">{t('dashboard.biggestInvestment')}</h1>
                    <Spacer y={2} />
                    <h2 className="text-large font-bold leading-none text-default-400">{biggestInvestment.name + ": " + (biggestInvestment.value / totalValueForInvestments.toFixed(2) * 100).toFixed(2) + t('valuators.percentage')}</h2>
                    <Spacer y={4} />
                </div> : ""
            }
        </>
    )*/
}