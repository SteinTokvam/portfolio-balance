import { Input, Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewInvestment, editInvestment } from '../actions/investments';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useMemo, useState } from 'react';
import { investmentTypes } from '../Util/Global';

export default function InvestmentModal({isOpen, onOpenChange, isEdit}) {

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
        ],}
    
    
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
        if(isEdit && investmentToEdit !== undefined) {
            setSelectedKeys(new Set([investmentToEdit.type]))
            setSelectedName(investmentToEdit.name)
            setSelectedAccount(investmentToEdit.account)
            setSelectedPrice(investmentToEdit.value)
        }
    }, [investmentToEdit, isEdit])

    function handleSubmit() {
        if(isEdit) {
            dispatch(editInvestment({key: investmentToEdit.key, type: selectedInvestmentType, name: selectedName, account: selectedAccount,value: parseFloat(selectedValue)}))
        } else {
            dispatch(addNewInvestment({key: uuidv4(), type: selectedInvestmentType, name: selectedName, account: selectedAccount,value: parseFloat(selectedValue)}))
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{isEdit ? "Endre investering" : "Ny investering"}:</ModalHeader>
              <ModalBody>
                <Select
                  label="Type investering"
                  placeholder="Velg type investering"
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
                <Input type="text" classNames={textInputStyle} label="Navn på konto" value={selectedAccount} onValueChange={setSelectedAccount}/>
                <Input type="text" classNames={textInputStyle} label="Navn på investering" value={selectedName} onValueChange={setSelectedName}/>
                <Input type="number" classNames={textInputStyle} label="Verdi" startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">Kr</span>
                  </div>
                } value={selectedValue} onValueChange={setSelectedPrice}/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Abort
                </Button>
                <Button color="success" variant="light" aria-label="add" onPress={() => {
                  onClose()
                  handleSubmit()
                  }}>
                  {isEdit ? "Save changes" : "Add"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
}