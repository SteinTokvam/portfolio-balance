import { Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import NewInvestment from "./NewInvestment";
import { v4 as uuidv4 } from 'uuid';
import AccountsTable from "./AccountsTable";


export default function Dashboard() {

    const { t } = useTranslation();
    
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <Spacer y={10} />
                <div>
                    <h1 className="text-large font-semibold">Avkastning</h1>
                    Her må jeg vise en graf ellerno med avkastning for investeringer
                </div>
            </div >
        </>
    )
}