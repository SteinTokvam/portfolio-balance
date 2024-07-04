import React from "react";
import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { styles } from "../../Util/Global";
import { useSelector } from "react-redux";
import { changeGoalPercentage } from "../../actions/equityType";
import { EquityType } from "../../types/Types";

export default function ChangeGoalPercentageModalContent() {
    const { t } = useTranslation()

    const equityTypes = useSelector((state: any) => state.rootReducer.equity.equityTypes)

    const [selectedEquityTypeKey, setSelectedTransactionKeys] = useState(["Fund"]);
    const selectedEquityType = useMemo(
        () => Array.from(selectedEquityTypeKey).join(", ").replaceAll("_", " "),
        [selectedEquityTypeKey]
    );

    const [goalPercentage, setGoalPercentage] = useState(equityTypes.filter((equityType: EquityType) => equityType.key === selectedEquityType)[0].goalPercentage)

    const dispatch = useDispatch()

    const validatePercentage = (newPercentage: number, equityTypeKey: string) => {
        return equityTypes.filter((equityType: EquityType) => equityType.key !== equityTypeKey).reduce((a: number, b: EquityType) => a + b.goalPercentage, 0) + newPercentage > 100
    }

    const [isInvalid, setIsInvalid] = useState(false)

    useEffect(() => {
        setGoalPercentage(parseInt(equityTypes.filter((equityType: EquityType) => equityType.key === selectedEquityType)[0].goalPercentage))
    }, [selectedEquityType, equityTypes])

    function handleSubmit() {
        const newGoalPercentage: EquityType = equityTypes.filter((equityType: EquityType) => equityType.key === selectedEquityType).map((equityType: EquityType) => {
            return {
                ...equityType,
                goalPercentage: parseInt(goalPercentage)
            }
        })[0]

        dispatch(changeGoalPercentage(newGoalPercentage))
    }
    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Ny transaksjon</ModalHeader>
                    <ModalBody className="">

                        <Select
                            label={"Transaksjonstype"}
                            placeholder={"Transaksjonstype"}
                            className="pt-4 drop-shadow-xl"
                            // @ts-ignore
                            onSelectionChange={setSelectedTransactionKeys}
                            selectedKeys={selectedEquityTypeKey}
                        >
                            {equityTypes.map((equityType: EquityType) => (
                                <SelectItem key={equityType.key} value={t(`equityTypes.${equityType.key.toLowerCase()}`)} >
                                    {t(`equityTypes.${equityType.key.toLowerCase()}`)}
                                </SelectItem>
                            ))}
                        </Select>



                        <Input type="number"
                            classNames={styles.textInputStyle}
                            label={"Målprosent"}
                            value={goalPercentage}
                            onValueChange={(newValue: string) => {
                                setIsInvalid(validatePercentage(parseInt(newValue), selectedEquityType))
                                setGoalPercentage(parseInt(newValue))
                            }}
                            isInvalid={isInvalid}
                            errorMessage={
                                isInvalid ?
                                    `Målprosent for alle investeringstyper kan ikke overstige 100%. Nåværende ville blitt: ${equityTypes.filter((equityType: EquityType) => equityType.key !== selectedEquityType).reduce((a: number, b: EquityType) => a + b.goalPercentage, 0) + goalPercentage}` :
                                    ''
                            }
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={() => {
                            onClose()
                        }}>
                            {t('general.closeButton')}
                        </Button>
                        <Button color="success" variant="light" aria-label={t('general.save')} onPress={() => {
                            setIsInvalid(validatePercentage(goalPercentage, selectedEquityType))
                            if (isInvalid) {
                                console.log("Invalid goal percentage")
                                return
                            }
                            onClose()
                            handleSubmit()
                        }}>
                            {t('general.save')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}