import { Button, useDisclosure } from "@nextui-org/react";
import EmptyModal from "./Modal/EmptyModal";
import { NewAccountTypeModalContent } from "./Modal/NewAccountTypeModalContent";


export default function AddAccountButton() {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true} >
                <NewAccountTypeModalContent />
            </EmptyModal>
            <div className='w-2/3 mx-auto text-center flex flex-col justify-center space-y-4 space-x-0 lg:flex-row lg:space-x-4 lg:space-y-0'>
                <Button color="primary"
                    onPress={onOpen}
                    endContent={<h1 className="text-xl font-bold">+</h1>}>
                    Legg til konto
                </Button>
            </div>
        </>
    )
}