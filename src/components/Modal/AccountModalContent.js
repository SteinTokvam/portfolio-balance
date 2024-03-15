import { Avatar, Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next"
import DeleteIcon from "../../icons/DeleteIcon";
import { deleteAccountType } from "../../actions/account";

export default function AccountModalContent({children}) {
    const accountToEdit = useSelector(state => state.rootReducer.accounts.accountToEdit);
    const investments = useSelector(state => state.rootReducer.investments.investments);
    const accounts = useSelector(state => state.rootReducer.accounts.accountTypes)
    const [accountToView, setAccountToView] = useState({})

    const { t } = useTranslation()

    const dispatch = useDispatch();

    useEffect(() => {
        if (accountToEdit === undefined) {
            return
        }

        const foundAccount = accounts.filter(account => account.key === accountToEdit.key)

        if (foundAccount.length !== 0) {
            setAccountToView(foundAccount[0])
        } else {
            setAccountToView({})
        }
    }, [accounts, accountToEdit])

    function handleClose() {
        if (investments.filter(investment => investment.type === accountToEdit.key).length !== 0) {
            console.log("Du må slette alle invvesteringer med denne kontotypen først")//TODO: legg dette inn i en toast
            return
        }
        dispatch(deleteAccountType(accountToEdit))
    }

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="justify-between">
                        <div className="flex gap-5">
                            <Avatar isBordered radius="full" size="md" src="finnesIkke" />
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-small font-semibold leading-none text-default-600">{accountToEdit.name}</h4>
                            </div>
                        </div>
                        {children}
                    </ModalHeader>
                    <ModalBody>
                        <div className='grid grid-cols-2 gap-5 justify-between'>
                            <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.type')}</h4>
                            <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.goalPercentage')}</h4>
                            <b>{accountToView.name}</b>
                            <b>{accountToView.goalPercentage}{t('valuators.percentage')}</b>
                            <Spacer y={4} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button isIconOnly color="danger" variant="solid" onPress={() => {
                            onClose()
                            handleClose()
                        }}>
                            <DeleteIcon />
                        </Button>
                        <Button color="primary" variant="light" onPress={onClose}>
                            {t('investmentModal.close')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}