import React from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import EmptyModal from "../Modal/EmptyModal";
import { useTranslation } from "react-i18next";
import EditIcon from "../../icons/EditIcon";


export default function AccountButton({ isEdit, children }: { isEdit: boolean, children?: React.ReactNode }) {

    const { t } = useTranslation()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true} >
                {children}
            </EmptyModal>
            <div className='w-2/3 mx-auto'>
                <Button color="primary"
                    onPress={onOpen}
                    className="w-full"
                    size="lg"
                    endContent={!isEdit ? <h1 className="text-xl font-bold">+</h1> : <EditIcon />}
                >
                    {isEdit ? t('accountModal.editAccountButton') : t('accountModal.addAccountButton')}
                </Button>
            </div>
        </>
    )
}