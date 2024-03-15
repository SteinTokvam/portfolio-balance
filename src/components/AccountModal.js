import { Avatar, Button, ModalBody, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react"
import { useSelector } from "react-redux"
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next"
import EditIcon from "../icons/EditIcon"
import { NewAccountTypeModal } from "../NewAccountTypeModal"

export default function AccountModal() {
    const accountToEdit = useSelector(state => state.rootReducer.accounts.accountToEdit)
    const accounts = useSelector(state => state.rootReducer.accounts.accountTypes)
    const [accountToView, setAccountToView] = useState({})

    const { t } = useTranslation()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

    return (
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
                    <b>{accountToView.goalPercentage}{t('valuators.percentage')}</b>
                    <Spacer y={4} />
                </div>
            </ModalBody>
        </>
    )
}