import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useTranslation } from "react-i18next"
import { textInputStyle } from "../../Util/Global"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from 'uuid';
import { addNewAccountType, editAccount } from "../../actions/account"

export function NewAccountTypeModalContent({ isEdit, setScreen = () => { } }) {

    const { t } = useTranslation()

    const [accountTypeText, setAccountTypeText] = useState("")
    const [accountTypeGoalPercentage, setAccountTypeGoalPercentage] = useState(0)
    const accountToEdit = useSelector(state => state.rootReducer.accounts.accountToEdit)
    const dispatch = useDispatch()

    useEffect(() => {
        if (isEdit && accountToEdit !== undefined) {
            setAccountTypeText(accountToEdit.name)
            setAccountTypeGoalPercentage(accountToEdit.goalPercentage)
        }
    }, [accountToEdit, isEdit])

    function handleSubmit() {
        setScreen(true)
        if (isEdit) {
            dispatch(editAccount({ key: accountToEdit.key, name: accountTypeText, goalPercentage: accountTypeGoalPercentage }))
        } else {
            dispatch(addNewAccountType({ key: uuidv4(), name: accountTypeText, goalPercentage: accountTypeGoalPercentage }))
        }
    }

    return (
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
                        <Button color="primary" variant="light" onPress={() => {
                            setScreen(true)
                            onClose()
                        }}>
                            {t('investmentModal.close')}
                        </Button>
                        <Button color="success" variant="light" aria-label={isEdit ? t('investmentModal.saveChanges') : t('investmentModal.save')} onPress={() => {
                            onClose()
                            handleSubmit()
                        }}>
                            {isEdit ? t('investmentModal.saveChanges') : t('settings.addAccountButton')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}