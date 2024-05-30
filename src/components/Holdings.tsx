import React from "react"
import { Account, Holding } from "../types/Types"
import { useSelector } from "react-redux";
import { Skeleton } from "@nextui-org/react";

export default function Holdings({ account }: {account: Account}) {

    // @ts-ignore
    const holdings = useSelector(state => state.rootReducer.holdings.holdings);

    function renderEquityShare(account: Account, holding: Holding): JSX.Element {
        if (account.name === 'Kron') {
            return <p></p>
        } else if (account.name !== 'Firi' && holding.equityType === 'Fund') {
            return <p>{holding.equityShare.toFixed(2)}</p>
        } else if (holding.equityType === 'Loan') {
            return <p></p>
        }
        return <p>{holding.equityShare}</p>
    }

    return (
        <div className="w-full flex flex-wrap border-t border-default-300">
            {
                account && holdings.map((holding: Holding) => {
                    if (holding.accountKey === account.key) {
                        if (holding.value < 1) {
                            return ''
                        }
                        return (
                            <div key={holding.name} className="p-1 ">
                                <p className="text-default-600">{holding.name}</p>
                                <Skeleton className="rounded-lg" isLoaded={holding.value > 0}><p className="text-default-800 font-bold">{holding.value && holding.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</p>
                                    {renderEquityShare(account, holding)}
                                </Skeleton>
                            </div>
                        )
                    }
                    return <></>
                })
            }
        </div>
    )
}