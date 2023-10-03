import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { doRebalance } from "../Util/Calculations";
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux";

export default function RebalancingModal({isOpen, onOpenChange}) {
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)
    const investments = useSelector(state => state.rootReducer.investments.investments);
    const investmentSum = useSelector(state => state.rootReducer.rebalancing.sum)//TODO: Ta i bruk denne summen i rebalanseringen

    const { t } = useTranslation()

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={'blur'}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{t('rebalancingModal.header')}</ModalHeader>
                        <ModalBody>
                            <div className="w-full text-center flex flex-col justify-center">
                                {
                                    doRebalance(accountTypes, investments).map(transaction => {
                                        return transaction.toBuy === 0 ? "" : <li key={transaction.key}>{transaction.name}: {transaction.toBuy}</li>
                                    })
                                }
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={onClose}>
                                {t('rebalancingModal.close')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}