import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { textInputStyle } from "../Util/Global";
import { getAvailableGoalPercentages } from "../Util/Calculations";
import { useSelector } from "react-redux";

export default function EditAccountModal({ isOpen, onOpenChange }) {

    const accounts = useSelector(state => state.rootReducer.accounts.accountTypes);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedAccountType, setSelectedAccountType] = useState("");
    const selectedGoalPercentage = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const availablePercentageNum = getAvailableGoalPercentages(accounts)
    const availablePercentage = availablePercentageNum > 0 ? Array(availablePercentageNum).fill(1).map((n, i) => n + i) : [0]

    const { t } = useTranslation();
    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Endre kontotype</ModalHeader>
                            <ModalBody>
                                <h4 className="text-small font-semibold leading-none text-default-600">Målprosent:</h4>
                                <Select
                                    label={t('investmentModal.type')}
                                    placeholder={t('investmentModal.typeLabel')}
                                    className="max-w-xs"
                                    onSelectionChange={setSelectedKeys}
                                    selectedKeys={selectedKeys}
                                >
                                    {availablePercentage.map((percentage) => (
                                        <SelectItem key={percentage} value={percentage}>
                                            {percentage}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <h4 className="text-small font-semibold leading-none text-default-600">Kontonavn:</h4>
                                <Input type="text" classNames={textInputStyle} label="Kontotype" value={selectedAccountType} onValueChange={setSelectedAccountType} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={() => 
                                    {
                                        setSelectedKeys([]);
                                        onClose()
                                    }}>
                                    {t('rebalancingModal.close')}
                                </Button>
                                <Button color="success" variant="light" onPress={onClose}>
                                    {t('investmentModal.saveChanges')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>)
}