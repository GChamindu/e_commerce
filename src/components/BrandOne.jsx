"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";

const BrandOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        
        // Use your existing API – get latest or featured products
        const res = await fetch(`${base}/api/products?limit=20&sort=latest`);
        const json = await res.json();

        if (json.success && json.data) {
          // Pick 12 products with thumbnail
          const items = json.data
            .filter(p => p.thumbnail && p.slug)
            .slice(0, 12);

          setProducts(items);
        }
      } catch (err) {
        console.error("Failed to load brand products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const SampleNextArrow = (props) => (
    <button
      type="button"
      onClick={props.onClick}
      className={`${props.className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
    >
      <i className="ph ph-caret-right" />
    </button>
  );

  const SamplePrevArrow = (props) => (
    <button
      type="button"
      onClick={props.onClick}
      className={`${props.className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
    >
      <i className="ph ph-caret-left" />
    </button>
  );

  const settings = {
    dots: false,
    arrows: true,
    infinite: products.length > 8,
    speed: 1000,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1599, settings: { slidesToShow: 7 } },
      { breakpoint: 1399, settings: { slidesToShow: 6 } },
      { breakpoint: 992,  settings: { slidesToShow: 5 } },
      { breakpoint: 575,  settings: { slidesToShow: 4 } },
      { breakpoint: 424,  settings: { slidesToShow: 3 } },
      { breakpoint: 359,  settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="brand py-80">
      <div className="container container-lg">
        <div className="brand-inner bg-color-one p-24 rounded-16">
          <div className="section-heading">
            <div className="flex-between flex-wrap gap-8">
              <h5 className="mb-0">Popular Products</h5>
              <div className="flex-align gap-16">
                <Link
                  href="/shop"
                  className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                >
                  View All Deals
                </Link>
              </div>
            </div>
          </div>

          <div className="brand-slider arrow-style-two mt-32">
            {loading ? (
              <div className="d-flex gap-16 justify-content-center">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="brand-item">
                    <div className="bg-gray-200 border-rounded w-120 h-80 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <Slider {...settings}>
                {products.map((product) => (
                  <div key={product.id} className="brand-item px-8">
                    <Link href={`/product/${product.slug}`} className="d-block text-center">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        width={140}
                        height={100}
                        className="object-fit-contain rounded-12 hover-shadow transition-2"
                        style={{ maxHeight: "100px" }}
                      />
                    </Link>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center text-gray-500">No products available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandOne;