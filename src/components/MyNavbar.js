import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, useDisclosure} from "@nextui-org/react";
import {Logo} from "../icons/Logo.jsx";
import SettingsIcon from "../icons/SettingsIcon.js";
import Settings from "./Settings.js";
import { useTranslation } from "react-i18next";

export default function MyNavbar() {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {t} = useTranslation();

    return (
        <Navbar>
      <NavbarBrand>
        <Logo />
        <p className="font-bold text-inherit">{t('navbar.brand')}</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button isIconOnly variant="light" startContent={<SettingsIcon />} onPress={() => onOpen()}></Button>
        </NavbarItem>
        <Settings isOpen={isOpen} onOpenChange={onOpenChange}/>
      </NavbarContent>
    </Navbar>
    )
}