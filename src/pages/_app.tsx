import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { store } from "@/store/store";
import "../core/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app">
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}
