import BootstrapInit from "@/helper/BootstrapInit";
import RouteScrollToTop from "@/helper/RouteScrollToTop";
import "./font.css";
import "./globals.scss";
import PhosphorIconInit from "@/helper/PhosphorIconInit";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata = {
  title:
    "Zeloan Spice – Buy 100% Pure Ceylon Spices Online | Premium Cinnamon, Pepper & More",
  description:
    "Shop authentic Ceylon spices directly from Sri Lanka. Premium organic cinnamon, black pepper, cloves, cardamom & spice powders. Export quality, vacuum-packed freshness, worldwide shipping.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <GoogleAnalytics />
        <BootstrapInit />
        <PhosphorIconInit />
        <RouteScrollToTop />
        {children}
      </body>
    </html>
  );
}
