import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "../components/Navbar/navbar";
import { useRouter } from "next/router";
import siteContext, {
  defaultSiteContext,
  SiteContextInterface,
} from "../context/siteContext";
import { useState } from "react";
import { BODY_BACKGROUND, SIDEBAR_WIDTH, TOPBAR_HEIGHT } from "../context/constants";
import sidebarLinks from "../components/Navbar/sidebarLinks";
import topbarActions from "../components/Navbar/topbarActions";
import useMobileLayout from "../hooks/useMobileLayout";

export const BODY_PADDING = "1rem";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const mobileLayout = useMobileLayout();
  const [sidebarActive, setSidebarActive] = useState(!useMobileLayout);

  const [siteContextValue, setSiteContextValue] =
    useState<SiteContextInterface>({
      ...defaultSiteContext,
      setSiteContext: (newSiteContext) => {
        setSiteContextValue({ ...siteContextValue, ...newSiteContext });
      },
    });

  if (router.pathname !== "/" && router.pathname !== "/index") {
    return (
      <>
        <HeadTags />
        <siteContext.Provider value={siteContextValue}>
          <div
            style={{
              background: BODY_BACKGROUND,
              width: "100vw",
              height: "100vh",
            }}
          >
            <Navbar
              useMobileLayout={mobileLayout}
              sidebarActive={sidebarActive}
              setSidebarActive={setSidebarActive}
              sidebarLinks={sidebarLinks}
              topbarActions={topbarActions}
            ></Navbar>
            <div style={{ display: "flex", justifyContent: "left" }}>
              {sidebarActive && !mobileLayout && (
                <div style={{ width: SIDEBAR_WIDTH }}></div>
              )}
              <div style={{ padding: BODY_PADDING, marginTop: TOPBAR_HEIGHT }}>
                <Component {...pageProps} />
              </div>
            </div>
          </div>
          <div id="modalContainer"></div>
        </siteContext.Provider>
      </>
    );
  } else {
    return (
      <>
        <HeadTags />
        <Component {...pageProps}></Component>
      </>
    );
  }
}

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
        href="/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicons/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicons/safari-pinned-tab.svg"
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff"></meta>
    </Head>
  );
};

export default MyApp;
