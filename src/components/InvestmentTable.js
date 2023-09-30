import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, useDisclosure } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { setInvestmentToEdit } from "../actions/investments";
import { useTranslation } from "react-i18next";
import InvestmentInfoModal from "./InvestmentInfoModal";

export default function InvestmentTable() {

    const { t } = useTranslation();

    const investments = useSelector(state => state.rootReducer.investments.investments);
    var totalValue = investments.reduce((sum, investment) => sum + investment.value, 0)
    

    const columns = [
        {
            key: "account",
            label: t('investmentTable.columnAccountLabel'),
        },
        {
            key: "type",
            label: t('investmentTable.columnTypeLabel'),
        },
        {
            key: "name",
            label: t('investmentTable.columnNameLabel'),
        },
        {
            key: "current_percent",
            label: t('investmentTable.columnCurrentPercentLabel'),
        }
    ];

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const dispatch = useDispatch()

    function editInvestment(investment) {
        onOpen()
        dispatch(setInvestmentToEdit(investment))
    }

    return (
        <>
            <InvestmentInfoModal isOpenInfo={isOpen} onOpenChangeInfo={onOpenChange}/>
            <Table isStriped aria-label={t('investmentTable.tableLabel')} className="text-foreground"
                selectionMode="single"
                selectionBehavior={"toggle"}
                onRowAction={(key) => editInvestment(investments.filter(elem => elem.key === key)[0])}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody classNames="text-left" items={investments.map(elem => {
                    return { key: elem.key, type: elem.type, account: elem.account, name: elem.name, current_percent: (elem.value / totalValue * 100).toFixed(2) + "%" }
                })} emptyContent={t('investmentTable.emptyTable')}>

                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}