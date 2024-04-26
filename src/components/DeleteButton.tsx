import React from "react";
import { Button } from "@nextui-org/react";
import DeleteIcon from "../icons/DeleteIcon";

type Props = {
    handleDelete: () => void
    buttonText: string
    isDark: boolean
}

export default function DeleteButton({ handleDelete, buttonText, isDark }: Props) {
    return (
        <Button
            color="danger"
            startContent={<DeleteIcon dark={isDark}/>}
            onPress={handleDelete}
            size="lg"
            variant="bordered"
            className="m-2"
        >
            {buttonText}
        </Button>
    )
}