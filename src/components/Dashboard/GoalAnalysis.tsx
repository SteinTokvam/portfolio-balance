import { styles } from "../../Util/Global";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { EquityType, Holding } from "../../types/Types";
import { Divider } from "@nextui-org/react";
import { useEffect } from "react";
import { getEquityTypes } from "../../Util/Supabase";
import { setEquityTypes } from "../../actions/equityType";

export default function GoalAnalysis({holdings, equityTypes}: {holdings: Holding[], equityTypes: EquityType[]}) {

    type FurthestFromGoal = {
        currentPercentage: number,
        equityType: EquityType,
        goalPercentage: number,
        distanceFromGoalPercentage: number
    }

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const furthestFromGoal = equityTypes.map((equityType: EquityType) => {
        const currentPercentage = parseFloat((holdings
            .filter((holding: Holding) => {
                return holding.equityType.toLowerCase() === equityType.label.toLocaleLowerCase()
            })
            .reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0) / holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0) * 100).toFixed(2))
        return {
            currentPercentage,
            equityType: equityType,
            goalPercentage: equityType.goalPercentage,
            distanceFromGoalPercentage: equityType.goalPercentage - currentPercentage
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

    useEffect(() => {
        getEquityTypes()
        .then(equityTypes => dispatch(setEquityTypes(equityTypes)))
    }, [])
    return (
        <>
        {
            holdings && holdings.length > 0 ?
                <div className="w-full flex flex-col justify-center">
                    <Divider />

                    <div className="flex flex-col gap-20 p-4 sm:grid sm:grid-rows-2 sm:gap-8 sm:justify-between" >
                        <h4 className={styles.valueHeaderText}>
                            { furthestFromGoal.length > 0 &&
                                t('dashboard.investmentToFocus',
                                    {
                                        bullet: '\u{2022}',
                                        equityType: furthestFromGoal[0].equityType.label,
                                        distanceFromGoalPercentage: furthestFromGoal[0].distanceFromGoalPercentage.toFixed(2)
                                    }
                                )
                            }
                        </h4>

                        <h4 className={styles.valueHeaderText}>
                            { furthestFromGoal.length > 0 &&
                                t('dashboard.investmentOverbought',
                                    {
                                        bullet: '\u{2022}',
                                        equityType: furthestFromGoal[furthestFromGoal.length - 1].equityType.label,
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