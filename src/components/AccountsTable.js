import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AccountModal from "./AccountModal";
import { deleteAccountType, setAccountToEdit } from "../actions/account";
import EmptyModal from "./EmptyModal";

export default function AccountsTable() {
    const { t } = useTranslation();

    const accounts = useSelector(state => state.rootReducer.accounts.accountTypes);
    const accountToEdit = useSelector(state => state.rootReducer.accounts.accountToEdit);
    const investments = useSelector(state => state.rootReducer.investments.investments);
    const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0)
    const totalValueByType = accounts.map(accountType => {
        return { accountType: accountType.key, value: investments.filter(investment => investment.type === accountType.key).reduce((sum, investment) => sum + investment.value, 0) }
    })

    const columns = [
        {
            key: "type",
            label: t('investmentTable.columnTypeLabel'),
        },
        {
            key: "goalPercent",
            label: t('investmentTable.columnGoalPercentLabel'),
        },
        {
            key: "currentPercent",
            label: t('investmentTable.columnCurrentPercentLabel'),
        },
        {
            key: "distanceToTarget",
            label: t('investmentTable.columnDistanceToTargetLabel'),
        }
    ];

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const dispatch = useDispatch()

    function editAccount(investment) {
        onOpen()
        dispatch(setAccountToEdit(investment))
    }

    function getDistanceToTarget(elem) {//TODO: kan se på rebalanseringskoden om man kan bruke den til å beregne hvor mye som må kjøpes for at den skal være på målprosenten uavhengig av andre investeringstyper.
        const distanceToTarget = parseInt((totalValue*(elem.goalPercentage/100)-(totalValueByType.filter(item => item.accountType === elem.key)[0].value)).toFixed(0))
        if(Math.abs(distanceToTarget) === 0) {
            return 0
        }
        else return distanceToTarget
    }

    function handleModalClose() {
        if (investments.filter(investment => investment.type === accountToEdit.key).length !== 0) {
            console.log("Du må slette alle invvesteringer med denne kontotypen først")//TODO: legg dette inn i en toast
            return
        }
        dispatch(deleteAccountType(accountToEdit))
    }

    return (
        <>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} handleClose={handleModalClose} >
                <AccountModal />
            </EmptyModal>
            
            <Table isStriped aria-label={t('investmentTable.tableLabel')} className="text-foreground"
                selectionMode="single"
                selectionBehavior={"toggle"}
                onRowAction={(key) => editAccount(accounts.filter(elem => elem.key === key)[0])}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody classNames="text-left" items={accounts.map(elem => {
                    return { 
                        key: elem.key, 
                        type: elem.name, 
                        goalPercent: elem.goalPercentage + t('valuators.percentage'), 
                        currentPercent: (totalValueByType.filter(item => item.accountType === elem.key)[0].value / totalValue * 100).toFixed(2) + t('valuators.percentage'), 
                        distanceToTarget: getDistanceToTarget(elem) + " " + t('valuators.currency') }
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