import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { doRebalance } from "../Util/Calculations";
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux";

export default function RebalancingModal({isOpen, onOpenChange, investmentByType}) {
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)
    const investmentSum = useSelector(state => state.rootReducer.rebalancing.sum)//TODO: Ta i bruk denne summen i rebalanseringen

    const { t } = useTranslation()

    var counter = 0
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={'blur'}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{t('rebalancingModal.header')}</ModalHeader>
                        <ModalBody>
                            <div className="w-full text-center flex flex-col justify-center">
                                {   
                                    doRebalance(accountTypes, investmentByType, parseInt(investmentSum)).map(transaction => {
                                        return transaction.toBuy === 0 ? "" : counter++ && <li key={transaction.key}>{transaction.name} {t('rebalancingModal.toBuy')} {transaction.toBuy}. {t('rebalancingModal.newValue')} {transaction.newSum}</li>
                                    })
                                }
                                {counter === 0 ? t('rebalancingModal.noRebalancing') : ""}
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