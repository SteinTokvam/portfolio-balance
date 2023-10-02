import { Link } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation()
    return (
        <footer class="rounded-lg shadow m-4 dark:bg-gray-800">
            <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date().getFullYear()} Portfolio Rebalancer</span>
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