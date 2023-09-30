import { Spacer } from "@nextui-org/react";
import InvestmentTable from "./InvestmentTable";
import Statistics from "./Statistics";
import NewInvestment from "./NewInvestment";


export default function Portfolio() {
    return (
        <>
            <div className='w-full mx-auto text-center'>
                <NewInvestment />
                <Spacer y={4} x={4}/>
            </div>
            <div className="flex flex-col md:flex-row">
                <InvestmentTable />
                <Spacer y={4} x={4} />
                <Statistics />
                <Spacer y={4} x={4} />
            </div>
        </>
    )
}