"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";

const ShortProductOne = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // 1. Fetch categories
        const catRes = await fetch(`${base}/api/categories`);
        const catJson = await catRes.json();

        if (!catJson.success || !catJson.data || catJson.data.length === 0) {
          setCategories([]);
          setLoading(false);
          return;
        }

        // Take first 4 categories
        const selectedCats = catJson.data.slice(0, 4);

        // 2. Fetch products for each category
        const productPromises = selectedCats.map(cat =>
          fetch(`${base}/api/products/category/${cat.slug}?limit=8`)
            .then(r => r.json())
            .catch(() => ({ success: false, data: [] })) // safety
        );

        const productResults = await Promise.all(productPromises);

        // 3. Combine category + products
        const updatedCategories = selectedCats.map((cat, index) => {
          const result = productResults[index];
          // Your API returns { success: true, data: [...] } → use result.data
          const products = result.success !== false && result.data ? result.data : [];
          return { ...cat, products };
        });

        setCategories(updatedCategories);
      } catch (err) {
        console.error("ShortProductOne error:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 768, settings: { arrows: false } },
      { breakpoint: 575, settings: { arrows: true } },
    ],
  };

  const ProductItem = ({ product }) => {
    if (!product || !product.id) {
      return (
        <div className="flex-align gap-16 mb-40">
          <div className="w-90 h-90 bg-gray-200 rounded-12 animate-pulse" />
          <div className="flex-1 space-y-8">
            <div className="h-16 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-16 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      );
    }

    const price = Number(product.price) || 0;
    const offerPrice = product.offer_price ? Number(product.offer_price) : null;
    const finalPrice = product.is_offer && offerPrice ? offerPrice : price;

    return (
      <div className="flex-align gap-16 mb-40">
        <div className="w-90 h-90 rounded-12 border border-gray-100 flex-shrink-0">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.thumbnail || "/assets/images/thumbs/short-product-img1.png"}
              alt={product.name}
              width={90}
              height={90}
              className="object-fit-cover w-100 h-100 rounded-12"
            />
          </Link>
        </div>
        <div className="product-card__content mt-12">
          <div className="flex-align gap-6">
            <span className="text-xs fw-bold text-gray-500">4.9</span>
            <span className="text-15 fw-bold text-warning-600 d-flex">
              <i className="ph-fill ph-star" />
            </span>
            <span className="text-xs fw-bold text-gray-500">(12k)</span>
          </div>
          <h6 className="title text-lg fw-semibold mt-8 mb-8">
            <Link href={`/product/${product.slug}`} className="link text-line-1 hover-text-main-600">
              {product.name}
            </Link>
          </h6>
          <div className="product-card__price flex-align gap-8">
            <span className="text-heading text-md fw-semibold">
              Rs. {finalPrice.toFixed(2)}
            </span>
            {product.is_offer && offerPrice < price && (
              <span className="text-gray-400 text-md fw-semibold text-decoration-line-through ms-8">
                Rs. {price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProductGroup = ({ category }) => {
    const products = category.products || [];
    const slides = products.length > 0 
      ? [products.slice(0, 4), products.slice(4, 8)]
      : [[{}, {}, {}, {}], [{}, {}, {}, {}]];

    return (
      <div className="col-xxl-3 col-lg-4 col-sm-6">
        <div className="p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
          <div className="p-16 bg-main-50 rounded-16 mb-32">
            <h6 className="underlined-line position-relative mb-0 pb-16 d-inline-block text-heading fw-bold">
              {category.name}
            </h6>
          </div>
          <div className="short-product-list arrow-style-two">
            <Slider {...settings}>
              {slides.map((slide, idx) => (
                <div key={idx}>
                  {slide.map((product, i) => (
                    <ProductItem key={product.id || `skeleton-${idx}-${i}`} product={product} />
                  ))}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="short-product py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="col-xxl-3 col-lg-4 col-sm-6">
                <div className="p-16 border border-gray-100 rounded-16">
                  <div className="p-16 bg-gray-100 rounded-16 mb-32 animate-pulse">
                    <div className="h-24 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-32">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex-align gap-16 animate-pulse">
                        <div className="w-90 h-90 bg-gray-200 rounded-12" />
                        <div className="flex-1 space-y-8">
                          <div className="h-16 bg-gray-200 rounded w-32" />
                          <div className="h-20 bg-gray-200 rounded" />
                          <div className="h-16 bg-gray-200 rounded w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((cat) => <ProductGroup key={cat.id} category={cat} />)
          ) : (
            <div className="col-12 text-center py-80">
              <p className="text-gray-500 text-lg">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortProductOne;