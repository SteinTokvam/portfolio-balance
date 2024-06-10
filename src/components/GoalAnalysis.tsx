import React from "react";
import { styles } from "../Util/Global";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { EquityType, Holding } from "../types/Types";
import { Divider } from "@nextui-org/react";

export default function GoalAnalysis() {

    type FurthestFromGoal = {
        currentPercentage: number,
        equityType: EquityType,
        goalPercentage: number,
        distanceFromGoalPercentage: number
    }

    const { t } = useTranslation();
    // @ts-ignore
    const accounts = useSelector(state => state.rootReducer.accounts.accounts)
    // @ts-ignore
    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)
    // @ts-ignore
    const holdings = useSelector(state => state.rootReducer.holdings.holdings)
    const furthestFromGoal = equityTypes.map((equityType: EquityType) => {
        return {
            currentPercentage: parseFloat((holdings
                .filter((holding: Holding) => holding.equityType === equityType.key)
                .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0) * 100).toFixed(2)),
            equityType
        }
    }).map((furthest: FurthestFromGoal) => {
        return {
            ...furthest,
            distanceFromGoalPercentage: furthest.equityType.goalPercentage - furthest.currentPercentage
        }
    }).sort((a: FurthestFromGoal, b: FurthestFromGoal) => {
        if (a.distanceFromGoalPercentage < b.distanceFromGoalPercentage) {
            return 1
        } else if (a.distanceFromGoalPercentage > b.distanceFromGoalPercentage) {
            return -1
        }
        return 0
    })
    return (
        <>
        {
            accounts && accounts.length > 0 ?
                <div className="w-full flex flex-col justify-center">
                    <Divider />

                    <div className="flex flex-col gap-20 p-4 sm:grid sm:grid-cols-2 sm:gap-8 sm:justify-between" >
                        <h4 className={styles.valueHeaderText}>
                            {
                                t('dashboard.investmentToFocus',
                                    {
                                        bullet: '\u{2022}',
                                        equityType: t(`equityTypes.${furthestFromGoal[0].equityType.key.toLowerCase()}`),
                                        distanceFromGoalPercentage: furthestFromGoal[0].distanceFromGoalPercentage.toFixed(2)
                                    }
                                )
                            }
                        </h4>

                        <h4 className={styles.valueHeaderText}>
                            {
                                t('dashboard.investmentOverbought',
                                    {
                                        bullet: '\u{2022}',
                                        equityType: t(`equityTypes.${furthestFromGoal[furthestFromGoal.length - 1].equityType.key.toLowerCase()}`),
                                        distanceFromGoalPercentage: Math.abs(furthestFromGoal[furthestFromGoal.length - 1].distanceFromGoalPercentage).toFixed(2)
                                    }
                                )
                            }
                        </h4>
                    </div>
                </div>
                : ''
        }
        </>
    )
}