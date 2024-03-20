import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import AccountsWithTransactions from "./AccountsWithTransactions";
import { useSelector } from "react-redux";
import AddAccountImportButtons from "./AddAccountImportButtons";
import CompanyIcon from "../icons/CompanyIcon";
import { fetchTicker } from "../Util/E24";
import { useState } from "react";


export default function Portfolio() {
    const { t } = useTranslation();

    const accounts = useSelector(state => state.rootReducer.accounts.accounts);

    const [ticker, setTicker] = useState([])
    const [totalValue, setTotalValue] = useState([])


    async function test() {
        if (accounts.length === 0) {
            return
        }
        if (ticker.length >= accounts[0].e24_ids.length) {
            return
        }

        var tmp = []
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            for (let j = 0; j < account.e24_ids.length; j++) {
                const e24_id = account.e24_ids[j];
                const e24Data = await fetchTicker(e24_id, "OSE", account.type, "1weeks").then(res => res)
                tmp.push({ account: account.key, e24_id, value: e24Data[e24Data.length - 2].value })
            }
        }

        setTicker(tmp)

        var tmpTotalValue = []
        const ids = tmp.map(elem => elem.e24_id)
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const share_amount = accounts[0].transactions.filter(transaction => transaction.e24_id === id).reduce((sum, transaction) => sum + parseFloat(transaction.share_amount), 0)
            tmpTotalValue.push({ e24_id: id, value: share_amount * tmp[i].value, share_amount })
        }
        setTotalValue(tmpTotalValue)
    }
    test()

    return (
        <div>
            <div className="flex flex-col space-y-4">
                <AddAccountImportButtons onlyShowAddAccount={accounts.length === 0} />
                {accounts.length > 0 && totalValue.length > 0 ?
                    accounts.map(account => {
                        return (
                            <>
                                <Accordion key={account.key} >
                                    <AccordionItem aria-label="Accordion"
                                        title={account.name}
                                        startContent={
                                            <Avatar isBordered showFallback radius="full" size="md" src={`https://logo.uplead.com/${account.name.toLowerCase()}.no`} fallback={<CompanyIcon />} />
                                        }
                                        className="border border-default-300 rounded-3xl p-4"
                                        subtitle={
                                            <div className="flex flex-row gap-4 justify-between">
                                                <div>
                                                    <p>{account.type}</p>
                                                    <p>{totalValue.map(elem => elem.value).reduce((sum, value) => sum + value, 0).toFixed(1) + " " + t('valuators.currency')}</p>
                                                </div>


                                                {
                                                    totalValue.filter(elem => elem.value > 0).map(elem => {
                                                        return (
                                                            <div className="flex flex-col justify-center items-center px-4">
                                                                <p>Fond: {accounts[0].transactions.find(transaction => transaction.e24_id === elem.e24_id).fund_name}</p>
                                                                <p>Andeler: {elem.share_amount}</p>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>}
                                    >
                                        <AccountsWithTransactions account={account} />
                                    </AccordionItem>
                                </Accordion>
                            </>
                        )
                    })
                    :
                    ""
                }
            </div>
        </div>
    )
}