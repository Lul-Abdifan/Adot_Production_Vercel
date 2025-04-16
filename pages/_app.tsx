import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as dotenv from 'dotenv';
import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store";

dotenv.config();

const poppins = Poppins({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <SessionProvider session={session}>
            <Provider store={store}>
                <main className={poppins.className}>
                    <div className="bg-primary bg-opacity-5">
                        <Component {...pageProps} />
                    </div>
                </main>
            </Provider>
        </SessionProvider>
    );
}
