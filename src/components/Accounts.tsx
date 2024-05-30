import React from "react";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Skeleton } from "@nextui-org/react";
import { useSelector } from "react-redux";
import AccountButton from "./AccountButton";
import CompanyIcon from "../icons/CompanyIcon";
import { routes } from "../Util/Global";
import { Account, Holding } from "../types/Types";
import { AccountTypeModalContent } from "./Modal/AccountTypeModalContent";
import { useNavigate } from "react-router-dom";
import Holdings from "./Holdings";

export default function Accounts() {

    // @ts-ignore
    const accounts = useSelector(state => state.rootReducer.accounts.accounts);

    // @ts-ignore
    const holdings = useSelector(state => state.rootReducer.holdings.holdings);

    const navigate = useNavigate()

    return (
        <div>
            <div className="space-y-4">
                <AccountButton isEdit={false}>
                    <AccountTypeModalContent isEdit={false} />
                </AccountButton>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:w-1/2 sm:mx-auto">
                    {accounts.length > 0 ?

                        accounts.toSorted((a: Account, b: Account) => a.name.localeCompare(b.name)).map((account: Account) => {
                            return (
                                <Card
                                    aria-label="Card"
                                    title={account.name}
                                    key={account.key} className="items-center justify-center"
                                >
                                    <CardHeader className="justify-between">
                                        <div className="grid gap-5">
                                            <Avatar isBordered radius="full" size="md" src={`https://logo.uplead.com/${account.name.toLowerCase()}.no`} fallback={<CompanyIcon />} />
                                            <div className="grid grid-col gap-1 items-start justify-center">
                                                <h4 className="text-small font-semibold leading-none text-default-600">{account.name}</h4>
                                                <h5 className="text-small tracking-tight text-default-400">{account.type}</h5>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="px-3 py-0 text-small text-default-400">
                                        <div className="max-w-full grid grid-row justify-between">
                                            <div className="grid grid-col">
                                                <div>
                                                    <p className="text-default-800 font-bold">
                                                        <Skeleton
                                                            className="rounded-lg"
                                                            isLoaded={
                                                                holdings
                                                                    .filter((totalValue: Holding) => totalValue.accountKey === account.key)
                                                                    .reduce((sum: number, item: Holding) => sum + item.value, 0) > 0
                                                            }>
                                                            {
                                                                holdings.filter((totalValue: Holding) => totalValue.accountKey === account.key).reduce((sum: number, item: Holding) => sum + item.value, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                                            }
                                                        </Skeleton>
                                                    </p>
                                                </div>
                                                <Holdings account={account} />
                                            </div>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <Button className="w-full" onClick={() => navigate('/' + routes.account.split('/')[1] + '/' + account.key)}>Se mer</Button>
                                    </CardFooter>
                                </Card>
                            )
                        })

                        :
                        ""
                    }
                </div>
            </div>
        </div>
    )
}
