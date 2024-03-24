import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { calculateValue, getTransactionsFromFiri, getValueInFiat } from "../Util/Firi";
import { useDispatch } from "react-redux";
import { importTransactions } from "../actions/accounts";
import { UploadIcon } from "../icons/UploadIcon";

export default function TransactionsTable({ account }) {

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });

    const dispatch = useDispatch()

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
        { key: 'name', label: 'Name' },
        { key: 'cost', label: 'Cost' },
        { key: 'type', label: 'Type' },
        { key: 'equityPrice', label: 'Unit Price' },
        { key: 'equityShare', label: 'Number of shares' },
        { key: 'date', label: 'Date' },
    ];

    useEffect(() => {
        if (account.type !== 'Automatic') {
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
                    holdings: {
                        name: transactions.valueOfCurrency[i].currency,
                        accountKey: account.key,
                        equityShare: parseFloat(transactions.valueOfCurrency[i].cryptoValue.toFixed(8)),
                        equityType: "Cryptocurrency",
                        goalPercentage: 0
                    },
                    equityShare: transactions.valueOfCurrency[i].cryptoValue.toFixed(8),
                    name: transactions.valueOfCurrency[i].currency,
                    fiatValue: parseFloat((transactions.valueOfCurrency[i].cryptoValue) * value.last).toFixed(2),
                    fiatCurrency: 'NOK',
                    lastPrice: value.last,
                    transactions: transactions.orders
                        .filter(order => order.currency === transactions.valueOfCurrency[i].currency)
                        .filter(order => order.type !== 'Stake' || order.type !== 'InternalTransfer')
                        .map(transaction => {
                            return {
                                key: transaction.id,
                                equityShare: transaction.amount,
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
                        equityShare: transaction.amount,
                        date: transaction.date,
                        type: transaction.type,
                        equityPrice: 0,
                        cost: matchedTransaction ? parseFloat(parseFloat(matchedTransaction.amount).toFixed(2)) : 0
                    }
                })
            const holdings = allCrypto.map(crypto => crypto.holdings)
            console.log("Fetched transactions.")
            dispatch(importTransactions({ key: account.key, transactions: allTransactions, holdings }))
        }

        if (account.apiInfo.accessKey === "") {
            return
        }
        fetchData()
    }, [])

    const hiddenFileInput = useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    function getHoldings(accountKey, transactions, type) {
        console.log(transactions)
        if (!transactions) {
            return
        }
        const holdings = []
        const uniqueHoldingKeys = [...new Set(transactions.map(transaction => transaction.e24Key))];
        console.log(uniqueHoldingKeys)
        uniqueHoldingKeys.forEach(e24Key => {
            const equityShare = transactions.filter(transaction => transaction.e24Key === e24Key).reduce((sum, transaction) => sum + parseFloat(transaction.equityShare), 0)

            if (equityShare > 0) {
                holdings.push(
                    {
                        name: transactions.find(transaction => transaction.e24Key === e24Key).name,
                        accountKey: accountKey,
                        equityShare,
                        equityType: type,
                        e24Key,
                        goalPercentage: 0
                    }
                )
            }
        })
        console.log(holdings)
        return holdings
    }

    function readCsv(event) {
        var transactions = [];
        if (event.target.files && event.target.files[0]) {
            const input = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                const file = event.target.result.split('\n');
                file.forEach((line, index) => {
                    if (index !== 0) {
                        const data = line.split(',');
                        transactions.push({
                            key: data[0],
                            cost: parseFloat(data[1]),
                            name: data[2],
                            type: data[3],
                            date: data[4],
                            equityPrice: parseFloat(data[5]),
                            e24Key: data[6],
                            equityShare: parseFloat(data[7])
                        });
                    }
                })

                const holdings = getHoldings(account.key, transactions, account.type)
                dispatch(importTransactions({ key: account.key, transactions, holdings }))
            };
            reader.readAsText(input);
        }
    };

    return (
        <div>
            {account.type === 'Automatic' ? <></> :
                <Button color="primary" variant="bordered" onPress={handleClick} size="lg">
                    <input type="file"
                        ref={hiddenFileInput}
                        onChange={readCsv}
                        accept=".csv"
                        style={{ display: 'none' }} />
                    Importer transaksjoner <UploadIcon />
                </Button>
            }

            <Spacer y={4} />
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