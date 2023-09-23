import { Button, useDisclosure, Spacer } from '@nextui-org/react';
import InvestmentModal from './InvestmentModal';

export default function NewInvestment() {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
      <>
        <Spacer y={4} />
        <Button onPress={onOpen} color='primary'>+</Button>
        <InvestmentModal isOpen={isOpen} onOpenChange={onOpenChange} isEdit={false}/>
      </>
    )
}