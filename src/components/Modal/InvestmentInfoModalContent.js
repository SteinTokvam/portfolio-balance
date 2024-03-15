import { Button, ModalContent, ModalHeader, ModalBody, ModalFooter, Avatar, Spacer } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { deleteInvestment } from '../../actions/investments';
import DeleteIcon from '../../icons/DeleteIcon';
import CompanyIcon from '../../icons/CompanyIcon';
import { findAccountType } from "../../Util/Formatting";

export default function InvestmentInfoModalContent({children}) {

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
            console.log(foundInvestment[0])
        } else {
            setInvestmentToView({})
        }
    }, [investments, investmentToEdit])

    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes);

    const totalValueByType = accountTypes.map(accountType => {
        return { accountType: accountType.key, value: investments.filter(investment => investment.type === accountType.key).reduce((sum, investment) => sum + investment.value, 0) }
    });

    function handleDelete() {
        dispatch(deleteInvestment(investmentToEdit))
      }

      function calulatePercentageByType() {
        if(Object.keys(investmentToView).length === 0) {
            return 0
        }
        const accountType = totalValueByType.filter(elem => elem.accountType === investmentToView.type)[0]
        const res = (investmentToView.value / accountType.value * 100).toFixed(2)
        return res
      }

    return (
            <ModalContent>
                {(onCloseInfo) => (
                    <>
                        <ModalHeader className="justify-between">
                            <div className="flex gap-5">
                                <Avatar isBordered showFallback radius="full" size="md" src={investmentToView !== undefined && investmentToView.name !== undefined && `https://logo.uplead.com/${investmentToView.name.split(' ')[0].toLowerCase()}.no`} fallback={<CompanyIcon />} />
                                {
                                    //TODO: for å bruke logoer fra uplead.com så må jeg lenke til de der jeg bruker de
                                }
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-semibold leading-none text-default-600">{investmentToView.name}</h4>
                                    <h5 className="text-small tracking-tight text-default-400">{investmentToView.account}</h5>
                                </div>
                            </div>
                            {children}
                        </ModalHeader>
                        <ModalBody>
                            <div className='grid grid-cols-2 gap-5 justify-between'>
                                <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.type')}</h4>
                                <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.value')}</h4>
                                <b>{findAccountType(investmentToView.type, accountTypes)}</b>
                                <b>{investmentToView.value}{t('valuators.currency')}</b>
                                <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.currentPercentage')}</h4>
                                <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.goalPercentage')}</h4>
                                <b>{calulatePercentageByType()}{t('valuators.percentage')}</b>
                                <b>{investmentToView.percentage}{t('valuators.percentage')}</b>
                                <Spacer y={4} />
                            </div>
                            <div>
                            <h4 className="text-small font-semibold leading-none text-default-600">{t('investmentInfoModal.note')}</h4>
                            <small>{investmentToView.note}</small>
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
    )
}