import { useEffect, useMemo, useState } from "react";
import { Button, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import { calculateValue, getTransactionsFromFiri } from "../Util/Firi";
import { useDispatch } from "react-redux";
import { deleteAccount, deleteTransaction, importTransactions } from "../actions/accounts";
import { UploadIcon } from "../icons/UploadIcon";
import EmptyModal from "./Modal/EmptyModal";
import ImportTransactionsModalContent from "./Modal/ImportTransactionsModalContent";
import { useTranslation } from "react-i18next";
import NewTransactionModalContent from "./Modal/NewTransactionModalContent";
import { getHoldings, setTotalValues } from "../Util/Global";
import DeleteButton from "./DeleteButton";
import { fetchHoldings, fetchTransactions } from "../Util/Kron";
import { updateHoldings } from "../actions/holdings";

export default function TransactionsTable({ account, isDark, children }) {

    const { t } = useTranslation()

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });

    const dispatch = useDispatch()

    const { onOpen, isOpen, onOpenChange } = useDisclosure();

    const [modalContent, setModalContent] = useState(<></>)

    const sortedItems = useMemo(() => {
        return [...account.transactions].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            var cmp = 0
            if (sortDescriptor.column === 'amount') {
                cmp = parseFloat(first) < parseFloat(second) ? -1 : parseFloat(first) > parseFloat(second) ? 1 : 0;
            } else {
                cmp = first < second ? -1 : first > second ? 1 : 0;
            }

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, account]);


    const getColumns = (account) => {
        const accountType = account.accountType
        if (!account.isManual && account.name === 'Kron') {
            return [
                { key: 'name', label: t('transactionsTable.name') },
                { key: 'cost', label: t('transactionsTable.cost') },
                { key: 'type', label: t('transactionsTable.type') },
                { key: 'date', label: t('transactionsTable.date') },
            ]
        }
        switch (accountType) {
            case 'Obligasjon':
                return [
                    { key: 'name', label: t('transactionsTable.name') },
                    { key: 'cost', label: t('transactionsTable.cost') },
                    { key: 'type', label: t('transactionsTable.type') },
                    { key: 'date', label: t('transactionsTable.date') },
                    { key: 'action', label: 'Action' }
                ];
            default:
                return account.isManual ? [
                    { key: 'name', label: t('transactionsTable.name') },
                    { key: 'cost', label: t('transactionsTable.cost') },
                    { key: 'type', label: t('transactionsTable.type') },
                    { key: 'equityPrice', label: t('transactionsTable.equityPrice') },
                    { key: 'equityShare', label: t('transactionsTable.equityShare') },
                    { key: 'date', label: t('transactionsTable.date') },
                    { key: 'action', label: 'Action' }
                ] :
                    [
                        { key: 'name', label: t('transactionsTable.name') },
                        { key: 'cost', label: t('transactionsTable.cost') },
                        { key: 'type', label: t('transactionsTable.type') },
                        { key: 'equityPrice', label: t('transactionsTable.equityPrice') },
                        { key: 'equityShare', label: t('transactionsTable.equityShare') },
                        { key: 'date', label: t('transactionsTable.date') }
                    ];
        }
    }


    useEffect(() => {
        if (account.isManual) {
            return
        }

        async function fetchData() {
            if (account.name === 'Firi') {
                const transactions = await getTransactionsFromFiri(account.apiInfo.accessKey).then(orders => {
                    if (orders.name === "ApiKeyNotFound") {
                        return ["FEIL"]
                    }
                    const allCurrencies = [...new Set(orders.map(order => order.currency))]
                    const valueOfCurrency = calculateValue(orders, allCurrencies)
                    return { allCurrencies, valueOfCurrency, orders }
                })

                if (transactions[0] === "FEIL") {
                    return
                }

                const allMatches = transactions.orders
                    .filter(order => order.type === 'Match')

                const allTransactions = transactions.orders
                    .filter(order => order.currency !== 'NOK')
                    .filter(order => order.type !== 'Stake' && order.type !== 'InternalTransfer')
                    .map(transaction => {
                        const matchedTransaction = allMatches.filter(match => match.date === transaction.date)[0]
                        const dateString = transaction.date.toString().split('.')[0].split('T')
                        const date = dateString[0] + ' ' + dateString[1]
                        return {
                            key: transaction.id,
                            name: transaction.currency,
                            equityShare: parseFloat(transaction.amount),
                            date,
                            type: transaction.type,
                            equityPrice: matchedTransaction ?
                                ((1 / parseFloat(transaction.amount)) * parseFloat(matchedTransaction.amount) * -1).toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }) :
                                "N/A",
                            cost: matchedTransaction ? parseFloat(parseFloat(matchedTransaction.amount).toFixed(2)) : 0
                        }
                    })

                const holdings = getHoldings(allTransactions, account)

                console.log("Fetched transactions.")
                console.log(holdings)
                dispatch(importTransactions({ key: account.key, transactions: allTransactions }))
                Promise.all(setTotalValues(account, holdings)).then(holdings => dispatch(updateHoldings(holdings)))
            } else if (account.name === 'Kron') {
                const transactions = await fetchTransactions(account)
                const holdings = await fetchHoldings(account)

                dispatch(importTransactions({ key: account.key, transactions }))
                Promise.all(setTotalValues(account, holdings)).then(holdings => dispatch(updateHoldings(holdings.map(holding => { return { ...holding, accountKey: account.key } }))))
            }
        }

        if (account.apiInfo.accessKey === "") {
            return
        }
        fetchData()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    function handleOpen(type, account) {
        switch (type) {
            case 'import':
                setModalContent(<ImportTransactionsModalContent account={account} />)
                break
            case 'transaction':
                setModalContent(<NewTransactionModalContent account={account} />)
                break
            default:
                setModalContent(<ImportTransactionsModalContent accountKey={account} />)
                break
        }
        onOpen()
    }

    function renderCell(item, columnKey) {
        switch (columnKey) {
            case 'action':
                return <DeleteButton handleDelete={() => {
                    /***
                     * TODO: Update holdings
                     * om verdi er større enn 0, oppdater verdi for holding. om verdi er lik 0, slett holding.
                     */
                    Promise.all(setTotalValues(account, getHoldings(account.transactions.filter(transaction => transaction.key !== item.key), account))).then(holdings => {
                        dispatch(updateHoldings(holdings, account.key))
                    })
                    dispatch(deleteTransaction(item.key, account.key))
                }
                } buttonText={t('transactionsTable.deleteTransaction')} isDark={isDark} />
            default:
                return getKeyValue(item, columnKey)
        }
    }

    return (
        <div>
            {account.type === 'Kryptovaluta' ?
                <div className="flex justify-end">
                    <DeleteButton handleDelete={() => dispatch(deleteAccount(account.key))} buttonText={t('transactionsTable.deleteAccount')} isDark={isDark} />
                </div> :
                <div className="flex flex-col justify-between sm:flex-row">
                    <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true}>
                        {modalContent}
                    </EmptyModal>
                    <Button color="primary" variant="bordered" onPress={() => handleOpen('import', account)} size="lg" className="m-2">
                        {t('importTransactionsModal.title')} <UploadIcon />
                    </Button>
                    <Button color="primary" variant="bordered" onPress={() => handleOpen('transaction', account)} size="lg" className="m-2">
                        {t('transactionsTable.newTransaction')}
                    </Button>
                    <DeleteButton handleDelete={() => dispatch(deleteAccount(account.key))} buttonText={t('transactionsTable.deleteAccount')} isDark={isDark} />
                </div>
            }

            <Spacer y={4} />
            {children &&
                <>
                    {children}
                    <Spacer y={4} />
                </>}
            <Table
                isStriped
                aria-label={"konto"}
                className="text-foreground"
                selectionMode="none"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={getColumns(account)}>
                    {(column) => {
                        if (column.key === 'date' || column.key === 'type' || column.key === 'fund_name' || column.key === 'amount') {
                            return <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>
                        }
                        return <TableColumn key={column.key}>{column.label}</TableColumn>
                    }}
                </TableHeader>
                <TableBody classNames="text-left" items={sortedItems}
                    emptyContent={"Ingen transaksjoner enda"}>
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}