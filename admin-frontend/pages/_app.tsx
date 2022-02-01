import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (router.pathname !== "/" && router.pathname !== "/index") {
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          ></meta>
        </Head>
        <div style={{ background: "#F9F3EB", width: "100vw", height: "100vh" }}>
          <Navbar></Navbar>
          <div style={{ display: "flex", justifyContent: "left" }}>
            <div style={{ width: "14rem" }}></div>
            <div style={{ padding: "1rem", marginTop: "5rem" }}>
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Component {...pageProps}></Component>;
  }
}

export default MyApp;
