import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Spinner, getKeyValue, useDisclosure, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, deleteTransaction, importTransactions } from "../actions/accounts";
import { UploadIcon } from "../icons/UploadIcon";
import EmptyModal from "./Modal/EmptyModal";
import ImportTransactionsModalContent from "./Modal/ImportTransactionsModalContent";
import { useTranslation } from "react-i18next";
import NewTransactionModalContent from "./Modal/NewTransactionModalContent";
import DeleteButton from "./DeleteButton";
import { Account, Transaction } from "../types/Types";
import AccountButton from "./AccountButton";
import { AccountTypeModalContent } from "./Modal/AccountTypeModalContent";
import { deleteHoldingsForAccount } from "../actions/holdings";
import { fetchFiriTransactions } from "../Util/Firi";
import { fetchKronTransactions } from "../Util/Kron";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../Util/Global";
import Holdings from "./Holdings";
import { SupabaseClient } from "@supabase/supabase-js";

export default function TransactionsTable({ supabase }: { supabase: SupabaseClient }) {

    const { t } = useTranslation()

    const { accountKey } = useParams();

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });

    const navigate = useNavigate()

    // @ts-ignore
    const account = useSelector(state => state.rootReducer.accounts.accounts).find((account: Account) => account.key === accountKey)
    const dispatch = useDispatch()
    const { onOpen, isOpen, onOpenChange } = useDisclosure();
    const [modalContent, setModalContent] = useState(<></>)

    const sortedItems = useMemo(() => {
        return account ? [...account.transactions].sort((a, b) => {
            // @ts-ignore
            const first = a[sortDescriptor.column];
            // @ts-ignore
            const second = b[sortDescriptor.column];
            var cmp = 0
            if (sortDescriptor.column === 'amount') {
                cmp = parseFloat(first) < parseFloat(second) ? -1 : parseFloat(first) > parseFloat(second) ? 1 : 0;
            } else {
                cmp = first < second ? -1 : first > second ? 1 : 0;
            }

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        }) : [];
    }, [sortDescriptor, account]);


    const getColumns = (account: Account) => {
        if (!account) {
            return [
                { key: 'name', label: t('transactionsTable.name') },
                { key: 'cost', label: t('transactionsTable.cost') },
                { key: 'type', label: t('transactionsTable.type') },
                { key: 'equityPrice', label: t('transactionsTable.equityPrice') },
                { key: 'equityShare', label: t('transactionsTable.equityShare') },
                { key: 'date', label: t('transactionsTable.date') },
                { key: 'action', label: 'Action' }
            ]
        }
        if (!account.isManual && account.name === 'Kron') {
            return [
                { key: 'name', label: t('transactionsTable.name') },
                { key: 'cost', label: t('transactionsTable.cost') },
                { key: 'type', label: t('transactionsTable.type') },
                { key: 'date', label: t('transactionsTable.date') },
            ]
        } else if (!account.isManual && account.name === 'Firi') {
            return [
                { key: 'name', label: t('transactionsTable.name') },
                { key: 'cost', label: t('transactionsTable.cost') },
                { key: 'type', label: t('transactionsTable.type') },
                { key: 'equityShare', label: t('transactionsTable.equityShare') },
                { key: 'date', label: t('transactionsTable.date') },
            ]
        }
        switch (account.type) {
            case 'Obligasjon':
                return [
                    { key: 'name', label: t('transactionsTable.name') },
                    { key: 'cost', label: t('transactionsTable.cost') },
                    { key: 'type', label: t('transactionsTable.type') },
                    { key: 'date', label: t('transactionsTable.date') },
                    { key: 'action', label: 'Action' }
                ];
            default:
                return [
                    { key: 'name', label: t('transactionsTable.name') },
                    { key: 'cost', label: t('transactionsTable.cost') },
                    { key: 'type', label: t('transactionsTable.type') },
                    { key: 'equityPrice', label: t('transactionsTable.equityPrice') },
                    { key: 'equityShare', label: t('transactionsTable.equityShare') },
                    { key: 'date', label: t('transactionsTable.date') },
                    { key: 'action', label: 'Action' }
                ]
        }
    }

    useEffect(() => {
        if (!account) {
            return
        }
        if (account.isManual) {
            return
        }

        if (!account.apiInfo) {
            return
        }

        if (account.name === 'Firi') {
            fetchFiriTransactions(account, ['NOK'])
                .then((transactions: Transaction[]) => {
                    dispatch(importTransactions(supabase, account.key, transactions))
                })
        } else if (account.name === 'Kron') {
            fetchKronTransactions(account)
                .then((transactions: Transaction[]) => {
                    dispatch(importTransactions(supabase, account.key, transactions))
                })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleOpen(type: string, account: Account) {
        switch (type) {
            case 'import':
                setModalContent(<ImportTransactionsModalContent account={account} supabase={supabase} />)
                break
            case 'transaction':
                setModalContent(<NewTransactionModalContent account={account} supabase={supabase} />)
                break
            default:
                setModalContent(<ImportTransactionsModalContent account={account} supabase={supabase} />)
                break
        }
        onOpen()
    }

    function renderCell(item: Transaction, columnKey: string | number) {
        switch (columnKey) {
            case 'action':
                return <DeleteButton handleDelete={() => {
                    dispatch(deleteHoldingsForAccount(account))
                    dispatch(deleteTransaction(supabase, item.key, account.key))
                }}
                    buttonText={t('transactionsTable.deleteTransaction')}
                    isDark={false}
                    showText={false} />
            case 'cost':
                return item.cost.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
            default:
                return getKeyValue(item, columnKey)
        }
    }

    return (
        <div className="sm:w-1/2 sm:mx-auto">
            <Breadcrumbs className="mx-4">
                <BreadcrumbItem onClick={() => navigate(routes.portfolio)}>accounts</BreadcrumbItem>
                <BreadcrumbItem>{account && account.name}</BreadcrumbItem>
            </Breadcrumbs>
            {account && !account.isManual ?
                <div className="flex justify-end">
                    <AccountButton isEdit={true}>
                        <AccountTypeModalContent isEdit={true} account={account} supabase={supabase} />
                    </AccountButton>
                    <DeleteButton handleDelete={() => {
                        dispatch(deleteAccount(supabase, account.key))
                        console.log("hre")
                        navigate(routes.portfolio)
                    }}
                        buttonText={t('transactionsTable.deleteAccount')}
                        isDark={false}
                        showText={false} />
                </div> :
                <div className="flex flex-col justify-between sm:flex-row">
                    <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true}>
                        {modalContent}
                    </EmptyModal>
                    <Button color="primary" variant="bordered" onPress={() => handleOpen('import', account)} size="lg" className="m-1">
                        {t('importTransactionsModal.title')} <UploadIcon />
                    </Button>
                    <Button color="primary" variant="bordered" onPress={() => handleOpen('transaction', account)} size="lg" className="m-1">
                        {t('transactionsTable.newTransaction')}
                    </Button>
                    <AccountButton isEdit={true}>
                        <AccountTypeModalContent isEdit={true} account={account} supabase={supabase}/>
                    </AccountButton>
                    <DeleteButton handleDelete={() => {
                        dispatch(deleteAccount(supabase, account.key))
                        navigate(routes.portfolio)
                    }}
                        buttonText={t('transactionsTable.deleteAccount')}
                        isDark={false}
                        showText={false} />
                </div>
            }

            <Spacer y={4} />
            <Holdings account={account} />
            {
                <Table
                    isStriped
                    aria-label={"konto"}
                    className="text-foreground"
                    selectionMode="none"
                    // @ts-ignore
                    sortDescriptor={sortDescriptor}
                    // @ts-ignore
                    onSortChange={setSortDescriptor}
                >
                    <TableHeader columns={getColumns(account)}>
                        {(column: { key: string; label: any; }) => {
                            if (column.key === 'date' || column.key === 'type' || column.key === 'fund_name' || column.key === 'amount') {
                                return <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>
                            }
                            return <TableColumn key={column.key}>{column.label}</TableColumn>
                        }}
                    </TableHeader>
                    {
                        // @ts-ignore
                        <TableBody classNames="text-left" items={sortedItems}
                            emptyContent={account && !account.isManual ? <Spinner /> : <p>Ingen transaksjoner enda</p>}
                        >
                            {(item: Transaction) => (
                                <TableRow key={item.key}>
                                    {(columnKey: string | number) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    }
                </Table>
            }
        </div>
    )
}