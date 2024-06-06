import React from "react";
import { Switch } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { setHideNumbers } from "../actions/settings";


export default function HideNumbersSwitch() {
    // @ts-ignore
    const hideNumbers = useSelector(state => state.rootReducer.settings.hideNumbers) as boolean;

    const dispatch = useDispatch();

    return (
        <Switch isSelected={hideNumbers} onValueChange={(() => dispatch(setHideNumbers(!hideNumbers)))}>
            Hide numbers
        </Switch>
    )
}