import { Button, Input } from "@nextui-org/react"
import { useTranslation } from "react-i18next"
import { v4 as uuidv4 } from 'uuid';
import { textInputStyle } from "../Util/Global"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addNewAccountType } from "../actions/account"

export default function NewAccountType() {
    const [accountTypeText, setAccountTypeText] = useState("")
    const [accountTypeGoalPercentage, setAccountTypeGoalPercentage] = useState(0)

    const dispatch = useDispatch()

    const { t } = useTranslation()
    return (
        <>
            {
                //Her kommer mulighet for å legge til egne kontotyper. usikker på hvor den funksjonaliteten egentlig bør ligge, men legger den her for nå
            }
            <Input type="text" classNames={textInputStyle} label={t('settings.accountType')} value={accountTypeText} onValueChange={setAccountTypeText} />
            <Input type="number" classNames={textInputStyle} label={t('settings.accountTypeGoalPercentage')} value={accountTypeGoalPercentage} onValueChange={setAccountTypeGoalPercentage} />
            <Button color="primary" variant="flat" onPress={() => {
                dispatch(addNewAccountType({key: uuidv4(), name: accountTypeText, goalPercentage: accountTypeGoalPercentage}))
                setAccountTypeText("")
            }} >
                {t('settings.addAccountButton')}
            </Button>
        </>
    )
}