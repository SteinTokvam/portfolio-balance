import { Navbar, NavbarBrand, NavbarContent, useDisclosure, NavbarMenu, NavbarMenuToggle, Link, NavbarMenuItem, Button } from "@nextui-org/react";
import { Logo } from "../icons/Logo.jsx";
import Settings from "./Settings.js";
import { useTranslation } from "react-i18next";
import { useReducer, useState } from "react";
import { routes } from "../Util/Global.js";
import { useNavigate } from "react-router-dom";

export default function MyNavbar() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useReducer((current) => !current, false);;
  const { t } = useTranslation();

  const menuItems = [
    { name: "Dashboard", link: routes.dashboard },
    { name: "Portfolio", link: routes.portfolio },
    { name: "Settings", link: onOpen },
  ];

  const navigate = useNavigate()

  function handleClick(isSettings, route) {
    if(isSettings) {
      route()
    } else {
      navigate(route)
    }
    setIsMenuOpen()
  }

  return (
    <Navbar isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="text-foreground">
      <NavbarContent>
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">{t('navbar.brand')}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="hidden sm:flex lg:flex">
        <Settings isOpen={isOpen} onOpenChange={onOpenChange} />
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Button variant="light"
              className="w-full"
              onPress={() => item.name === "Settings" ? onOpen() : navigate(item.link)}
            >
              {item.name}
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
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full"
              onPress={() => item.name === "Settings" ? handleClick(true, onOpen) : handleClick(false, item.link)}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}