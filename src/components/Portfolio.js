import { Accordion, AccordionItem, Avatar, Button, Spacer, Tab, Tabs } from "@nextui-org/react";
import Statistics from "./Statistics";
import NewInvestment from "./NewInvestment";
import AccountsTable from "./AccountsTable";
import { GraphIcon } from "../icons/GraphIcon";
import AccountTypeIcon from "../icons/AccountTypeIcon";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AccountsWithTransactions from "./AccountsWithTransactions";
import { useSelector } from "react-redux";
import AddAccountImportButtons from "./AddAccountImportButtons";
import CompanyIcon from "../icons/CompanyIcon";


export default function Portfolio() {
    const { t } = useTranslation();

    const [isInvestment, setIsInvestment] = useState(true);

    const [selected, setSelected] = useState("investments");

    const accounts = useSelector(state => state.rootReducer.accounts.accounts);

    useEffect(() => {
        setIsInvestment(selected === "investments");
    }, [selected]);

    return (
        <>
            <div>
                <Tabs
                    aria-label="Investments"
                    color="primary"
                    variant="ghost"
                    fullWidth={true}
                    selectedKey={selected}
                    onSelectionChange={setSelected}>
                    <Tab
                        key="investments"
                        title={
                            <div className="flex items-center space-x-2">
                                <GraphIcon />
                                <span>{t('portfolio.investmentsTab')}</span>
                            </div>
                        }
                    >
                        <div className="flex flex-col space-y-4">
                            <AddAccountImportButtons onlyShowAddAccount={accounts.length === 0} />
                            {accounts.length > 0 ?
                                accounts.map(account => {
                                    return (
                                        <>
                                            <Accordion key={account.key} >
                                                <AccordionItem aria-label="Accordion" 
                                                title={account.name} 
                                                startContent={
                                                    <Avatar isBordered showFallback radius="full" size="md" src={`https://logo.uplead.com/${account.name.toLowerCase()}.no`} fallback={<CompanyIcon />} />
                                                }
                                                subtitle={account.type}
                                                >
                                                    <AccountsWithTransactions account={account} />
                                                </AccordionItem>
                                            </Accordion>
                                        </>
                                    )
                                })
                                :
                                ""
                            }
                            {
                                /*accounts.length > 0 ?
                                    <Statistics />
                                    :
                                    ""
                                    */
                            }


                        </div>
                    </Tab>
                    <Tab
                        key="accounts"
                        title={
                            <div className="flex items-center space-x-2">
                                <AccountTypeIcon />
                                <span>{t('portfolio.accountTypesTab')}</span>
                            </div>
                        }
                    >
                        <AccountsTable />
                    </Tab>
                </Tabs>
            </div>

        </>
    )
}