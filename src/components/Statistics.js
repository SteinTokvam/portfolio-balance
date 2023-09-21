import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { AddIcon } from "../icons/AddIcon";
import { GraphIcon } from "../icons/GraphIcon";

export default function Statistics() {

    const investments = useSelector(state => state.rootReducer.investments.investments);

    const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0);
    return (

        <Card className="max-w-[400px]">
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
                <li>Andel aksjer: {totalValue > 0 ? ((investments.filter(investment => investment.type === "Aksje").reduce((sum, aksjer) => sum + aksjer.value, 0)/totalValue)*100).toFixed(2) : 0}%</li>
                <li>Andel fond: {totalValue > 0 ? ((investments.filter(investment => investment.type === "Fond").reduce((sum, fond) => sum + fond.value, 0)/totalValue)*100).toFixed(2) : 0}%</li>
            </CardBody>
            
        </Card>
        
    );
}