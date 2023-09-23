import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, useDisclosure} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import NewInvestmentModal from "./NewInvestmentModal";
import { setInvestmentToEdit } from "../actions/investments";

export default function InvestmentTable() {

    const investments = useSelector(state => state.rootReducer.investments.investments);
    var totalValue = investments.reduce((sum, investment) => sum + investment.value, 0)
      
    const columns = [
    {
        key: "type",
        label: "TYPE",
    },
    {
        key: "account",
        label: "ACCOUNT",
    },
    {
        key: "name",
        label: "NAME",
    },
    {
        key: "value",
        label: "VALUE",
    },
    {
        key: "current_percent",
        label: "CURRENT PERCENT"
    }
    ];

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const dispatch = useDispatch()

    function editInvestment(investment) {
        onOpen()
        dispatch(setInvestmentToEdit(investment))
    }

    return (
        <>
        <NewInvestmentModal isOpen={isOpen} onOpenChange={onOpenChange} isEdit={true}/>
        <Table isStriped aria-label="Table over different investments"
        selectionMode="single"
        selectionBehavior={"toggle"}
        onRowAction={(key) => editInvestment(investments.filter(elem => elem.key === key)[0])}>
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody classNames="text-left" items={investments.map(elem => {
            return {key: elem.key, type: elem.type, account: elem.account, name: elem.name, value: elem.value, current_percent: (elem.value/totalValue*100).toFixed(2)}
          })} emptyContent={"Ingen investeringer er lagt inn."}>

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