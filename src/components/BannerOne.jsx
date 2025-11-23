"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerOne = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`, {
          next: { revalidate: 3600 }, // Cache 1 hour
        });

        if (!res.ok) throw new Error("Failed to load banners");

        const json = await res.json();

        if (json.success && json.data?.length > 0) {
          setBanners(json.data);

          if (json.meta) {
            document.title = json.meta.title || "ZeoLankaSpice – Ceylon Spices Sri Lanka";

            const updateMeta = (name, content) => {
              let tag = document.querySelector(`meta[name="${name}"]`);
              if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("name", name);
                document.head.appendChild(tag);
              }
              tag.setAttribute("content", content);
            };

            const updateProperty = (property, content) => {
              let tag = document.querySelector(`meta[property="${property}"]`);
              if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("property", property);
                document.head.appendChild(tag);
              }
              tag.setAttribute("content", content);
            };

            updateMeta("description", json.meta.description || "");
            updateMeta("keywords", json.meta.keywords || "");
            updateProperty("og:title", json.meta.title || "");
            updateProperty("og:description", json.meta.description || "");
            updateProperty("og:image", json.meta.og_image || "");
            updateProperty("og:url", json.meta.og_url || window.location.href);
          }
        }
      } catch (err) {
        console.error("Banner API Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={` ${className} slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-right" />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-left" />
      </button>
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // Loading State
  if (loading) {
    return (
      <div className="banner py-120 bg-gray-50">
        <div className="container container-lg text-center">
          <div className="spinner-border text-main-600" role="status">
            <span className="visually-hidden">Loading banners...</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback if no banners or error
  if (error || banners.length === 0) {
    return (
      <div className="banner">
        <div className="container container-lg">
          <div className="banner-item rounded-24 overflow-hidden position-relative arrow-center">
            <a
              href="#featureSection"
              className="scroll-down w-84 h-84 text-center flex-center bg-main-600 rounded-circle border border-5 text-white border-white position-absolute start-50 translate-middle-x bottom-0 hover-bg-main-800"
            >
              <span className="icon line-height-0">
                <i className="ph ph-caret-double-down" />
              </span>
            </a>
            <img
              src="/assets/images/bg/banner-bg.png"
              alt=""
              className="banner-img position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1 object-fit-cover rounded-24"
            />
            <div className="banner-slider">
              <div className="banner-slider__item">
                <div className="banner-slider__inner flex-between position-relative">
                  <div className="banner-item__content">
                    <h1 className="banner-item__title bounce">
                      Premium Ceylon Spices from Sri Lanka
                    </h1>
                    <Link
                      href="/shop"
                      className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8"
                    >
                      Shop Now
                      <span className="icon text-xl d-flex">
                        <i className="ph ph-shopping-cart-simple" />
                      </span>
                    </Link>
                  </div>
                  <div className="banner-item__thumb">
                    <img src="/assets/images/thumbs/spices-gift-box.png" alt="Ceylon Spices" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="banner">
      <div className="container container-lg">
        <div className="banner-item rounded-24 overflow-hidden position-relative arrow-center">
          <a
            href="#featureSection"
            className="scroll-down w-84 h-84 text-center flex-center bg-main-600 rounded-circle border border-5 text-white border-white position-absolute start-50 translate-middle-x bottom-0 hover-bg-main-800"
          >
            <span className="icon line-height-0">
              <i className="ph ph-caret-double-down" />
            </span>
          </a>

          <img
            src="/assets/images/bg/banner-bg.png"
            alt=""
            className="banner-img position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1 object-fit-cover rounded-24"
          />

          <div className="banner-slider">
            <Slider {...settings}>
              {banners.map((banner) => (
                <div key={banner.id} className="banner-slider__item">
                  <div className="banner-slider__inner flex-between position-relative">
                    <div className="banner-item__content">
                      <h1
                        className="banner-item__title bounce"
                        dangerouslySetInnerHTML={{ __html: banner.title }}
                      />
                      {banner.button_text && (
                        <Link
                          href={banner.button_link || "/shop"}
                          className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8"
                        >
                          {banner.button_text}
                          <span className="icon text-xl d-flex">
                            <i className="ph ph-shopping-cart-simple" />
                          </span>
                        </Link>
                      )}
                    </div>
                    <div className="banner-item__thumb">
                      <img
                        src={banner.image}
                        alt={banner.title.replace(/<[^>]*>/g, "")}
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerOne;