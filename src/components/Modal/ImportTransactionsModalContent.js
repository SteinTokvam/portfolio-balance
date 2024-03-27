import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux";
import { UploadIcon } from "../../icons/UploadIcon";
import { textInputStyle } from "../../Util/Global";
import { importTransactions } from "../../actions/accounts";
import rootReducer from "../../reducers";

export default function ImportTransactionsModalContent({ accountKey }) {

    const { t } = useTranslation()

    const dispatch = useDispatch();
    const accounts = useSelector(state => state.rootReducer.accounts.accounts)
    const [investmentType, setInvestmentType] = useState("")

    const hiddenFileInput = useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    function getHoldings(accountKey, transactions, type) {
        if (!transactions) {
            return
        }
        if(!accounts.filter(account => account.key === accountKey)[0].isManual) {
            const currentTransactions = accounts.filter(account => account.key === accountKey)[0].transactions
            const currentTransactionKeys = currentTransactions.map(transaction => transaction.key)
            const newTransactions = transactions.filter(transaction => !currentTransactionKeys.includes(transaction.key))
            const holdings = []
            const uniqueHoldingKeys = [...new Set(newTransactions.map(transaction => transaction.e24Key))];
            uniqueHoldingKeys.forEach(e24Key => {
                const equityShare = newTransactions.filter(transaction => transaction.e24Key === e24Key).reduce((sum, transaction) => sum + parseFloat(transaction.equityShare), 0)
    
                if (equityShare > 0) {
                    holdings.push(
                        {
                            name: newTransactions.find(transaction => transaction.e24Key === e24Key).name,
                            accountKey: accountKey,
                            equityShare,
                            equityType: type,
                            e24Key,
                            goalPercentage: 0
                        }
                    )
                }
            })
            return holdings
        }
        const holdings = []
        const uniqueHoldingKeys = [...new Set(transactions.map(transaction => transaction.e24Key))];
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
                            equityShare: parseFloat(data[7]),
                            equityType: investmentType
                        });
                    }
                })

                const holdings = getHoldings(accountKey, transactions, investmentType)
                dispatch(importTransactions({ key: accountKey, transactions, holdings }))
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
                            <Input type="text"
                                classNames={textInputStyle}
                                label={"Investeringstype"}
                                value={investmentType}
                                onValueChange={setInvestmentType} />
                            <Button color="primary" variant="bordered" onPress={handleClick} size="lg">
                                <input type="file"
                                    ref={hiddenFileInput}
                                    onChange={readCsv}
                                    accept=".csv"
                                    style={{ display: 'none' }} />
                                {t('ImportTransactionsModal.uploadFiles')} <UploadIcon />
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