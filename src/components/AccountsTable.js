import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AccountModal from "./AccountModal";
import { setAccountToEdit } from "../actions/account";
import { useState } from "react";


export default function AccountsTable() {
    const { t } = useTranslation();

    const accounts = useSelector(state => state.rootReducer.accounts.accountTypes);
    const investments = useSelector(state => state.rootReducer.investments.investments);
    const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0)
    const totalValueByType = accounts.map(accountType => {
        return { accountType: accountType.name, value: investments.filter(investment => investment.type === accountType.name).reduce((sum, investment) => sum + investment.value, 0) }
    })

    const [isAccountType, setIsAccountType] = useState(true)

    const columns = [
        {
            key: "type",
            label: t('investmentTable.columnTypeLabel'),
        },
        {
            key: "goalPercent",
            label: "Goal percentage",
        },
        {
            key: "currentPercent",
            label: t('investmentTable.columnCurrentPercentLabel'),
        }
    ];

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const dispatch = useDispatch()

    function editAccount(investment, isAccountType) {
        onOpen()
        dispatch(setAccountToEdit(investment))
        setIsAccountType(isAccountType)
    }

    return (
        <>
            <AccountModal isOpen={isOpen} onOpenChange={onOpenChange} isAccountType={isAccountType} />
            <Table isStriped aria-label={t('investmentTable.tableLabel')} className="text-foreground"
                selectionMode="single"
                selectionBehavior={"toggle"}
                onRowAction={(key) => editAccount(accounts.filter(elem => elem.key === key)[0], true)}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody classNames="text-left" items={accounts.map(elem => {
                    return { key: elem.key, type: elem.name, goalPercent: elem.goalPercentage, currentPercent: (totalValueByType.filter(item => item.accountType === elem.name)[0].value / totalValue * 100).toFixed(2) + "%" }
                })} emptyContent={t('investmentTable.emptyTable')}>

                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}