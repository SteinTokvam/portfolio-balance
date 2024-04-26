import React from "react";
import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer } from "@nextui-org/react"
import { useTranslation } from "react-i18next";



export default function SupportModalContent() {
    const { t } = useTranslation()

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">{t('supportDevelopment.header')}</ModalHeader>
                    <ModalBody>
                        <div className="w-full text-left flex flex-col justify-center">
                            <p>{t('supportDevelopment.ethAdress')}: 0x4EEe0c763148b898E343C8013983246CE85b34FC</p>
                            <Spacer y={2} />

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={onClose}>
                            {t('general.closeButton')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}