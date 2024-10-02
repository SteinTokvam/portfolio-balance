import { Link, Button, useDisclosure } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import SupportModalContent from "./Modal/SupportModalContent";
import EmptyModal from "./Modal/EmptyModal";

type Props = {
    isDark: boolean
}

export default function Footer({isDark}: Props) {
    const { t } = useTranslation()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <footer className={`rounded-lg shadow m-4 ${isDark ? 'dark bg-background' : ''}`}>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} size="5xl">
                <SupportModalContent />
            </EmptyModal>
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date().getFullYear()} Portfolio Rebalancer</span>
                <Button color="primary" variant="faded" onPress={onOpen}>{t('footer.supportButton')}</Button>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <Link
                            isExternal
                            href="https://github.com/SteinTokvam/portfolio-balance"
                            showAnchorIcon
                        >
                            {t('footer.github')}
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}