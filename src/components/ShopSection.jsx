"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ShopSection = () => {
  const [grid, setGrid] = useState(true); // true = grid, false = list
  const [active, setActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const sidebarController = () => setActive(!active);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${base}/api/categories`);
        const json = await res.json();
        if (json.success) {
          setCategories(json.data || []);
        }
      } catch (err) {
        console.error("Categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        let url = `${base}/api/products?limit=20`;

        if (selectedCategory !== "all") {
          const cat = categories.find((c) => c.id === selectedCategory);
          if (cat) {
            url = `${base}/api/products/category/${cat.slug}?limit=20`;
          }
        }

        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setProducts(json.data || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Products error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0 || selectedCategory === "all") {
      fetchProducts();
    }
  }, [selectedCategory, categories]);

  // Product Card Component (exact design you wanted)
  const ProductCard = ({ product }) => {
    const price = Number(product.price) || 0;
    const offerPrice = product.offer_price ? Number(product.offer_price) : null;
    const finalPrice = product.is_offer && offerPrice ? offerPrice : price;

    // Optional: make these dynamic from your API later
    const rating = 4.8;
    const reviews = "17k";
    const sold = 18;
    const stock = 35;

    return (
      <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
        <Link
          href={`/product/${product.slug}`}
          className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative overflow-hidden"
        >
          <Image
            src={
              product.thumbnail || "/assets/images/thumbs/product-two-img1.png"
            }
            alt={product.name}
            width={300}
            height={300}
            className="w-auto max-w-unset cover-img"
          />

          {/* Best Sale Badge - show if product.is_best_sale = true */}
          {product.is_best_sale && (
            <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0 z-10">
              Best Sale
            </span>
          )}

          {/* Sale % Badge */}
          {product.is_offer && offerPrice < price && (
            <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0 z-10">
              Sale {Math.round(((price - offerPrice) / price) * 100)}%
            </span>
          )}
        </Link>

        <div className="product-card__content mt-16">
          <h6 className="title text-lg fw-semibold mt-12 mb-8">
            <Link
              href={`/product/${product.slug}`}
              className="link text-line-2 text-gray-900 hover-text-main-600"
            >
              {product.name}
            </Link>
          </h6>

          {/* Rating */}
          <div className="flex-align mb-20 mt-16 gap-6">
            <span className="text-xs fw-medium text-gray-500">{rating}</span>
            <span className="text-15 fw-medium text-warning-600 d-flex">
              <i className="ph-fill ph-star" />
            </span>
            <span className="text-xs fw-medium text-gray-500">({reviews})</span>
          </div>

          {/* Progress Bar - Sold Count */}
          <div className="mt-8">
            <div
              className="progress w-100 bg-color-three rounded-pill h-4"
              role="progressbar"
            >
              <div
                className="progress-bar bg-main-two-600 rounded-pill"
                style={{ width: `${(sold / stock) * 100}%` }}
              />
            </div>
            <span className="text-gray-900 text-xs fw-medium mt-8">
              Sold: {sold}/{stock}
            </span>
          </div>

          {/* Price */}
          <div className="product-card__price my-20">
            {product.is_offer && offerPrice < price && (
              <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                Rs. {price.toFixed(2)}
              </span>
            )}
            <span className="text-heading text-md fw-semibold">
              Rs. {finalPrice.toFixed(2)}{" "}
              <span className="text-gray-500 fw-normal">/Qty</span>
            </span>
          </div>

          {/* Add to Cart Button */}
          <Link
            href={`/product/${product.slug}`}
            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium w-100"
          >
            Add To Cart <i className="ph ph-shopping-cart" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section className="shop py-80">
      <div
        className={`side-overlay ${active && "show"}`}
        onClick={sidebarController}
      ></div>

      <div className="container container-lg">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className={`shop-sidebar ${active && "active"}`}>
              <button
                onClick={sidebarController}
                type="button"
                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
              >
                <i className="ph ph-x"></i>
              </button>

              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Product Category
                </h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  <li className="mb-24">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`text-start w-100 text-gray-900 hover-text-main-600 ${
                        selectedCategory === "all"
                          ? "fw-bold text-main-600"
                          : ""
                      }`}
                    >
                      All Products ({products.length})
                    </button>
                  </li>
                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => p.category_id === cat.id
                    ).length;
                    return (
                      <li key={cat.id} className="mb-24">
                        <button
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`text-start w-100 text-gray-900 hover-text-main-600 ${
                            selectedCategory === cat.id
                              ? "fw-bold text-main-600"
                              : ""
                          }`}
                        >
                          {cat.name} ({count})
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="shop-sidebar__box rounded-8">
                <img
                  src="assets/images/thumbs/advertise-img1.png"
                  alt="Advertisement"
                  className="w-100"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Top Bar */}
            <div className="flex-between gap-16 flex-wrap mb-40">
              <span className="text-gray-900">
                Showing {products.length} results
              </span>
              <div className="position-relative flex-align gap-16 flex-wrap">
                {/* Grid / List Toggle */}
                <div className="list-grid-btns flex-align gap-16">
                  {/* <button
                    onClick={() => setGrid(false)}
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
                      !grid && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph-bold ph-list-dashes"></i>
                  </button> */}
                  <button
                    onClick={() => setGrid(true)}
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${
                      grid && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph ph-squares-four"></i>
                  </button>
                </div>

                {/* Sort & Mobile Filter */}
                <div className="position-relative text-gray-500 flex-align gap-4 text-14">
                  <label
                    htmlFor="sorting"
                    className="text-inherit flex-shrink-0"
                  >
                    Sort by:
                  </label>
                  <select
                    defaultValue={1}
                    className="form-control common-input px-14 py-14 text-inherit rounded-6 w-auto"
                    id="sorting"
                  >
                    <option value={1}>Popular</option>
                    <option value={2}>Latest</option>
                    <option value={3}>Price: Low to High</option>
                    <option value={4}>Price: High to Low</option>
                  </select>
                </div>

                <button
                  onClick={sidebarController}
                  className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                >
                  <i className="ph-bold ph-funnel"></i>
                </button>
              </div>
            </div>

            {/* Products Grid / List */}
            <div className={`list-grid-wrapper ${!grid && "list-view"}`}>
              {loading ? (
                <div className="text-center py-80">
                  <div className="spinner-border text-main-600" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-80">
                  <p className="text-xl text-gray-500">
                    No products found in this category.
                  </p>
                </div>
              ) : (
                <div
                  className={
                    grid
                      ? "row row-cols-xxl-4 row-cols-xl-3 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 gy-4"
                      : "row gy-4"
                  }
                >
                  {products.map((product) => (
                    <div key={product.id} className={grid ? "col" : "col-12"}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <ul className="pagination flex-center flex-wrap gap-16 mt-48">
              <li className="page-item">
                <Link
                  className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                  href="#"
                >
                  <i className="ph-bold ph-arrow-left"></i>
                </Link>
              </li>
              <li className="page-item active">
                <Link
                  className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium bg-main-600 text-white border border-main-600"
                  href="#"
                >
                  01
                </Link>
              </li>
              <li className="page-item">
                <Link
                  className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                  href="#"
                >
                  <i className="ph-bold ph-arrow-right"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
