import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react"
import { doRebalance } from "../Util/Calculations";
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux";

export default function RebalancingModal({ isOpen, onOpenChange, investmentByType }) {
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)
    const investmentSum = useSelector(state => state.rootReducer.rebalancing.sum)
    const minimumSumToInvest = useSelector(state => state.rootReducer.rebalancing.minimumSum)

    const { t } = useTranslation()

    const rows = doRebalance(accountTypes, investmentByType, parseFloat(investmentSum), parseFloat(minimumSumToInvest), true)
    .filter(elem => elem.buy !== 0)
    .map(elem => ({
        key: elem.key, name: elem.name, buy: elem.buy + t('valuators.currency'), newSum: elem.newSum + t('valuators.currency') 
    }))

    const columns = [
        {
            key: "name",
            label: "NAME"
        },
        {
            key: "buy",
            label: "BUY/SELL"
        },
        {
            key: "newSum",
            label: "NEW VALUE"
        },
    ]

    var counter = 0
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={'blur'} size="5xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{t('rebalancingModal.header')}</ModalHeader>
                        <ModalBody>
                            <div className="w-full text-left flex flex-col justify-center">
                                <Table aria-label="Example table with dynamic content" isStriped>
                                    <TableHeader columns={columns}>
                                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                    </TableHeader>
                                    <TableBody items={rows} emptyContent={t('rebalancingModal.noRebalancing')}>
                                        {(item) => item.buy !== 0 &&(
                                            <TableRow key={item.key}>
                                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>    
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={onClose}>
                                {t('rebalancingModal.close')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}