import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spacer } from "@nextui-org/react"
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux";
import { importTransactions } from "../../actions/account";
import { UploadIcon } from "../../icons/UploadIcon";

export default function ImportTransactionsModalContent() {

    const { t } = useTranslation()
    const [selectedKeys, setSelectedKeys] = useState([]);

    const accounts = useSelector(state => state.rootReducer.accounts.accounts)

    const dispatch = useDispatch();

    const hiddenFileInput = useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    function readCsv(event) {
        var lines = [];
        if (event.target.files && event.target.files[0]) {
            const input = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                const file = event.target.result.split('\n');
                file.forEach((line, index) => {
                    if (index !== 0) {
                        const data = line.split(',');
                        lines.push({
                            id: data[0],
                            amount: data[1],
                            fund_name: data[2],
                            type: data[3],
                            date: data[4],
                            unit_price: data[5],
                            e24_id: data[6],
                            share_amount: data[7]
                        });
                    }
                })
                console.log(selectedKeys.keys().next().value)
                dispatch(importTransactions({ key: selectedKeys.keys().next().value, transactions: lines }))
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
                                <h4 className="text-small font-semibold leading-none text-default-600">Importer transaksjoner</h4>
                            </div>
                        </div>

                    </ModalHeader>
                    <ModalBody>
                        <div className='grid grid-cols-2 gap-12 items-center justify-between'>
                            <Select
                                label={"Konto"}
                                placeholder={"Konto"}
                                className="max-w-xs"
                                onSelectionChange={setSelectedKeys}
                                selectedKeys={selectedKeys}
                            >
                                {accounts.map(account => (
                                    <SelectItem key={account.key}>
                                        {account.name +  "-" + account.type}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Button color="primary" variant="bordered" onPress={handleClick} size="lg">
                                <input type="file"
                                    ref={hiddenFileInput}
                                    onChange={readCsv}
                                    accept=".csv"
                                    style={{ display: 'none' }} />
                                Last opp fil <UploadIcon /> 
                            </Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => {
                            onClose()
                        }}>
                            Lukk
                        </Button>
                        <Button color="primary" variant="light" onPress={onClose}>
                            {t('investmentModal.close')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}