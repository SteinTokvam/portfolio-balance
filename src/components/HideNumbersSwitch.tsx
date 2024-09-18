import React from "react";
import { Switch } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleHideNumbers } from "../actions/settings";


export default function HideNumbersSwitch() {
    const hideNumbers = useSelector((state: any) => state.rootReducer.settings.hideNumbers) as boolean;

    const dispatch = useDispatch();

    return (
        <Switch isSelected={hideNumbers} onValueChange={(() => dispatch(toggleHideNumbers(!hideNumbers)))}>
            Hide numbers
        </Switch>
    )
}