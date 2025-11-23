"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import Image from "next/image";

const FeatureOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured`, {
          next: { revalidate: 3600 }, // Cache 1 hour
        });

        if (!res.ok) throw new Error("Failed");

        const json = await res.json();
        if (json.success && json.data) {
          setProducts(json.data);

          // Optional: Apply SEO from API if available
          if (json.meta) {
            document.title = json.meta.title || "ZeoLankaSpice – Premium Ceylon Spices Sri Lanka";
            const desc = document.querySelector('meta[name="description"]');
            if (desc) desc.content = json.meta.description || "";
          }
        }
      } catch (err) {
        console.error("Featured products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Your exact arrow styles
  const SampleNextArrow = (props) => {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-right" />
      </button>
    );
  };

  const SamplePrevArrow = (props) => {
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
  };

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 10,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1699, settings: { slidesToShow: 9 } },
      { breakpoint: 1599, settings: { slidesToShow: 8 } },
      { breakpoint: 1399, settings: { slidesToShow: 6 } },
      { breakpoint: 992,  settings: { slidesToShow: 5 } },
      { breakpoint: 768,  settings: { slidesToShow: 4 } },
      { breakpoint: 575,  settings: { slidesToShow: 3 } },
      { breakpoint: 424,  settings: { slidesToShow: 2 } },
      { breakpoint: 359,  settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="feature py-80 bg-gray-50">
        <div className="container text-center">
          <div className="spinner-border text-main-600" role="status">
            <span className="visually-hidden">Loading featured spices...</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="feature" id="featureSection">
      <div className="container container-lg">
        <div className="position-relative arrow-center">
          <div className="flex-align gap-16">
            <button
              type="button"
              className="slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
            >
              <i className="ph ph-caret-left" />
            </button>
            <button
              type="button"
              className="slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1"
            >
              <i className="ph ph-caret-right" />
            </button>
          </div>

          <div className="feature-item-wrapper">
            <Slider {...settings}>
              {products.map((product) => (
                <div key={product.slug} className="feature-item text-center px-8">
                  <div className="feature-item__thumb rounded-circle overflow-hidden bg-white shadow-lg">
                    <Link href={`/product/${product.slug}`} className="w-100 h-100 flex-center">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          width={120}
                          height={120}
                          className="object-cover rounded-circle"
                          priority
                        />
                      ) : (
                        <div className="bg-gray-200 w-100 h-100 flex-center">
                          <i className="ph ph-image text-4xl text-gray-400" />
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="feature-item__content mt-16">
                    <h6 className="text-lg mb-4">
                      <Link
                        href={`/product/${product.slug}`}
                        className="text-inherit hover-text-main-600 transition-2"
                      >
                        {product.name}
                      </Link>
                    </h6>
                    <span className="text-sm text-gray-500">Premium Ceylon Spice</span>
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

export default FeatureOne;