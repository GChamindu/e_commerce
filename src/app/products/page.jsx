import Breadcrumb from "@/components/Breadcrumb";
import FooterTwo from "@/components/FooterTwo";
import HeaderOne from "@/components/HeaderOne";
import HeaderTwo from "@/components/HeaderTwo";
import ShippingTwo from "@/components/ShippingTwo";
import ShopSection from "@/components/ShopSection";
import ColorInit from "@/helper/ColorInit";
import Preloader from "@/helper/Preloader";
import ScrollToTopInit from "@/helper/ScrollToTopInit";

export const metadata = {
  title: "Zelone Spice - E-commerce Top-Quality Ceylon Spices in Sri Lanka | Pure, Fresh & Organic",
  description:
    "Zelone Spice is a comprehensive and versatile Top-Quality Ceylon Spices in Sri Lanka | Pure, Fresh & Organic designed for e-commerce platforms, specifically tailored for multi vendor marketplaces. With its modern design and extensive feature set, Zelone Spice provides everything you need to create a robust and user-friendly online marketplace..",
};

const page = () => {
  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* ScrollToTop */}
      <ScrollToTopInit color='#FA6400' />

      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      {/* <HeaderTwo category={true} /> */}

      <HeaderOne />

      {/* Breadcrumb */}
      <Breadcrumb title={"Products"} />

      {/* ShopSection */}


      
      <ShopSection />

      {/* ShippingTwo */}
      <ShippingTwo />

      {/* FooterTwo */}
      <FooterTwo />
    </>
  );
};

export default page;
