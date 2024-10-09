import { Holding } from "../types/Types"
import { Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

export default function Holdings({holdings, isKron = false}: {holdings: Holding[], isKron?: boolean}) {
    const { t } = useTranslation();

    const columnNames = holdings.length > 0 && isKron ? [
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

    function renderEquityShare(holding: Holding): JSX.Element {
        if (holding.equityType === 'Fund') {
            return <p>{holding.equityShare.toFixed(2)}</p>
        } else if (holding.equityType === 'Loan') {
            return <p></p>
        }
        return <p>{holding.equityShare}</p>
    }

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
    console.log(holdings)

    return (
        <div>
            {
                holdings &&
                <Table
                    isStriped
                    selectionMode='none'
                >
                    <TableHeader columns={columnNames}>
                        {(column: { key: string; label: any; }) => {
                            return <TableColumn key={column.key}>{column.label}</TableColumn>
                        }}
                    </TableHeader>
                
                    <TableBody
                        items={
                            holdings
                                .filter((holding: Holding) => holding.value > 0.001)
                                .map((holding: Holding) => {
                                    return {
                                        name: holding.name,
                                        value: holding.value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' }),
                                        amount: renderEquityShare(holding),
                                        allocation: ((holding.value / holdings.reduce((acc: number, cur: Holding) => cur.value ? acc + cur.value : 0, 0)) * 100).toFixed(1) + '%',
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
            }
        </div>
    )
}