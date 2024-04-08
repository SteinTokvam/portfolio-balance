import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { textInputStyle } from "../../Util/Global";
import { useSelector } from "react-redux";
import { changeGoalPercentage } from "../../actions/equityType";


export default function ChangeGoalPercentageModalContent() {
    const { t } = useTranslation()

    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)

    const [selectedEquityTypeKey, setSelectedTransactionKeys] = useState(["Fund"]);
    const selectedEquityType = useMemo(
        () => Array.from(selectedEquityTypeKey).join(", ").replaceAll("_", " "),
        [selectedEquityTypeKey]
    );

    const [goalPercentage, setGoalPercentage] = useState(equityTypes.filter(equityType => equityType.key === selectedEquityType)[0].goalPercentage)

    const dispatch = useDispatch()

    const validatePercentage = (newPercentage, equityTypeKey) => {
        return equityTypes.filter(equityType => equityType.key !== equityTypeKey).reduce((a, b) => a + b.goalPercentage, 0) + newPercentage > 100
    }

    const [isInvalid, setIsInvalid] = useState(false)

    useEffect(() => {
        setGoalPercentage(parseInt(equityTypes.filter(equityType => equityType.key === selectedEquityType)[0].goalPercentage))
    }, [selectedEquityType, equityTypes])

    function handleSubmit() {
        const newGoalPercentage = equityTypes.filter(equityType => equityType.key === selectedEquityType).map(equityType => {
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
                            onSelectionChange={setSelectedTransactionKeys}
                            selectedKeys={selectedEquityTypeKey}
                        >
                            {equityTypes.map((equityType) => (
                                <SelectItem key={equityType.key} value={equityType.label} >
                                    {equityType.label}
                                </SelectItem>
                            ))}
                        </Select>



                        <Input type="number"
                            classNames={textInputStyle}
                            label={"Målprosent"}
                            value={goalPercentage}
                            onValueChange={(newValue) => {
                                setIsInvalid(validatePercentage(parseInt(newValue), selectedEquityType))
                                setGoalPercentage(parseInt(newValue))
                            }}
                            isInvalid={isInvalid}
                            errorMessage={isInvalid ? `Målprosent for alle investeringstyper kan ikke overstige 100%. Nåværende ville blitt: ${equityTypes.filter(equityType => equityType.key !== selectedEquityType).reduce((a, b) => a + b.goalPercentage, 0) + goalPercentage}` : ''}
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
                                console.log("Ny målprosent ikke valid")
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