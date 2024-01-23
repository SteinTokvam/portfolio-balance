import { Link, Button, useDisclosure, Spacer } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import SupportModal from "./SupportModal";

export default function Footer() {
    const { t } = useTranslation()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <footer class="rounded-lg shadow m-4 dark:bg-gray-800">
            <SupportModal isOpen={isOpen} onOpenChange={onOpenChange} />
            <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date().getFullYear()} Portfolio Rebalancer</span>
                <Button color="primary" variant="faded" onPress={onOpen}>{t('footer.supportButton')}</Button>
                <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
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