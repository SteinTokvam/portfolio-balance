import { Button, Chip, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import  { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function NewsMessageModalContent({ messageId }: { messageId: string | undefined }) {
    const { t } = useTranslation()
    const [newsMessage, setNewsMessage] = useState<any>({})

    useEffect(() => {
        if (!messageId) return
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
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    function formatMessage(message: string) {
        if (!message) return
        if (message.includes('\n') && !message.includes('|')) {
            return message.split('\n').map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)
        } else if (message.includes('|')) {
            return message.replaceAll('  ', '\u00A0').split('\n').map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)
        }
    }
    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="text-left sm:w-3/4 sm:mx-auto">{newsMessage.title}</ModalHeader>
                    <ModalBody>
                        <div className="text-left sm:w-3/4 sm:mx-auto">
                            {newsMessage.publishedTime && <h2 className="text-sm font-bold">{newsMessage.publishedTime}</h2>}
                            {newsMessage.category && newsMessage.category.map((category: any, index: number) => <Chip variant="flat" key={index} color="primary" className="p-2 mb-2">{category.category_no}</Chip>)}
                            {newsMessage.body && formatMessage(newsMessage.body)}
                        </div>
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