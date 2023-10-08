import { Spacer, Tab, Tabs } from "@nextui-org/react";
import InvestmentTable from "./InvestmentTable";
import Statistics from "./Statistics";
import NewInvestment from "./NewInvestment";
import AccountsTable from "./AccountsTable";
import { GraphIcon } from "../icons/GraphIcon";
import AccountTypeIcon from "../icons/AccountTypeIcon";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";


export default function Portfolio() {
    const { t } = useTranslation();

    const [isInvestment, setIsInvestment] = useState(true);

    const [selected, setSelected] = useState("investments");

    useEffect(() => {
        setIsInvestment(selected === "investments");
    }, [selected]);

    return (
        <>
            <div className='w-full mx-auto text-center'>
                <NewInvestment isInvestment={isInvestment}/>
                <Spacer y={4} x={4} />
            </div>
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
                        <div className="flex flex-col md:flex-row">
                            <InvestmentTable />
                            <Spacer y={4} x={4} />
                            <Statistics />
                            <Spacer y={4} x={4} />
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