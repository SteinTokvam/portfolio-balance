import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Avatar, useDisclosure } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import EditIcon from '../icons/EditIcon';
import InvestmentModal from './InvestmentModal';
import { useEffect, useState } from 'react';
import { deleteInvestment } from '../actions/investments';
import DeleteIcon from '../icons/DeleteIcon';

export default function InvestmentInfoModal({ isOpenInfo, onOpenChangeInfo, isEdit }) {

    const { t } = useTranslation();
    const dispatch = useDispatch()

    const investmentToEdit = useSelector(state => state.rootReducer.investments.investmentToEdit)
    const investments = useSelector(state => state.rootReducer.investments.investments);

    const [investmentToView, setInvestmentToView] = useState({})

    useEffect(() => {
        if (investmentToEdit === undefined) {
            return
        }
        const foundInvestment = investments.filter(investment => investment.key === investmentToEdit.key)

        if (foundInvestment.length !== 0) {
            setInvestmentToView(foundInvestment[0])
        } else {
            setInvestmentToView({})
        }
    }, [investments, investmentToEdit])

    var totalValue = investments.reduce((sum, investment) => sum + investment.value, 0)

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function handleDelete() {
        dispatch(deleteInvestment(investmentToEdit))
      }

    return (
        <Modal isOpen={isOpenInfo} onOpenChange={onOpenChangeInfo} backdrop='blur' scrollBehavior='inside' hideCloseButton={true}>

            <ModalContent>
                {(onCloseInfo) => (
                    <>
                        <InvestmentModal isOpen={isOpen} onOpenChange={onOpenChange} isEdit={true} />
                        <ModalHeader className="justify-between">
                            <div className="flex gap-5">
                                <Avatar isBordered radius="full" size="md" src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Yara_International_%28emblem%29.svg/1280px-Yara_International_%28emblem%29.svg.png" />
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-semibold leading-none text-default-600">{investmentToView.name}</h4>
                                    <h5 className="text-small tracking-tight text-default-400">{investmentToView.account}</h5>
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
                                Edit
                            </Button>
                        </ModalHeader>
                        <ModalBody>
                            <div className='grid grid-cols-2 gap-5 justify-between'>
                                <h4 className="text-small font-semibold leading-none text-default-600">Type:</h4>
                                <h4 className="text-small font-semibold leading-none text-default-600">Verdi:</h4>
                                <b>{investmentToView.type}</b>
                                <b>{investmentToView.value}Kr</b>
                                <h4 className="text-small font-semibold leading-none text-default-600">Nåværende prosent:</h4>
                                <h4 className="text-small font-semibold leading-none text-default-600">Målprosent:</h4>
                                <b>{(investmentToView.value / totalValue * 100).toFixed(2)}%</b>
                                <b>{investmentToView.percentage}%</b>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button isIconOnly color="danger" variant="solid" onPress={() => {
                                onCloseInfo()
                                handleDelete()
                            }}>
                                <DeleteIcon />
                            </Button>
                            <Button color="primary" variant="light" onPress={onCloseInfo}>
                                {t('investmentModal.close')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>

    )
}