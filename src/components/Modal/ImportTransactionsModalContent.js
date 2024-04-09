import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux";
import { UploadIcon } from "../../icons/UploadIcon";
import { importTransactions } from "../../actions/accounts";
import { getHoldings } from "../../Util/Global";
import { useSelector } from "react-redux";

export default function ImportTransactionsModalContent({ account }) {

    const { t } = useTranslation()

    const dispatch = useDispatch();

    const hiddenFileInput = useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)

    const [selectedInvestmentKeys, setSelectedInvestmentKeys] = useState([]);
    const selectedInvestmentType = useMemo(
        () => Array.from(selectedInvestmentKeys).join(", ").replaceAll("_", " "),
        [selectedInvestmentKeys]
    );

    function readCsv(event) {
        var transactions = [];
        if (event.target.files && event.target.files[0]) {
            const input = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                const file = event.target.result.split('\n');
                file.forEach((line, index) => {
                    if (index !== 0) {
                        const data = line.split(',');
                        transactions.push({
                            key: data[0],
                            cost: parseFloat(data[1]),
                            name: data[2],
                            type: data[3],
                            date: data[4],
                            equityPrice: parseFloat(data[5]),
                            e24Key: data[6],
                            equityShare: parseFloat(data[7]),
                            equityType: selectedInvestmentType
                        });
                    }
                })

                const holdings = getHoldings(transactions, account)
                dispatch(importTransactions({ key: account.key, transactions, holdings }))
            };
            reader.readAsText(input);
        }
    };

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="justify-between">
                        <div className="flex gap-5">
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-small font-semibold leading-none text-default-600">{t('importTransactionsModal.title')}</h4>
                            </div>
                        </div>

                    </ModalHeader>
                    <ModalBody>

                        <div className='grid grid-cols-2 gap-12 items-center justify-between'>
                            <Select
                                label={"Investeringstype"}
                                placeholder={"Investeringstype"}
                                className="pt-4 drop-shadow-xl"
                                onSelectionChange={setSelectedInvestmentKeys}
                                selectedKeys={selectedInvestmentKeys}
                            >
                                {equityTypes.map((equityType) => (
                                    <SelectItem key={equityType.key} value={t(`equityTypes.${equityType.key.toLowerCase()}`)} >
                                        {t(`equityTypes.${equityType.key.toLowerCase()}`)}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Button color="primary" variant="bordered" onPress={handleClick} size="lg">
                                <input type="file"
                                    ref={hiddenFileInput}
                                    onChange={readCsv}
                                    accept=".csv"
                                    style={{ display: 'none' }} />
                                {t('importTransactionsModal.uploadFiles')} <UploadIcon />
                            </Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={onClose}>
                            {t('general.closeButton')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}