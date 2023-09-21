import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, useDisclosure} from "@nextui-org/react";
import { useSelector } from "react-redux";
import NewInvestmentModal from "./NewInvestmentModal";

export default function InvestmentTable() {

    const textInputStyle = {
        label: "text-black/50 dark:text-white/90",
        input: [
          "bg-transparent",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "shadow-xl",
          "bg-default-200/50",
          "dark:bg-default/60",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "hover:bg-default-200/70",
          "dark:hover:bg-default/70",
          "group-data-[focused=true]:bg-default-200/50",
          "dark:group-data-[focused=true]:bg-default/60",
          "!cursor-text",
        ],}

    const investments = useSelector(state => state.rootReducer.investments.investments);
    var totalValue = investments.reduce((sum, investment) => sum + investment.value, 0)
      
    const columns = [
    {
        key: "type",
        label: "TYPE",
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

    function editInvestment(investment) {
        onOpen()
        console.log(investment)
    }

    return (
        <>
        <NewInvestmentModal isOpen={isOpen} onOpenChange={onOpenChange} />
        <Table isStriped aria-label="Table over different investments"
        selectionMode="single"
        selectionBehavior={"toggle"}
        onRowAction={(key) => editInvestment(investments.filter(elem => elem.key === key)[0])}>
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody classNames="text-left" items={investments.map(elem => {
            return {key: elem.key, type: elem.type, name: elem.name, value: elem.value, current_percent: (elem.value/totalValue*100).toFixed(2)}
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