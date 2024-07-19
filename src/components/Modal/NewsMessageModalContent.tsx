import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function NewsMessageModalContent({ messageId }: { messageId: string | undefined}) {
    const { t } = useTranslation()
    const [newsMessage, setNewsMessage] = useState<any>({})

    useEffect(() => {
        if(!messageId) return
        fetch('https://portfolio-balance-backend.onrender.com/newsweb/message',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messageId
                })
            })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                setNewsMessage(res)
            })
    }, [])

    function formatMessage(message: string) {
        if(!message) return
        console.log(message)
        if(message.includes('\n')) {
            return message.replaceAll(' ', '\u00A0').split('\n').map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)
        }
    }
return (
    <ModalContent>
        {(onClose) => (
            <>
                <ModalHeader>{newsMessage.title}</ModalHeader>
                <ModalBody>
                    {newsMessage.body && formatMessage(newsMessage.body)}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="light" onPress={() => {
                        onClose()
                    }}>
                        {t('general.closeButton')}
                    </Button>
                </ModalFooter>
            </>
        )}
    </ModalContent>
)
}