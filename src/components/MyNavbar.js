import { Navbar, NavbarBrand, NavbarContent, useDisclosure, NavbarMenu, NavbarMenuToggle, Link, NavbarMenuItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Logo } from "../icons/Logo.jsx";
import Settings from "./Settings.js";
import { useTranslation } from "react-i18next";
import { useReducer } from "react";
import { routes } from "../Util/Global.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MyNavbar() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useReducer((current) => !current, false);;
  const accounts = useSelector(state => state.rootReducer.accounts.accountTypes);
  const { t } = useTranslation();

  const menuItems = [
    { name: t('navbar.dashboard'), link: routes.dashboard },
    { name: t('navbar.accounts'), link: "#" },
    { name: t('navbar.portfolio'), link: routes.portfolio },
    { name: t('navbar.rebalancing'), link: routes.rebalancing },
    { name: t('navbar.settings'), link: onOpen },
  ];

  const navigate = useNavigate()

  function handleClick(isHamburgerMenu, route) {
    route()
    if (isHamburgerMenu) {
      setIsMenuOpen()
    }
  }

  function generateDropdown(item) {
    return <Dropdown >
      <DropdownTrigger>
        <Link
          className="w-full"
          variant="light"
        >
          {item.name}
        </Link>
      </DropdownTrigger>
      <DropdownMenu variant="light" aria-label="accountsMenu" onAction={(key) => alert(key)}>
        <DropdownItem onClick={() => handleClick(isMenuOpen, item.link)}>{t('navbar.allAccounts')}</DropdownItem>
        {accounts.map(account => {
          return <DropdownItem key={account.key}>{account.name}</DropdownItem>
        })}
      </DropdownMenu>
    </Dropdown>
  }

  return (
    <Navbar isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="text-foreground">
      <NavbarContent>
        <NavbarBrand>
          <Button variant="light" onPress={() => navigate(routes.dashboard)}>
            <Logo />
            <p className="font-bold text-inherit">{t('navbar.brand')}</p>
          </Button>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="hidden sm:flex lg:flex">
        <Settings isOpen={isOpen} onOpenChange={onOpenChange} />
        {menuItems.map((item, index) => {
          if (item.link === "#") {
            return (
              generateDropdown(item)
            )
          }
          return (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link variant="light"
                className="w-full"
                onPress={() => item.name === t('navbar.settings') ? handleClick(false, onOpen) : handleClick(false, () => navigate(item.link))}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          )
        })
        }
      </NavbarContent>

      <NavbarContent justify="end">

        <NavbarMenu />

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => {
          if (item.link === "#") {
            if (item.link === "#") {
              return (
                <>
                  <Link className="w-full" onPress={() => console.alert("Open all accounts")}>{item.name}</Link>
                  {accounts.map(account => {
                    return (
                      <Link
                        className="w-full pl-5"
                        onPress={() => item.name === t('navbar.settings') ? handleClick(true, onOpen) : handleClick(true, () => navigate(item.link))}
                        size="lg"
                      >
                        {account.name}
                      </Link>)
                  })}
                </>
              )
            }
          }
          return (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                className="w-full"
                onPress={() => item.name === t('navbar.settings') ? handleClick(true, onOpen) : handleClick(true, () => navigate(item.link))}
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          )
        })}
      </NavbarMenu>
    </Navbar>
  )
}