import React from "react";
import { EquityType, Holding } from "../types/Types";
import { styles } from "../Util/Global";
import { Spacer, Skeleton } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function EquityTypesView({ totalValue }: { totalValue: number }) {
    const accounts = useSelector((state: any) => state.rootReducer.accounts.accounts)
    const equityTypes = useSelector((state: any) => state.rootReducer.equity.equityTypes)
    const holdings = useSelector((state: any) => state.rootReducer.holdings.holdings)
    const settings = useSelector((state: any) => state.rootReducer.settings)
    const { t } = useTranslation();
    
    return (
        <div className="p-4">
                <div className="grid grid-cols-2 gap-20 content-evenly">
                    {accounts && accounts.length > 0 ?
                        equityTypes.map((equityType: EquityType) => {
                            return (
                                <div key={equityType.key} className="sm:text-center sm:justify-center">
                                    <h2 className={styles.valueHeaderText}>{t(`equityTypes.${equityType.key.toLowerCase()}`)}</h2>
                                    <Spacer y={2} />
                                    <Skeleton className="rounded-lg" isLoaded={
                                        holdings
                                            .filter((holding: Holding) => holding.equityType === equityType.key)
                                            .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) > 0
                                    }>
                                    </Skeleton>
                                    <Skeleton className="rounded-lg" isLoaded={
                                        holdings
                                            .filter((holding: Holding) => holding.equityType === equityType.key)
                                            .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) > 0}>
                                        <h4
                                            className={styles.valueText}
                                        ><span className={
                                            Math.abs(((holdings
                                                .filter((holding: Holding) => holding.equityType === equityType.key)
                                                .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)) * 100) - equityType.goalPercentage) >= 3 ?
                                                'text-red-500' : 'text-green-500'}>
                                                {//andel i prosent av total
                                                    ((holdings
                                                        .filter((holding: Holding) => holding.equityType === equityType.key)
                                                        .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0)) * 100).toFixed(2)
                                                }%</span> / {equityType.goalPercentage}%</h4>
                                    </Skeleton>
                                </div>)
                        })
                        : <h4 className="text-large font-bold leading-none">Du har ingen kontoer</h4>
                    }
                </div>
            </div>
    )
}