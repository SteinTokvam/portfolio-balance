import { useEffect, useMemo, useState } from "react";
import { Button, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import { calculateValue, getTransactionsFromFiri, getValueInFiat } from "../Util/Firi";
import { useDispatch } from "react-redux";
import { importTransactions } from "../actions/accounts";
import { UploadIcon } from "../icons/UploadIcon";
import EmptyModal from "./Modal/EmptyModal";
import ImportTransactionsModalContent from "./Modal/ImportTransactionsModalContent";
import { useTranslation } from "react-i18next";

export default function TransactionsTable({ account, children }) {

    const { t } = useTranslation()

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });

    const dispatch = useDispatch()

    const { onOpen, isOpen, onOpenChange } = useDisclosure();

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

    const columns = [
        { key: 'name', label: t('transactionsTable.name') },
        { key: 'cost', label: t('transactionsTable.cost') },
        { key: 'type', label: t('transactionsTable.type') },
        { key: 'equityPrice', label: t('transactionsTable.equityPrice') },
        { key: 'equityShare', label: t('transactionsTable.equityShare') },
        { key: 'date', label: t('transactionsTable.date') },
    ];

    useEffect(() => {
        if (account.isManual) {
            return
        }

        async function fetchData() {
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

            const valueInFiat = await getValueInFiat(transactions.allCurrencies, account.apiInfo.accessKey)

            const allCrypto = valueInFiat.map((value, i) => {
                return {
                    accountKey: account.key,
                    equityType: "Cryptocurrency",
                    goalPercentage: 0,
                    equityShare: parseFloat(transactions.valueOfCurrency[i].cryptoValue.toFixed(8)),
                    name: transactions.valueOfCurrency[i].currency,
                    fiatValue: parseFloat(parseFloat((transactions.valueOfCurrency[i].cryptoValue) * value.last).toFixed(2)),
                    fiatCurrency: 'NOK',
                    lastPrice: value.last,
                    transactions: transactions.orders
                        .filter(order => order.currency === transactions.valueOfCurrency[i].currency)
                        .filter(order => order.type !== 'Stake' || order.type !== 'InternalTransfer')
                        .map(transaction => {
                            return {
                                key: transaction.id,
                                equityShare: parseFloat(transaction.amount),
                                date: transaction.date,
                                type: transaction.type,
                                equityPrice: 0,
                                cost: 0
                            }
                        })
                }
            }).filter(crypto => crypto.fiatValue > 0)
            const allMatches = transactions.orders
                .filter(order => order.type === 'Match')

            const allTransactions = transactions.orders
                .filter(order => order.currency !== 'NOK')
                .filter(order => order.type !== 'Stake' && order.type !== 'InternalTransfer')
                .map(transaction => {
                    const matchedTransaction = allMatches.filter(match => match.date === transaction.date)[0]

                    return {
                        key: transaction.id,
                        name: transaction.currency,
                        equityShare: parseFloat(transaction.amount),
                        date: transaction.date,
                        type: transaction.type,
                        equityPrice: 0,
                        cost: matchedTransaction ? parseFloat(parseFloat(matchedTransaction.amount).toFixed(2)) : 0
                    }
                })

            console.log("Fetched transactions.")
            dispatch(importTransactions({ key: account.key, transactions: allTransactions, holdings: allCrypto }))
        }

        if (account.apiInfo.accessKey === "") {
            return
        }
        fetchData()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {account.type === 'Cryptocurrency' ? <></> :
                <>
                    <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true}>
                        <ImportTransactionsModalContent accountKey={account.key} />
                    </EmptyModal>
                    <Button color="primary" variant="bordered" onPress={onOpen} size="lg">
                        {t('importTransactionsModal.title')} <UploadIcon />
                    </Button>
                </>
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
                <TableHeader columns={columns}>
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
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}