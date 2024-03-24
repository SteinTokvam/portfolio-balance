import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useRef } from "react";
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux";
import { importTransactions } from "../../actions/accounts";
import { UploadIcon } from "../../icons/UploadIcon";
import { v4 as uuidv4 } from 'uuid';

export default function ImportTransactionsModalContent({ accountKey, accountType }) {

    const { t } = useTranslation()

    const accounts = useSelector(state => state.rootReducer.accounts.accounts);

    const dispatch = useDispatch();

    const hiddenFileInput = useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    function getHoldings(accountKey, transactions, type) {
        console.log(transactions)
        if(!transactions) {
            return
        }
        const holdings = []
        const uniqueHoldingKeys = [...new Set(transactions.map(transaction => transaction.e24Key))];
        console.log(uniqueHoldingKeys)
        uniqueHoldingKeys.forEach(e24Key => {
            const equityShare = transactions.filter(transaction => transaction.e24Key === e24Key).reduce((sum, transaction) => sum + parseFloat(transaction.equityShare), 0)

            if (equityShare > 0) {
                holdings.push(
                    {
                        name: transactions.find(transaction => transaction.e24Key === e24Key).name,
                        accountKey: accountKey,
                        equityShare,
                        equityType: type,
                        e24Key,
                        goalPercentage: 0
                    }
                )
            }
        })
        console.log(holdings)
       return holdings
    }

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
                            equityShare: parseFloat(data[7])
                        });
                    }
                })

                const holdings = getHoldings(accountKey, transactions, accountType)
                dispatch(importTransactions({ key: accountKey, transactions: transactions, holdings }))
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