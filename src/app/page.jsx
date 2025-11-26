import BannerOne from "@/components/BannerOne";
import BestSellsOne from "@/components/BestSellsOne";
import BottomFooter from "@/components/BottomFooter";
import BrandOne from "@/components/BrandOne";
import DeliveryOne from "@/components/DeliveryOne";
import FeatureOne from "@/components/FeatureOne";
import FlashSalesOne from "@/components/FlashSalesOne";
import FooterOne from "@/components/FooterOne";
import HeaderOne from "@/components/HeaderOne";
import HotDealsOne from "@/components/HotDealsOne";
import NewArrivalOne from "@/components/NewArrivalOne";
import NewsletterOne from "@/components/NewsletterOne";
import OfferOne from "@/components/OfferOne";
import OrganicOne from "@/components/OrganicOne";
import ProductListOne from "@/components/ProductListOne";
import PromotionalOne from "@/components/PromotionalOne";
import RecommendedOne from "@/components/RecommendedOne";
import ShippingOne from "@/components/ShippingOne";
import ShortProductOne from "@/components/ShortProductOne";
import TopVendorsOne from "@/components/TopVendorsOne";
import ColorInit from "@/helper/ColorInit";
import Preloader from "@/helper/Preloader";
import ScrollToTopInit from "@/helper/ScrollToTopInit";

export const metadata = {
title: "Zeloan Spice – Buy 100% Pure Ceylon Spices Online | Premium Cinnamon, Pepper & More",

description:
"Shop authentic Ceylon spices directly from Sri Lanka. Premium organic cinnamon, black pepper, cloves, cardamom & spice powders. Export quality, vacuum-packed freshness, worldwide shipping.",};

const page = () => {
  return (
    <>
      {/* Preloader */}
      <Preloader />

      {/* ScrollToTop */}
      <ScrollToTopInit color='#299E60' />

      {/* ColorInit */}
      <ColorInit color={false} />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <BannerOne />

      {/* FeatureOne */}
      <FeatureOne />

      {/* PromotionalOne */}
      <PromotionalOne />

      {/* FlashSalesOne */}
      <FlashSalesOne />

      {/* ProductListOne */}
      {/* <ProductListOne /> */}

      {/* OfferOne */}
      <OfferOne />

      {/* RecommendedOne */}
      <RecommendedOne />

      {/* HotDealsOne */}
      <HotDealsOne />

      {/* TopVendorsOne */}
      {/* <TopVendorsOne /> */}

      {/* BestSellsOne */}
      <BestSellsOne />

      {/* DeliveryOne */}
      <DeliveryOne />

      {/* OrganicOne */}
      {/* <OrganicOne /> */}

      {/* ShortProductOne */}
      <ShortProductOne />

      {/* BrandOne */}
      {/* <BrandOne /> */}

      {/* NewArrivalOne */}
      <NewArrivalOne />

      {/* ShippingOne */}
      <ShippingOne />

      {/* NewsletterOne */}
      <NewsletterOne />

      {/* FooterOne */}
      <FooterOne />

      {/* BottomFooter */}
      <BottomFooter />
    </>
  );
};

export default page;
