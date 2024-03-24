import { useMemo, useState } from "react";
import { Button, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import ImportTransactionsModalContent from "./Modal/ImportTransactionsModalContent";
import EmptyModal from "./Modal/EmptyModal";

export default function TransactionsTable({ account }) {

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });

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
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true} >
                <ImportTransactionsModalContent accountKey={account.key} accountType={account.type} />
            </EmptyModal>
            <Button color="primary"
                onPress={onOpen}>
                Importer transaksjoner
            </Button>
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