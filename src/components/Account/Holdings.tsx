import { useEffect } from "react"
import { Account, Holding } from "../../types/Types"
import { useDispatch, useSelector } from "react-redux";
import { Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { getHoldings } from "../../Util/Global";
import { addHoldings } from "../../actions/holdings";
import { useTranslation } from "react-i18next";

export default function Holdings({ account }: { account: Account }) {

    const holdings = useSelector((state: any) => state.rootReducer.holdings.holdings);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const columnNames = account.name === 'Kron' ? [
        {
            key: "name",
            label: "Name"
        },
        {
            key: "value",
            label: "Value"
        },
        {
            key: "amount",
            label: "Amount"
        },
        {
            key: "allocation",
            label: "Allocation"
        },
        {
            key: "yield",
            label: "Yield"
        },
        {
            key: "isin",
            label: "ISIN"
        }
    ] : [
        {
            key: "name",
            label: "Name"
        },
        {
            key: "value",
            label: "Value"
        },
        {
            key: "amount",
            label: "Amount"
        },
        {
            key: "allocation",
            label: "Allocation"
        },
        {
            key: "yield",
            label: "Yield"
        }
    ]

    function renderEquityShare(account: Account, holding: Holding): JSX.Element {
        if (account.name !== 'Firi' && holding.equityType === 'Fund') {
            return <p>{holding.equityShare.toFixed(2)}</p>
        } else if (holding.equityType === 'Loan') {
            return <p></p>
        }
        return <p>{holding.equityShare}</p>
    }

    useEffect(() => {
        getHoldings(account)
            .then((holdings: Holding[]) => {
                if (holdings.length === 0) {
                    return
                }
                dispatch(addHoldings(holdings, account.key))
            })
    }, [account, dispatch])

    function renderCell(item: any, columnKey: string | number) {
        switch (columnKey) {
            case 'isin':
                return <Link
                    href={`https://kron.no/fond/${item[columnKey]}`}
                    isExternal
                >
                    {t('holdings.seeMore')}
                    </Link>
            default:
                return getKeyValue(item, columnKey)
        }
    }

    return (
        <div>
            <Table
                isStriped
                selectionMode='none'
            >
                <TableHeader columns={columnNames}>
                    {(column: { key: string; label: any; }) => {
                        if (column.key === 'date' || column.key === 'type' || column.key === 'fund_name' || column.key === 'amount' || column.key === 'yield') {
                            return <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>
                        }
                        return <TableColumn key={column.key}>{column.label}</TableColumn>
                    }}
                </TableHeader>
                <TableBody
                    items={
                        holdings
                            .filter((holding: Holding) => holding.accountKey === account.key && holding.value > 0.001)
                            .map((holding: Holding) => {
                                return {
                                    name: holding.name,
                                    value: holding.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }),
                                    amount: renderEquityShare(account, holding),
                                    allocation: ((holding.value / holdings.filter((holding: Holding) => holding.accountKey === account.key).reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0)) * 100).toFixed(1) + '%',
                                    yield: holding.yield && holding.yield.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }),
                                    isin: holding.isin
                                }
                            })
                    }
                >
                    {(item: any) => (
                        <TableRow key={item.name}>
                            {(columnKey: string | number) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}

                </TableBody>
            </Table>
        </div>
    )
}