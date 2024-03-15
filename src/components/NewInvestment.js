import { Button, useDisclosure, Spacer } from '@nextui-org/react';
import InvestmentModal from './InvestmentModal';
import { useTranslation } from 'react-i18next';
import { NewAccountTypeModalContent } from './Modal/NewAccountTypeModalContent';
import EmptyModal from './Modal/EmptyModal';

export default function NewInvestment({ isInvestment }) {

  const { t } = useTranslation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>

      <Spacer y={4} />
      <Button onPress={onOpen} color='primary'>{t('newInvestment.add')}</Button>
      {
        isInvestment ? <InvestmentModal isOpen={isOpen} onOpenChange={onOpenChange} isEdit={false} /> :
          <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} >
            <NewAccountTypeModalContent isEdit={false} />
          </EmptyModal>
      }
    </>
  )
}