import { Button, useDisclosure, Spacer } from '@nextui-org/react';
import NewInvestmentModal from './NewInvestmentModal';

export default function NewInvestment() {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
      <>
        <Spacer y={4} />
        <Button onPress={onOpen} color='primary'>+</Button>
        <NewInvestmentModal isOpen={isOpen} onOpenChange={onOpenChange} isEdit={false}/>
      </>
    )
}