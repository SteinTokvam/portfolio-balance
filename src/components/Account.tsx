import { useState } from "react";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Spinner, getKeyValue, useDisclosure, Tabs, Tab, Image } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { UploadIcon } from "../icons/UploadIcon";
import EmptyModal from "./Modal/EmptyModal";
import ImportTransactionsModalContent from "./Modal/ImportTransactionsModalContent";
import { useTranslation } from "react-i18next";
import NewTransactionModalContent from "./Modal/NewTransactionModalContent";
import DeleteButton from "./DeleteButton";
import { Account, Holding, Transaction } from "../types/Types";
import AccountButton from "./AccountButton";
import { AccountTypeModalContent } from "./Modal/AccountTypeModalContent";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../Util/Global";
import Holdings from "./Holdings";
import DevelopmentGraph from "./DevelopmentGraph";
import NewsMessageModalContent from "./Modal/NewsMessageModalContent";
import { useAccounts } from "../hooks/useAccounts";
import { useTransactions } from "../hooks/useTransactions";
import { useholdings } from "../hooks/useHoldings";
import { useKronDevelopment } from "../hooks/useKronDevelopment";
import { supabase } from "../supabaseClient";
import { deleteAccountSupabase, deleteTransactionSupabase } from "../Util/Supabase";

export default function AccountView() {

    const { t } = useTranslation()
    const { accountKey } = useParams();
    const navigate = useNavigate()

    const { accounts, loading: loadingAccounts } = useAccounts(accountKey)
    var account: Account = loadingAccounts ? {} as Account : accounts[0]
    const { transactions, transactionsByAccount, loading: loadingTransactions } = useTransactions()
    const { holdings, loading: loadingHoldings } = useholdings([account], transactions)
    const { kronDevelopment, loading: loadingKron } = useKronDevelopment(account)

    const { onOpen, isOpen, onOpenChange } = useDisclosure();
    const [modalContent, setModalContent] = useState(<></>)

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

    function handleOpen(type: string, account: Account | undefined, messageId?: string) {
        switch (type) {
            case 'import':
                if (account) {
                    setModalContent(<ImportTransactionsModalContent account={account} supabase={supabase} />)
                }
                break
            case 'transaction':
                if (account) {
                    setModalContent(<NewTransactionModalContent account={account} supabase={supabase} />)
                }
                break
            case 'news':
                setModalContent(<NewsMessageModalContent messageId={messageId} />)
                break;
            default:
                if (account) {
                    setModalContent(<ImportTransactionsModalContent account={account} supabase={supabase} />)
                }
                break
        }
        onOpen()
    }

    function renderCell(item: Transaction, columnKey: string | number) {
        switch (columnKey) {
            case 'action':
                return <DeleteButton handleDelete={() => {
                    deleteTransactionSupabase(supabase, item.transactionKey)
                }}
                    buttonText={t('transactionsTable.deleteTransaction')}
                    isDark={false}
                    showText={false} />
            case 'name':
                return item.type === 'FEE' ? item.name = 'Fee' : item.name
            case 'cost':
                return item.cost.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
            default:
                return getKeyValue(item, columnKey)
        }
    }

    function getYield() {
        const yieldTransactions = transactionsByAccount.get(account?.key)
            ?.filter((transaction: Transaction) => transaction.type === 'YIELD')
        return !loadingTransactions && yieldTransactions && yieldTransactions.length > 0 ?
            <div className="p-4">
                <p className="text-default-600">Avkastning</p>
                <p className="text-default-800 font-bold">
                    {
                        transactionsByAccount.get(account?.key)
                            ?.filter((transaction: Transaction) => transaction.type === 'YIELD' || transaction.type === 'DIVIDEND')
                            .reduce((acc: number, cur: Transaction) => acc + cur.cost, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                    }
                </p>
            </div>
            : ''
    }

    return (
        <div className="sm:w-2/3 sm:mx-auto">
            {account && !account.isManual ?
                <div className="flex justify-end">
                    <AccountButton isEdit={true}>
                        <AccountTypeModalContent isEdit={true} account={account} supabase={supabase} />
                    </AccountButton>
                    <DeleteButton handleDelete={() => {
                        deleteAccountSupabase(supabase, account.key)
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
                        <AccountTypeModalContent isEdit={true} account={account} supabase={supabase} />
                    </AccountButton>
                    <DeleteButton handleDelete={() => {
                        deleteAccountSupabase(supabase, account.key)
                        navigate(routes.portfolio)
                    }}
                        buttonText={t('transactionsTable.deleteAccount')}
                        isDark={false}
                        showText={false} />
                </div>
            }

            <div className="text-center">
                <h1 className="text-default-800 font-bold text-xl">{account && account.name}</h1>
                <h1 className="text-default-800 font-bold text-3xl">{account && holdings.reduce((a: number, b: Holding) => b.value ? a + b.value : 0, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}</h1>
            </div>
            {
                !loadingKron ? <DevelopmentGraph data={kronDevelopment} /> :
                    <Image
                        src='https://via.assets.so/img.jpg?w=800&h=600&tc=blue&bg=#cecece&t=placeholder'
                        alt="logo"
                    />
            }

            {!loadingTransactions && !loadingHoldings &&
                <>
                    <div className="grid grid-cols-2 py-4">
                        <div className="p-4">
                            <p className="text-default-600">Antall transaksjoner</p>
                            <p className="text-default-800 font-bold">{transactionsByAccount.get(account?.key)?.length}</p>
                        </div>
                        <div className="p-4">
                            <p className="text-default-600">Antall verdipapirer</p>
                            <p className="text-default-800 font-bold">{holdings.length}</p>
                        </div>
                        {
                            account && account.name === 'Firi' ?
                                <div className="p-4">
                                    <p className="text-default-600">Staking reward</p>
                                    <p className="text-default-800 font-bold">
                                        {
                                            transactionsByAccount.get(account?.key)
                                                ?.filter((transaction: Transaction) => transaction.type === 'StakingReward')
                                                .reduce((acc: number, cur: Transaction) => acc + cur.cost, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                        }
                                    </p>
                                </div>
                                : ''
                        }
                        {
                            getYield()
                        }
                    </div>


                    <Tabs classNames={{
                        tabList: "gap-6 w-full relative rounded-lg p-1",
                        tab: "w-24 px-4 h-12",
                    }}>
                        <Tab key="Holdings" title="Holdings" className="w-full">
                            <Holdings holdings={holdings} isKron={account && account.name === 'Kron'} />
                        </Tab>
                        <Tab key="Transactions" title="Transactions" className="w-full">
                            <Table
                                isStriped
                                aria-label={"konto"}
                                className="text-foreground"
                                selectionMode="none"
                            >
                                <TableHeader columns={getColumns(account)}>
                                    {(column: { key: string; label: any; }) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                </TableHeader>
                                {

                                    <TableBody className="text-left" items={transactionsByAccount.get(account?.key)?.sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                                        emptyContent={account && !account.isManual ? <Spinner /> : <p>Ingen transaksjoner enda</p>}
                                    >
                                        {(item: Transaction) => (
                                            <TableRow key={item.transactionKey}>
                                                {(columnKey: string | number) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                }
                            </Table>
                        </Tab>
                    </Tabs>
                </>
            }
        </div>
    )
}