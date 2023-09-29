import { Navbar, NavbarBrand, NavbarContent, useDisclosure, NavbarMenu, NavbarMenuToggle, Link, NavbarMenuItem, Button } from "@nextui-org/react";
import { Logo } from "../icons/Logo.jsx";
import Settings from "./Settings.js";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function MyNavbar() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    "Dashboard",
    "Portfolio",
    "Settings"
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">{t('navbar.brand')}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="hidden lg:flex">
        <Settings isOpen={isOpen} onOpenChange={onOpenChange} />
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Button variant="light"
              className="w-full"
              onPress={() => item === "Settings" ? onOpen() : ""}
            >
              {item}
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">

        <NavbarMenu />

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              onPress={() => item === "Settings" ? onOpen() : ""}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}