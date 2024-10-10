import { Button } from "@nextui-org/react";
import DeleteIcon from "../../icons/DeleteIcon";

type Props = {
    handleDelete: () => void
    buttonText: string
    isDark: boolean
    showText: boolean
}

export default function DeleteButton({ handleDelete, buttonText, isDark, showText}: Props) {
    return (
        <Button
            color="danger"
            startContent={<DeleteIcon dark={isDark}/>}
            onPress={handleDelete}
            size="lg"
            variant="bordered"
            className="m-2"
            isIconOnly={!showText}
        >
            {showText && buttonText}
        </Button>
    )
}