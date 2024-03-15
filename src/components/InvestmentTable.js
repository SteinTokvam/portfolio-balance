import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, useDisclosure, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { setInvestmentToEdit } from "../actions/investments";
import { useTranslation } from "react-i18next";
import InvestmentInfoModalContent from "./Modal/InvestmentInfoModalContent";
import { findAccountType } from "../Util/Formatting";
import EmptyModal from "./Modal/EmptyModal";
import { useState } from "react";
import NewInvestmentModalContent from "./Modal/NewInvestmentModalContent";
import EditIcon from "../icons/EditIcon";

export default function InvestmentTable() {

    const { t } = useTranslation();

    const investments = useSelector(state => state.rootReducer.investments.investments);
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes);
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
    const [screen, setScreen] = useState(true)

    function editInvestment(investment) {
        onOpen()
        dispatch(setInvestmentToEdit(investment))
    }

    return (
        <>
            <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} >
                {
                    screen ? <InvestmentInfoModalContent>
                        <Button
                            className={""}
                            color="primary"
                            radius="full"
                            size="sm"
                            variant={"bordered"}
                            onPress={() => setScreen(false)}
                        >
                            <EditIcon />
                            {t('investmentInfoModal.edit')}
                        </Button>
                    </InvestmentInfoModalContent> :
                        <NewInvestmentModalContent isEdit={true} setScreen={setScreen} />
                }
            </EmptyModal>
            <Table isStriped aria-label={t('investmentTable.tableLabel')} className="text-foreground"
                selectionMode="single"
                selectionBehavior={"toggle"}
                onRowAction={(key) => editInvestment(investments.filter(elem => elem.key === key)[0])}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody classNames="text-left" items={investments.map(elem => {
                    return { key: elem.key, type: findAccountType(elem.type, accountTypes), account: elem.account, name: elem.name, current_percent: (elem.value / totalValue * 100).toFixed(2) + t('valuators.percentage') }
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