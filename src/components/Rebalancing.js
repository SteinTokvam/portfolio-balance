import { useSelector } from "react-redux";
import { doRebalance } from "../Util/Calculations";
import { useState } from "react";
import { Input, Spacer } from "@nextui-org/react";
import { textInputStyle } from "../Util/Global";
import { useTranslation } from "react-i18next";

export default function Rebalancing() {
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes);
    const investments = useSelector(state => state.rootReducer.investments.investments);

    const { t } = useTranslation()

    const [selectedSum, setSelectedSum] = useState("");

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">{t('rebalancer.header')}</h4>
                <Spacer y={4} />
                <div className="w-1/4">
                    <Input type="number" classNames={textInputStyle} label={t('rebalancer.textbox')} value={selectedSum} onValueChange={setSelectedSum} />
                </div>
            </div>
            <div className="w-full text-center flex flex-col justify-center">
                {
                    doRebalance(accountTypes, investments).map(transaction => {
                        return transaction.toBuy === 0 ? "" : <li key={transaction.key}>{transaction.name}: {transaction.toBuy}</li>
                    })
                }
            </div>

        </>
    );
}