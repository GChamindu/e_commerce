"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = "G-Q81DFQ99W0";

export default function GoogleAnalytics() {

  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.startsWith("G-XXXX")) return null;

  return (
    <>
      {/* Load gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname + window.location.search,
          });
        `}
      </Script>
    </>
  );
}