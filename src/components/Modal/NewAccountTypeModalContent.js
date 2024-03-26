import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react"
import { useTranslation } from "react-i18next"
import { textInputStyle } from "../../Util/Global"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from 'uuid';
import { addAutomaticAccount, addNewAccount, editAccount } from "../../actions/accounts"

export function NewAccountTypeModalContent({ isEdit, setScreen = () => { } }) {

    const { t } = useTranslation()

    const [accountName, setAccountName] = useState("")
    const [accountTypeText, setAccountTypeText] = useState("")
    const [accountTypeGoalPercentage, setAccountTypeGoalPercentage] = useState(0)

    const [accessKeyText, setAccessKeyText] = useState("")

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
            dispatch(editAccount(
                {
                    key: accountToEdit.key,
                    name: accountTypeText,
                    goalPercentage: accountTypeGoalPercentage
                }
            ))
        } else {
            if (accountTypeText !== "") {
                dispatch(addNewAccount(
                    {
                        name: accountName,
                        key: uuidv4(),
                        type: accountTypeText,
                        transactions: [],
                        goalPercentage: accountTypeGoalPercentage,
                        totalValue: 0,
                        yield: 0,
                        isManual: true,
                        apiInfo: {},
                        holdings: []
                    }
                ))
            } else {
                dispatch(addAutomaticAccount(
                    {
                        name: accountName,
                        key: uuidv4(),
                        type: "Cryptocurrency",
                        transactions: [],
                        goalPercentage: accountTypeGoalPercentage,
                        totalValue: 0,
                        yield: 0,
                        isManual: false,
                        apiInfo: {
                            accessKey: accessKeyText
                        },
                        holdings: []
                    }
                ))
            }
        }
    }

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">{t('accountModal.title')}</ModalHeader>
                    <ModalBody>
                        <Tabs>
                            <Tab key="Manual" title="Manual import">
                                <Input type="text"
                                    classNames={textInputStyle}
                                    label={"Kontonavn"}
                                    value={accountName}
                                    onValueChange={setAccountName} />
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
                            </Tab>
                            <Tab key="Auto" title="Automatic import">
                                <Input type="text"
                                    classNames={textInputStyle}
                                    label={"Kontonavn"}
                                    value={accountName}
                                    onValueChange={setAccountName} />
                                <Input type="number"
                                    classNames={textInputStyle}
                                    label={t('settings.accountTypeGoalPercentage')}
                                    value={accountTypeGoalPercentage}
                                    onValueChange={setAccountTypeGoalPercentage}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">{t('valuators.percentage')}</span>
                                        </div>} />
                                <Input type="text"
                                    classNames={textInputStyle}
                                    label="Firi access key"
                                    value={accessKeyText}
                                    onValueChange={setAccessKeyText} />
                            </Tab>
                        </Tabs>

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
