import { Button } from "@nextui-org/react";
import DeleteIcon from "../icons/DeleteIcon";


export default function DeleteButton({ handleDelete, buttonText }) {
    return (
        <Button
            color="danger"
            startContent={<DeleteIcon />}
            onPress={handleDelete}
            size="lg"
            variant="bordered"
            className="m-2"
        >
            {buttonText}
        </Button>
    )
}