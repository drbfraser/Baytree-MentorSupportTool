import React, { useContext, useEffect, useRef, useState } from "react";
import {
  baytreeLogoUrl,
  changingAspirationsUrl,
} from "../../../public/images/imageUrls";
import Sidebar from "./sidebar";
import { SidebarLink } from "./sidebarLinks";
import Topbar from "./topbar";
import { TopbarAction } from "./topbarActions";

export const NAVBAR_ICON_SIZE = "1.6rem";

interface NavbarProps {
  useMobileLayout: boolean;
  sidebarActive: boolean;
  setSidebarActive: (active: boolean) => void;
  sidebarLinks?: SidebarLink[];
  topbarActions?: TopbarAction[];
  pageContentDivRef: React.RefObject<HTMLDivElement>;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  useEffect(() => {
    if (props.useMobileLayout) {
      props.setSidebarActive(false);
    } else {
      props.setSidebarActive(true);
    }
  }, [props.useMobileLayout]);

  const sidebarElementRef = useRef<HTMLDivElement>(null);
  const hamburgerMenuButtonElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        props.pageContentDivRef.current &&
        props.pageContentDivRef.current.contains(event.target as Node) &&
        hamburgerMenuButtonElementRef.current
      ) {
        props.setSidebarActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Topbar
        useMobileLayout={props.useMobileLayout}
        logoUrl={baytreeLogoUrl}
        logoPadding="0.4rem"
        sloganImageUrl={changingAspirationsUrl}
        title="Admin Portal"
        actions={props.topbarActions ?? []}
        toggleSidebarMenu={() => {
          props.setSidebarActive(!props.sidebarActive);
        }}
        hamburgerMenuRef={hamburgerMenuButtonElementRef}
      ></Topbar>
      {props.sidebarActive && (
        <Sidebar
          Ref={sidebarElementRef}
          links={props.sidebarLinks ?? []}
          topbarActions={props.topbarActions ?? []}
          useMobileLayout={props.useMobileLayout}
          setSidebarActive={props.setSidebarActive}
        ></Sidebar>
      )}
    </>
  );
};

export default Navbar;
