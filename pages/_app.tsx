import "../styles/globals.less";
import type { AppProps } from "next/app";

function WhalesTracker({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

export default WhalesTracker;
