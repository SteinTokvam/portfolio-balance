import { Button, useDisclosure, Spacer } from '@nextui-org/react';
import InvestmentModal from './InvestmentModal';
import { useTranslation } from 'react-i18next';

export default function NewInvestment() {

  const { t } = useTranslation();//trenger i18n for å kunne skfte språk, og t til å hente ut rett tekst. i18n kommer til å ligge på navbar

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
      <>
        <Spacer y={4} />
        <Button onPress={onOpen} color='primary'>{t('newInvestment.add')}</Button>
        <InvestmentModal isOpen={isOpen} onOpenChange={onOpenChange} isEdit={false}/>
      </>
    )
}