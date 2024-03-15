import { Button, useDisclosure, Spacer } from '@nextui-org/react';
import NewInvestmentModalContent from './Modal/NewInvestmentModalContent';
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
        isInvestment ?
          <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false}>
            <NewInvestmentModalContent isEdit={false} />
          </EmptyModal> :
          <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} >
            <NewAccountTypeModalContent isEdit={false} />
          </EmptyModal>
      }
    </>
  )
}