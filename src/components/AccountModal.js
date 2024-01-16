import { Avatar, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Spacer, useDisclosure } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next"
import DeleteIcon from "../icons/DeleteIcon"
import { deleteAccountType } from "../actions/account"
import EditIcon from "../icons/EditIcon"
import { NewAccountTypeModal } from "../NewAccountTypeModal"

export default function AccountModal({isOpenAccount, onOpenChangeAccount}) {
    const accountToEdit = useSelector(state => state.rootReducer.accounts.accountToEdit)
    const accounts = useSelector(state => state.rootReducer.accounts.accountTypes)
    const investments = useSelector(state => state.rootReducer.investments.investments)
    const [accountToView, setAccountToView] = useState({})

    const { t } = useTranslation()

    const dispatch = useDispatch()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if(accountToEdit === undefined) {
            return
        }

        const foundAccount = accounts.filter(account => account.key === accountToEdit.key)

        if (foundAccount.length !== 0) {
            setAccountToView(foundAccount[0])
        } else {
            setAccountToView({})
        }
    }, [accounts, accountToEdit])

    function handleDelete() {
        if(investments.filter(investment => investment.type === accountToEdit.name).length !== 0){
            console.log("Du må slette alle invvesteringer med denne kontotypen først")
            return
        }
        dispatch(deleteAccountType(accountToEdit))
    }

    return (
        <Modal isOpen={isOpenAccount} onOpenChange={onOpenChangeAccount} backdrop='blur' scrollBehavior='inside' hideCloseButton={true}>

        <ModalContent>
            {(onCloseAccount) => (
                <>
                    <NewAccountTypeModal isOpen={isOpen} onOpenChange={onOpenChange} isEdit={true} />
                    <ModalHeader className="justify-between">
                        <div className="flex gap-5">
                            <Avatar isBordered radius="full" size="md" src="finnesIkke" />
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-small font-semibold leading-none text-default-600">{accountToEdit.name}</h4>
                            </div>
                        </div>
                        <Button
                                className={""}
                                color="primary"
                                radius="full"
                                size="sm"
                                variant={"bordered"}
                                onPress={onOpen}
                            >
                                <EditIcon />
                                {t('investmentInfoModal.edit')}
                            </Button>
                    </ModalHeader>
                    <ModalBody>
                        <div className='grid grid-cols-2 gap-5 justify-between'>
                            <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.type')}</h4>
                            <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.goalPercentage')}</h4>
                            <b>{accountToView.name}</b>
                            <b>{accountToView.goalPercentage}%</b>
                            <Spacer y={4} />
                        </div>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button isIconOnly color="danger" variant="solid" onPress={() => {
                            onCloseAccount()
                            handleDelete()
                        }}>
                            <DeleteIcon />
                        </Button>
                        <Button color="primary" variant="light" onPress={onCloseAccount}>
                            {t('investmentModal.close')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
    )
}