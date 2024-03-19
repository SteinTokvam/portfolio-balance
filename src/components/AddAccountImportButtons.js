import { Button, useDisclosure } from "@nextui-org/react";
import EmptyModal from "./Modal/EmptyModal";
import ImportTransactionsModalContent from "./Modal/ImportTransactionsModalContent";
import { NewAccountTypeModalContent } from "./Modal/NewAccountTypeModalContent";
import { useState } from "react";


export default function AddAccountImportButtons({ onlyShowAddAccount = false }) {

    const [isImport, setIsImport] = useState(false)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function openCorrectModal(isImport) {
        if (isImport) {
            setIsImport(true)
        } else {
            setIsImport(false)
        }
        onOpen()
    }

    return (
        <>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false}>
                {isImport ? <ImportTransactionsModalContent /> : <NewAccountTypeModalContent />}
            </EmptyModal>
            <div className='w-full mx-auto text-center flex flex-col justify-center space-y-4 space-x-0 lg:flex-row lg:space-x-4 lg:space-y-0'>
                {onlyShowAddAccount ?
                    <Button color="primary"
                        onPress={() => openCorrectModal(false)}>
                        Legg til konto
                    </Button> :
                    <>
                        <Button color="primary"
                            onPress={() => openCorrectModal(false)}>
                            Legg til konto
                        </Button>
                        <Button color="primary"
                            onPress={() => openCorrectModal(true)}>
                            Importer transaksjoner
                        </Button>
                    </>
                }
            </div>
        </>
    )
}