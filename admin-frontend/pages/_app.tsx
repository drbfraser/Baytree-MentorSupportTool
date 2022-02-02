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

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

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
            style={{ background: "#F9F3EB", width: "100vw", height: "100vh" }}
          >
            <Navbar></Navbar>
            <div style={{ display: "flex", justifyContent: "left" }}>
              <div style={{ width: "14rem" }}></div>
              <div style={{ padding: "1rem", marginTop: "5rem" }}>
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
