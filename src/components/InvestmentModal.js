import { Input, Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewInvestment, editInvestment } from '../actions/investments';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useMemo, useState } from 'react';
import { textInputStyle } from '../Util/Global';
import { useTranslation } from 'react-i18next';

export default function InvestmentModal({ isOpen, onOpenChange, isEdit }) {

  const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)

  const { t } = useTranslation();

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedValue, setSelectedPrice] = useState(0);
  const [selectedPercentage, setSelectedPercentage] = useState(0);
  const [selectedNote, setSelectedNote] = useState("");

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
      setSelectedPercentage(investmentToEdit.percentage)
      setSelectedNote(investmentToEdit.note)
    }
  }, [investmentToEdit, isEdit])

  function handleSubmit() {
    if (isEdit) {
      dispatch(editInvestment({ key: investmentToEdit.key, type: selectedInvestmentType, name: selectedName, account: selectedAccount, value: parseFloat(selectedValue), note: selectedNote, percentage: selectedPercentage }))
    } else {
      dispatch(addNewInvestment({ key: uuidv4(), type: selectedInvestmentType, name: selectedName, account: selectedAccount, value: parseFloat(selectedValue), note: selectedNote, percentage: selectedPercentage }))
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={isEdit ? '' : 'blur'}>
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
                {accountTypes.map(investering => (
                  <SelectItem key={investering.key} value={investering.name}>
                    {investering.name}
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
              <Input type="number" classNames={textInputStyle} label={t('investmentModal.goalPercentage')} startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">{t('valuators.percentage')}</span>
                </div>
              } value={selectedPercentage} onValueChange={setSelectedPercentage} />

              <Textarea label={t('investmentModal.textAreaDescription')} labelPlacement="outside" placeholder={t('investmentModal.textAreaPlaceholder')} className="max-w-xs" value={selectedNote} onValueChange={setSelectedNote}/>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                {t('investmentModal.close')}
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