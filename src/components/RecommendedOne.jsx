"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ProductCard = ({ product }) => {
  const price = Number(product.price) || 0;
  const offerPrice = product.offer_price ? Number(product.offer_price) : null;
  const finalPrice = product.is_offer && offerPrice ? offerPrice : price;
  const discountPercent = offerPrice && price > offerPrice 
    ? Math.round(((price - offerPrice) / price) * 100) 
    : 0;

  return (
    <div className="col-xxl-2 col-lg-3 col-sm-4 col-6">
      <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
        
        {/* Sale Badge - Same as original */}
        {product.is_offer && discountPercent > 0 && (
          <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
            Sale {discountPercent}%
          </span>
        )}

        {/* Product Image */}
        <Link href={`/product/${product.slug}`} className="product-card__thumb flex-center">
          <Image
            src={product.thumbnail || "/assets/images/thumbs/product-img7.png"}
            alt={product.name}
            width={200}
            height={200}
            className="object-fit-contain"
          />
        </Link>

        {/* Content */}
        <div className="product-card__content p-sm-2">
          <h6 className="title text-lg fw-semibold mt-12 mb-8">
            <Link href={`/product/${product.slug}`} className="link text-line-2">
              {product.name}
            </Link>
          </h6>

          {/* Store Info */}
          <div className="flex-align gap-4">
            <span className="text-main-600 text-md d-flex">
              <i className="ph-fill ph-storefront" />
            </span>
            <span className="text-gray-500 text-xs">By ZeoLankaSpice</span>
          </div>

          {/* Price & Old Price */}
          <div className="product-card__content mt-12">
            <div className="product-card__price mb-8">
              <span className="text-heading text-md fw-semibold">
                Rs. {finalPrice.toFixed(2)}{" "}
                <span className="text-gray-500 fw-normal">/Qty</span>
              </span>
              {product.is_offer && offerPrice < price && (
                <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                  Rs. {price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex-align gap-6">
              <span className="text-xs fw-bold text-gray-600">4.8</span>
              <span className="text-15 fw-bold text-warning-600 d-flex">
                <i className="ph-fill ph-star" />
              </span>
              <span className="text-xs fw-bold text-gray-600">(17k)</span>
            </div>

            {/* Add To Cart Button - EXACT SAME STYLE */}
            <Link
              href={`/product/${product.slug}`}
              className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
            >
              Add To Cart <i className="ph ph-shopping-cart" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendedOne = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        const json = await res.json();
        if (json.success) {
          setCategories([
            { id: "all", name: "All", slug: "all" },
            ...json.data.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
          ]);
        }
      } catch (err) {
        console.error("Categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products per Tab
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categories.length) return;

      setLoading(true);
      try {
        const category = categories.find(c => c.id === activeTab);
        const slug = activeTab === "all" ? "" : category?.slug;

        const url = slug
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${slug}?limit=20`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=20`;

        const res = await fetch(url, { next: { revalidate: 1800 } });
        const json = await res.json();

        if (json.success) {
          setProducts(prev => ({ ...prev, [activeTab]: json.data }));
        }
      } catch (err) {
        console.error("Products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab, categories]);

  return (
    <section className="recommended">
      <div className="container container-lg">
        <div className="section-heading flex-between flex-wrap gap-16">
          <h5 className="mb-0">Recommended for you</h5>

          {/* Original Tab Styles */}
          <ul className="nav common-tab nav-pills" id="pills-tab" role="tablist">
            {categories.map((cat) => (
              <li key={cat.id} className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === cat.id ? "active" : ""}`}
                  onClick={() => setActiveTab(cat.id)}
                  type="button"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="tab-content" id="pills-tabContent">
          <div className="tab-pane fade show active">
            <div className="row g-12">
              {loading ? (
                [...Array(12)].map((_, i) => (
                  <div key={i} className="col-xxl-2 col-lg-3 col-sm-4 col-6">
                    <div className="product-card h-100 p-8 border border-gray-100 rounded-16 animate-pulse">
                      <div className="h-200 bg-gray-200 rounded mb-16" />
                      <div className="h-20 bg-gray-200 rounded mb-8" />
                      <div className="h-16 bg-gray-200 rounded w-75" />
                    </div>
                  </div>
                ))
              ) : products[activeTab]?.length > 0 ? (
                products[activeTab].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-12 text-center py-80">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedOne;