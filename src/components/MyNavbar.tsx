import React from "react";
import { Navbar, NavbarBrand, NavbarContent, useDisclosure, NavbarMenu, NavbarMenuToggle, Link, NavbarMenuItem, Button } from "@nextui-org/react";
import { Logo } from "../icons/Logo";
import SettingsModalContent from "./Modal/SettingsModalContent";
import { useTranslation } from "react-i18next";
import { useReducer } from "react";
import { routes } from "../Util/Global";
import { useNavigate } from "react-router-dom";
import EmptyModal from "./Modal/EmptyModal";
import { SupabaseClient } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";
import { deleteAllAccounts } from "../actions/accounts";

export default function MyNavbar({ supabase }: { supabase: SupabaseClient }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useReducer((current) => !current, false);;
  const { t } = useTranslation();

  const signedIn = window.localStorage.getItem('sb-gmfrmyphzawjnzcjuiqx-auth-token')

  const dispatch = useDispatch()

  const menuItems = [
    { name: t('navbar.dashboard'), link: routes.dashboard },
    { name: t('navbar.portfolio'), link: routes.portfolio },
    { name: t('navbar.settings'), link: onOpen },
  ];

  const navigate = useNavigate()

  function handleClick(isHamburgerMenu: boolean, route: () => void) {
    route()
    if (isHamburgerMenu) {
      setIsMenuOpen()
    }
  }

  return (
    signedIn && <Navbar isMenuOpen={isMenuOpen}
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
        <EmptyModal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={false} isDismissable={true}>
          <SettingsModalContent supabase={supabase} />
        </EmptyModal>
        {signedIn && menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Button variant="light"
              className="w-full"
              onPress={() => item.name === t('navbar.settings') ? handleClick(false, onOpen) : handleClick(false, () => navigate(item.link as string))}
            >
              {item.name}
            </Button>
          </NavbarMenuItem>
        ))}
        {signedIn && <NavbarMenuItem>
          <Button
            variant="light"
            color='danger'
            onClick={() => {
              supabase.auth.signOut().then(() => {
                dispatch(deleteAllAccounts(supabase, false))
                navigate('/')
              })
            }} >Logg ut</Button>
        </NavbarMenuItem>}
      </NavbarContent>

      <NavbarContent justify="end">

        <NavbarMenu />

        {signedIn && <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full"
              onPress={() => item.name === t('navbar.settings') ? handleClick(true, onOpen) : handleClick(true, () => navigate(item.link as string))}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {signedIn && <NavbarMenuItem>
          <Link
            color="danger"
            onPress={() => {
              supabase.auth.signOut().then(() => {
                dispatch(deleteAllAccounts(supabase, false))
                navigate('/')
              })
            }}
            size="lg">Logg ut</Link>
        </NavbarMenuItem>}
      </NavbarMenu>
    </Navbar>
  )
}