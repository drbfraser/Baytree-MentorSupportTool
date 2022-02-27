import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "../components/shared/Navbar/navbar";
import { useRouter } from "next/router";
import { Component, useEffect, useRef, useState } from "react";
import {
  BODY_BACKGROUND,
  SIDEBAR_WIDTH,
  TOPBAR_HEIGHT,
} from "../constants/constants";
import sidebarLinks from "../components/shared/Navbar/sidebarLinks";
import topbarActions from "../components/shared/Navbar/topbarActions";
import useMobileLayout from "../hooks/useMobileLayout";
import { RootState, useStore } from "../stores/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NextComponentType, NextPageContext } from "next";
import React from "react";
import { Typography } from "@mui/material";
import { logout, verify } from "../actions/auth/actionCreators";
import OverlaySpinner from "../components/shared/overlaySpinner";
import styled from "styled-components";

export const BODY_PADDING = "1rem";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <PageChooser pageProps={pageProps} component={Component}></PageChooser>
    </Provider>
  );
}

const PageChooser: React.FC<{
  pageProps: any;
  component: NextComponentType<NextPageContext, any, {}>;
}> = ({ pageProps, component }) => {
  const router = useRouter();
  const mobileLayout = useMobileLayout();
  const [sidebarActive, setSidebarActive] = useState(!useMobileLayout);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector<RootState, boolean>(
    (state) => state.auth.isAuthenticated
  );
  const isVerifyInProgress = useSelector<RootState, boolean>(
    (state) => state.auth.isVerifyInProgress
  );

  useEffect(() => {
    if (router.pathname !== "/" && router.pathname !== "/index") {
      dispatch(verify());
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!isAuthenticated && !isVerifyInProgress) {
      router.push("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      !isAuthenticated &&
      !isVerifyInProgress &&
      router.pathname !== "/" &&
      router.pathname !== ""
    ) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [isVerifyInProgress]);

  return (
    <>
      <HeadTags />
      {router.pathname !== "/" && router.pathname !== "/index" ? (
        isVerifyInProgress ? (
          <OverlaySpinner active={isVerifyInProgress} onClick={() => {}} />
        ) : !isAuthenticated ? (
          <>
            <Typography variant="h4" padding="4rem">
              You do not have access to this page.
            </Typography>
            <Typography variant="h4" padding="4rem">
              Going back to the login page...
            </Typography>
          </>
        ) : (
          <NonLoginPage
            mobileLayout={mobileLayout}
            sidebarActive={sidebarActive}
            setSidebarActive={setSidebarActive}
            component={component}
            pageProps={pageProps}
          ></NonLoginPage>
        )
      ) : (
        <LoginPage component={component} pageProps={pageProps}></LoginPage>
      )}
    </>
  );
};

const NonLoginPage: React.FC<{
  mobileLayout: boolean;
  sidebarActive: boolean;
  setSidebarActive: (active: boolean) => void;
  component: NextComponentType<NextPageContext, any, {}>;
  pageProps: any;
}> = ({
  mobileLayout,
  sidebarActive,
  setSidebarActive,
  component,
  pageProps,
}) => {
  const pageContentDivRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        style={{
          background: BODY_BACKGROUND,
          width: "100%",
          height: "100%",
        }}
      >
        <Navbar
          useMobileLayout={mobileLayout}
          sidebarActive={sidebarActive}
          setSidebarActive={setSidebarActive}
          sidebarLinks={sidebarLinks}
          topbarActions={topbarActions}
          pageContentDivRef={pageContentDivRef}
        ></Navbar>
        <div style={{ display: "flex", justifyContent: "left" }}>
          {sidebarActive && !mobileLayout && (
            <div style={{ width: SIDEBAR_WIDTH }}></div>
          )}
          <PageContent ref={pageContentDivRef}>
            {React.createElement(component, { ...pageProps })}
          </PageContent>
        </div>
      </div>
      <div id="modalContainer"></div>
    </>
  );
};

const PageContent = styled.div`
  min-height: ${`calc(100vh - ${TOPBAR_HEIGHT})`};
  flex: 1;
  padding: ${BODY_PADDING};
  margin-top: ${TOPBAR_HEIGHT};
  overflow-x: hidden;
`;

const LoginPage: React.FC<{
  component: NextComponentType<NextPageContext, any, {}>;
  pageProps: any;
}> = ({ component, pageProps }) => {
  return React.createElement(component, { ...pageProps });
};

const HeadTags: React.FC<{}> = () => {
  return (
    <Head>
      <title>Baytree Admin Portal</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/admin/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/admin/favicons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/admin/favicons/favicon-16x16.png"
      />
      <link rel="manfest" href="/admin/favicons/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/admin/favicons/safari-pinned-tab.svg"
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff"></meta>
    </Head>
  );
};

export default MyApp;
