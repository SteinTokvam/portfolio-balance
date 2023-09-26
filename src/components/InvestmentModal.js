import { Input, Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewInvestment, deleteInvestment, editInvestment } from '../actions/investments';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useMemo, useState } from 'react';
import { investmentTypes } from '../Util/Global';
import DeleteIcon from '../icons/DeleteIcon';
import { useTranslation } from 'react-i18next';

export default function InvestmentModal({ isOpen, onOpenChange, isEdit }) {

  const { t } = useTranslation();

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
    ],
  }


  const [selectedKeys, setSelectedKeys] = useState(new Set([investmentTypes[0]]));
  const [selectedName, setSelectedName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedValue, setSelectedPrice] = useState(0);

  const selectedInvestmentType = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const dispatch = useDispatch()
  const investmentToEdit = useSelector(state => state.rootReducer.investments.investmentToEdit)

  useEffect(() => {
    if (isEdit && investmentToEdit !== undefined) {
      setSelectedKeys(new Set([investmentToEdit.type]))
      setSelectedName(investmentToEdit.name)
      setSelectedAccount(investmentToEdit.account)
      setSelectedPrice(investmentToEdit.value)
    }
  }, [investmentToEdit, isEdit])

  function handleSubmit() {
    if (isEdit) {
      dispatch(editInvestment({ key: investmentToEdit.key, type: selectedInvestmentType, name: selectedName, account: selectedAccount, value: parseFloat(selectedValue) }))
    } else {
      dispatch(addNewInvestment({ key: uuidv4(), type: selectedInvestmentType, name: selectedName, account: selectedAccount, value: parseFloat(selectedValue) }))
    }
  }

  function handleDelete() {
    dispatch(deleteInvestment(investmentToEdit))
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{isEdit ? t('investmentModal.editTitle') : t('investmentModal.newTitle')}</ModalHeader>
            <ModalBody>
              <Select
                label={t('investmentModal.type')}
                placeholder={t('investmentModal.typeLabel')}
                className="max-w-xs"
                onSelectionChange={setSelectedKeys}
                selectedKeys={selectedKeys}
              >
                {investmentTypes.map((investering) => (
                  <SelectItem key={investering} value={investering}>
                    {investering}
                  </SelectItem>
                ))}
              </Select>
              <Input type="text" classNames={textInputStyle} label={t('investmentModal.nameOfAccount')} value={selectedAccount} onValueChange={setSelectedAccount} />
              <Input type="text" classNames={textInputStyle} label={t('investmentModal.nameOfInvestment')} value={selectedName} onValueChange={setSelectedName} />
              <Input type="number" classNames={textInputStyle} label={t('investmentModal.value')} startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">{t('valuators.currency')}</span>
                </div>
              } value={selectedValue} onValueChange={setSelectedPrice} />
            </ModalBody>
            <ModalFooter>
              {isEdit ? <Button isIconOnly color="danger" variant="solid" onPress={() => {
                onClose()
                handleDelete()
              }}>
                <DeleteIcon />
              </Button> : ""}
              <Button color="primary" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="success" variant="light" aria-label={t('investmentModal.save')} onPress={() => {
                onClose()
                handleSubmit()
              }}>
                {isEdit ? t('investmentModal.saveChanges') : t('investmentModal.save')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}