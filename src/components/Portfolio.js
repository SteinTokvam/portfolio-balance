import { Spacer, Tab, Tabs } from "@nextui-org/react";
import InvestmentTable from "./InvestmentTable";
import Statistics from "./Statistics";
import NewInvestment from "./NewInvestment";
import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";
import NewAccountType from "./NewAccountType";
import AccountsTable from "./AccountsTable";


export default function Portfolio() {
    return (
        <>
            <div className='w-full mx-auto text-center'>
                <NewInvestment />
                <Spacer y={4} x={4} />
                <Tabs aria-label="Investments" color="primary" variant="ghost" fullWidth={true}>
                    <Tab
                        key="photos"
                        title={
                            <div className="flex items-center space-x-2">
                                <EditIcon />
                                <span>Investments</span>
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
                                <DeleteIcon />
                                <span>Accounts</span>
                            </div>
                        }
                    >
                        <AccountsTable />
                        <NewAccountType />
                    </Tab>
                </Tabs>
            </div>

        </>
    )
}