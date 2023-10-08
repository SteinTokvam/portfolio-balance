import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useTranslation } from "react-i18next"
import { textInputStyle } from "./Util/Global"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { v4 as uuidv4 } from 'uuid';
import { addNewAccountType } from "./actions/account"


export function NewAccountTypeModal({ isOpen, onOpenChange }) {

    const { t } = useTranslation()

    const dispatch = useDispatch()

    const [accountTypeText, setAccountTypeText] = useState("")
    const [accountTypeGoalPercentage, setAccountTypeGoalPercentage] = useState(0)

    function handleSubmit() {
        dispatch(addNewAccountType({ key: uuidv4(), name: accountTypeText, goalPercentage: accountTypeGoalPercentage }))
        setAccountTypeText("")
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{t('investmentModal.newTitle')}</ModalHeader>
                        <ModalBody>
                            <Input type="text"
                                classNames={textInputStyle}
                                label={t('settings.accountType')}
                                value={accountTypeText}
                                onValueChange={setAccountTypeText} />
                            <Input type="number"
                                classNames={textInputStyle}
                                label={t('settings.accountTypeGoalPercentage')}
                                value={accountTypeGoalPercentage}
                                onValueChange={setAccountTypeGoalPercentage}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">{t('valuators.percentage')}</span>
                                    </div>} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={onClose}>
                                {t('investmentModal.close')}
                            </Button>
                            <Button color="success" variant="light" aria-label={t('investmentModal.save')} onPress={() => {
                                onClose()
                                handleSubmit()
                            }}>
                                {t('settings.addAccountButton')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}