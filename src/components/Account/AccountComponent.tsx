import { useEffect, useMemo, useState } from "react";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Spinner, getKeyValue, useDisclosure, Tabs, Tab, Image, SortDescriptor } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, deleteTransaction, initSupabaseData } from "../../actions/accounts";
import { UploadIcon } from "../../icons/UploadIcon";
import EmptyModal from "../Modal/EmptyModal";
import ImportTransactionsModalContent from "./ImportTransactionsModalContent";
import { useTranslation } from "react-i18next";
import NewTransactionModalContent from "./NewTransactionModalContent";
import DeleteButton from "./DeleteButton";
import { Account, Holding, KronDevelopment, State, Transaction } from "../../types/Types";
import AccountButton from "./AccountButton";
import { AccountTypeModalContent } from "./AccountTypeModalContent";
import { addHoldings, deleteHoldingsForAccount } from "../../actions/holdings";
import { fetchKronDevelopment } from "../../Util/Kron";
import { useNavigate, useParams } from "react-router-dom";
import { getAccountsAndHoldings, routes } from "../../Util/Global";
import Holdings from "./Holdings";
import DevelopmentGraph from "./DevelopmentGraph";
import { setEquityTypes } from "../../actions/equityType";

export default function AccountComponent() {

    const { t } = useTranslation()

    const { accountKey } = useParams();

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "date",
        direction: "descending",
    });

    const navigate = useNavigate()

    const account = useSelector((state: State) => state.rootReducer.accounts.accounts).find((account: Account) => account.key === accountKey) as Account

    const holdings = useSelector((state: State) => state.rootReducer.holdings.holdings).filter((holding: Holding) => holding.accountKey === accountKey && holding.value > 0.001)
    const dispatch = useDispatch()
    const { onOpen, isOpen, onOpenChange } = useDisclosure();
    const [modalContent, setModalContent] = useState(<></>)
    const [development, setDevelopment] = useState<KronDevelopment[]>([])

    const sortedItems = useMemo(() => {
        return account ? [...account.transactions].sort((a, b) => {
            // @ts-ignore
            const first = a[sortDescriptor.column !== undefined ? sortDescriptor.column : 'date'];
            // @ts-ignore
            const second = b[sortDescriptor.column !== undefined ? sortDescriptor.column : 'date'];
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
        if (account) {
            fetchKronDevelopment(account)
                .then((development: KronDevelopment[]) => setDevelopment(development))
            return
        }
        getAccountsAndHoldings(accountKey)
            .then((accountsAndHoldings) => {
                dispatch(addHoldings(accountsAndHoldings.holdings))
                dispatch(initSupabaseData(accountsAndHoldings.accounts))
                dispatch(setEquityTypes(accountsAndHoldings.equityTypes))

                fetchKronDevelopment(accountsAndHoldings.accounts[0])
                    .then((development: KronDevelopment[]) => setDevelopment(development))
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleOpen(type: string, account: Account | undefined) {
        switch (type) {
            case 'import':
                if (account) {
                    setModalContent(<ImportTransactionsModalContent account={account} />)
                }
                break
            case 'transaction':
                if (account) {
                    setModalContent(<NewTransactionModalContent account={account} />)
                }
                break
            default:
                if (account) {
                    setModalContent(<ImportTransactionsModalContent account={account} />)
                }
                break
        }
        onOpen()
    }

    function renderCell(item: Transaction, columnKey: string | number) {
        switch (columnKey) {
            case 'action':
                return <DeleteButton handleDelete={() => {
                    dispatch(deleteHoldingsForAccount(account))
                    dispatch(deleteTransaction(item.transactionKey, account.key))
                }}
                    buttonText={t('transactionsTable.deleteTransaction')}
                    isDark={false}
                    showText={false} />
            case 'name':
                return item.type === 'FEE' ? item.name = 'Fee' : item.name
            case 'cost':
                return item.cost.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
            case 'equityPrice':
                return item.equityPrice.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
            default:
                return getKeyValue(item, columnKey)
        }
    }

    return (
        <div className="sm:w-2/3 sm:mx-auto">
            {account && !account.isManual ?
                <div className="flex justify-end">
                    <AccountButton isEdit={true}>
                        <AccountTypeModalContent isEdit={true} account={account} />
                    </AccountButton>
                    <DeleteButton handleDelete={() => {
                        dispatch(deleteAccount(account.key))
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
                        <AccountTypeModalContent isEdit={true} account={account} />
                    </AccountButton>
                    <DeleteButton handleDelete={() => {
                        dispatch(deleteAccount(account.key))
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
                development.length > 0 ? <DevelopmentGraph data={development} /> :
                    <Image
                        src='https://via.assets.so/img.jpg?w=800&h=600&tc=blue&bg=#cecece&t=placeholder'
                        alt="logo"
                    />
            }
            <div className="grid grid-cols-2 py-4">
                <div className="p-4">
                    <p className="text-default-600">Antall transaksjoner</p>
                    <p className="text-default-800 font-bold">{account && account.transactions.length}</p>
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
                                    account.transactions
                                        .filter((transaction: Transaction) => transaction.type === 'StakingReward')
                                        .reduce((acc: number, cur: Transaction) => acc + cur.cost, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                }
                            </p>
                        </div>
                        : ''
                }
                {
                    account && 
                        <div className="p-4">
                            <p className="text-default-600">Avkastning</p>
                            <p className="text-default-800 font-bold">
                                {
                                    account.name === "Kron" && development.length > 0 ? development[development.length-1].yield_in_currency.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                    : holdings.reduce((acc, curr) => acc + curr.yield, 0).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })
                                }
                            </p>
                        </div>
                        
                }
            </div>

            <Tabs classNames={{
                tabList: "gap-6 w-full relative rounded-lg p-1",
                tab: "w-24 px-4 h-12",
            }}>
                <Tab key="Holdings" title="Holdings" className="w-full">
                    <Holdings account={account} />
                </Tab>
                <Tab key="Transactions" title="Transactions" className="w-full">
                    {
                        <Table
                            isStriped
                            aria-label={"konto"}
                            className="text-foreground"
                            selectionMode="none"
                            sortDescriptor={sortDescriptor}
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

                                <TableBody className="text-left" items={sortedItems}
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
                    }
                </Tab>
            </Tabs>
        </div>
    )
}