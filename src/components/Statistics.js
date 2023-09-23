import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { GraphIcon } from "../icons/GraphIcon";
import { investmentTypes } from "../Util/Global";

export default function Statistics() {

    const investments = useSelector(state => state.rootReducer.investments.investments);

    const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0);
    return (

        <Card className="max-w-[500px] min-w-[250px] ">
            <CardHeader className="flex gap-3">
                <GraphIcon />
                <div className="flex flex-col">
                <p className="text-md">Statistics</p>
                <p className="text-small text-default-500">Nøkkeltall om dine investeringer.</p>
                </div>
            </CardHeader>
            <Divider/>
            <CardBody>
                <li>Total verdi: {totalValue} kr</li>
                {totalValue > 0 ? investmentTypes.map(investmentType => {
                    const investmentSum = investments.filter(investment => investment.type === investmentType).reduce((sum, investment) => sum + investment.value, 0)
                    return investmentSum > 0 ? <li key={investmentType}>Andel {investmentType}: {((investmentSum/totalValue)*100).toFixed(2)}%</li> : ""
                }): ""}
            </CardBody>
            
        </Card>
        
    );
}