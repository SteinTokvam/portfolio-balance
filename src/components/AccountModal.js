import { Avatar, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Spacer } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import DeleteIcon from "../icons/DeleteIcon"
import { deleteAccountType } from "../actions/account"

export default function AccountModal({isAccountType, isOpen, onOpenChange}) {
    const accountToEdit = useSelector(state => state.rootReducer.accounts.accountToEdit)
    const investments = useSelector(state => state.rootReducer.investments.investments)

    const { t } = useTranslation()

    const dispatch = useDispatch()

    function handleDelete() {
        if(investments.filter(investment => investment.type === accountToEdit.name).length !== 0){
            console.log("Du må slette alle invvesteringer med denne kontotypen først")
            return
        }
        dispatch(deleteAccountType(accountToEdit))
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' scrollBehavior='inside' hideCloseButton={true}>

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
                    </ModalHeader>
                    <ModalBody>
                        <div className='grid grid-cols-2 gap-5 justify-between'>
                            <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.type')}</h4>
                            
                            
                            
                            <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.goalPercentage')}</h4>
                            <b>{accountToEdit.name}</b>
                            <b>{accountToEdit.goalPercentage}%</b>
                            <Spacer y={4} />
                        </div>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button isIconOnly color="danger" variant="solid" onPress={() => {
                            onClose()
                            handleDelete()
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
    </Modal>
    )
}