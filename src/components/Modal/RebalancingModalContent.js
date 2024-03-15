import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react"
import { doRebalance } from "../../Util/Calculations";
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux";

export default function RebalancingModalContent({ investmentByType, canSell, closestToTarget }) {
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)
    const investmentSum = useSelector(state => state.rootReducer.rebalancing.sum)
    const minimumSumToInvest = useSelector(state => state.rootReducer.rebalancing.minimumSum)

    const { t } = useTranslation()

    const rows = doRebalance(accountTypes, investmentByType, parseFloat(investmentSum), parseFloat(minimumSumToInvest), canSell, closestToTarget)
        .filter(elem => elem.buy !== 0)
        .map(elem => ({
            key: elem.key, name: elem.name, buy: elem.buy + t('valuators.currency'), newSum: elem.newSum + t('valuators.currency')
        }))

    const columns = [
        {
            key: "name",
            label: t('rebalancingModal.table.name'),
        },
        {
            key: "buy",
            label: t('rebalancingModal.table.buySell')
        },
        {
            key: "newSum",
            label: t('rebalancingModal.table.newValue')
        },
    ]

    const totalRebalance = rows.map(elem => parseFloat(elem.buy.substring(0, elem.buy.length - 2))).reduce((sum, elem) => sum + elem, 0)

    return (
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
                                    {(item) =>
                                        <TableRow key={item.key}>
                                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                            <Spacer y={2} />
                            {investmentSum - totalRebalance > 0 ? <h4 className="text-small font-semibold leading-none text-default-800">Har investert {totalRebalance + t('valuators.currency')} av et innskudd på {investmentSum + t('valuators.currency')}. Har derfor igjen {investmentSum - totalRebalance + t('valuators.currency')} å investere for.</h4> : <h4 className="text-small font-semibold leading-none text-default-800">Hele investeringen ble investert i denne rebalanseringen.</h4>}

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
    )
}