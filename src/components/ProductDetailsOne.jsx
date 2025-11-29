"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const ProductDetailsOne = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch product by slug
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${base}/api/products/${slug}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Product not found");
        const json = await res.json();

        if (json.success && json.data) {
          setProduct(json.data);

          // Set first image as main (thumbnail or first gallery image)
          const firstImage =
            json.data.thumbnail ||
            (json.data.images && json.data.images[0]) ||
            "/assets/images/thumbs/product-details-thumb1.png";

          setMainImage(firstImage);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Quantity controls
  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // CORRECT: Build all images array (thumbnail + additional images)
  const allImages = React.useMemo(() => {
    if (!product) return [];

    const images = [];

    // Add thumbnail first (if exists)
    if (product.thumbnail) {
      images.push(product.thumbnail);
    }

    // Add all additional images (already full URLs from backend!)
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((url) => {
        if (url && !images.includes(url)) {
          images.push(url);
        }
      });
    }

    // Fallback image if nothing
    if (images.length === 0) {
      images.push("/assets/images/thumbs/product-details-thumb1.png");
    }

    return images;
  }, [product]);

  const settingsThumbs = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
    ],
  };

  // Safe sections parsing
  const sections = React.useMemo(() => {
    if (!product?.sections) return {};

    if (typeof product.sections === "object" && product.sections !== null) {
      return product.sections;
    }

    if (typeof product.sections === "string") {
      try {
        return JSON.parse(product.sections);
      } catch (e) {
        console.error("Invalid sections JSON:", e);
        return {};
      }
    }

    return {};
  }, [product]);

  // Loading state
  if (loading) {
    return <div className="py-80 text-center">Loading product...</div>;
  }

  // Not found
  if (!product) {
    return <div className="py-80 text-center text-danger">Product not found</div>;
  }

  // Rest of your component continues here...
  return (
    <section className="product-details py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-9">
            <div className="row gy-4">
              <div className="col-xl-6">
                <div className="product-details__left">
                  <div className="product-details__thumb-slider border border-gray-100 rounded-16">
                    <div className="">
                      <div className="product-details__thumb flex-center h-100">
                        <img src={mainImage} alt="Main Product" />
                      </div>
                    </div>
                  </div>
                  {/* Product Thumbnail Slider */}



                 {allImages.length > 1 && (
                    <div className="mt-24">
                      <div className="product-details__images-slider">
                        <Slider {...settingsThumbs}>
                          {allImages.map((image, index) => (
                            <div
                              key={index}
                              className={`center max-w-120 max-h-120 h-100 flex-center border rounded-16 p-8 cursor-pointer transition-all mx-2
                                ${
                                  mainImage === image
                                    ? "border-main-600 shadow-lg ring-4 ring-main-100"
                                    : "border-gray-100 hover:border-main-200"
                                }`}
                              onClick={() => setMainImage(image)}
                            >
                              <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="max-w-full max-h-full object-cover rounded-8"
                                onError={(e) => {
                                  e.target.src = "/assets/images/thumbs/product-details-thumb1.png";
                                }}
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    </div>
                  )}



                </div>
              </div>
              <div className="col-xl-6">
                <div className="product-details__content">
                  <h5 className="mb-12">{product.name}</h5>
                  <div className="flex-align flex-wrap gap-12">
                    <div className="flex-align gap-12 flex-wrap">
                      <div className="flex-align gap-8">
                        <span className="text-15 fw-medium text-warning-600 d-flex">
                          <i className="ph-fill ph-star" />
                        </span>
                        <span className="text-15 fw-medium text-warning-600 d-flex">
                          <i className="ph-fill ph-star" />
                        </span>
                        <span className="text-15 fw-medium text-warning-600 d-flex">
                          <i className="ph-fill ph-star" />
                        </span>
                        <span className="text-15 fw-medium text-warning-600 d-flex">
                          <i className="ph-fill ph-star" />
                        </span>
                        <span className="text-15 fw-medium text-warning-600 d-flex">
                          <i className="ph-fill ph-star" />
                        </span>
                      </div>
                      <span className="text-sm fw-medium text-neutral-600">
                        4.7 Star Rating
                      </span>
                      <span className="text-sm fw-medium text-gray-500">
                        (21,671)
                      </span>
                    </div>
                    <span className="text-sm fw-medium text-gray-500">|</span>
                    <span className="text-gray-900">
                      {" "}
                      <span className="text-gray-400">SKU:</span>EB4DRP{" "}
                    </span>
                  </div>
                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                  <p className="text-gray-700">{product.short_description}</p>
                  <div className="mt-32 flex-align flex-wrap gap-32">
                    <div className="flex-align gap-8">
                      <h4 className="mb-0">Rs. {product.price}</h4>
                      {/* <span className="text-md text-gray-500">$38.00</span> */}
                    </div>
                    <Link href="#" className="btn btn-main rounded-pill">
                      Order on What'sApp
                    </Link>
                  </div>
                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />

                  <span className="text-gray-900 d-block mb-8">Quantity:</span>
                  <div className="flex-between gap-16 flex-wrap">
                    <div className="flex-align flex-wrap gap-16">
                      <div className="border border-gray-100 rounded-pill py-9 px-16 flex-align">
                        <button
                          onClick={decrementQuantity}
                          type="button"
                          className="quantity__minus p-4 text-gray-700 hover-text-main-600 flex-center"
                        >
                          <i className="ph ph-minus" />
                        </button>
                        <input
                          type="number"
                          className="quantity__input border-0 text-center w-32"
                          value={quantity}
                          readOnly
                        />
                        <button
                          onClick={incrementQuantity}
                          type="button"
                          className="quantity__plus p-4 text-gray-700 hover-text-main-600 flex-center"
                        >
                          <i className="ph ph-plus" />
                        </button>
                      </div>
                      <Link
                        href="#"
                        className="btn btn-main rounded-pill flex-align d-inline-flex gap-8 px-48"
                      >
                        {" "}
                        <i className="ph ph-shopping-cart" /> Add To Cart
                      </Link>
                    </div>
                    <div className="flex-align gap-12">
                      <Link
                        href="#"
                        className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                      >
                        <i className="ph ph-heart" />
                      </Link>
                      <Link
                        href="#"
                        className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                      >
                        <i className="ph ph-shuffle" />
                      </Link>
                      <Link
                        href="#"
                        className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                      >
                        <i className="ph ph-share-network" />
                      </Link>
                    </div>
                  </div>
                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="product-details__sidebar border border-gray-100 rounded-16 overflow-hidden">
              <div className="p-24">
                <div className="flex-between bg-main-600 rounded-pill p-8">
                  <div className="flex-align gap-8">
                    <span className="w-44 h-44 bg-white rounded-circle flex-center text-2xl">
                      <i className="ph ph-storefront" />
                    </span>
                    <span className="text-white">by Zeloan Spice</span>
                  </div>
                  <Link
                    href="/products"
                    className="btn btn-white rounded-pill text-uppercase"
                  >
                    View Store
                  </Link>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-truck" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Fast Delivery</h6>
                  <p className="text-gray-700">
                    Lightning-fast shipping, guaranteed.
                  </p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-arrow-u-up-left" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Free 90-day returns</h6>
                  <p className="text-gray-700">
                    Shop risk-free with easy returns.
                  </p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-check-circle" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">
                    Pickup available at Shop location
                  </h6>
                  <p className="text-gray-700">Usually ready in 24 hours</p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-credit-card" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Payment</h6>
                  <p className="text-gray-700">
                    Payment upon receipt of goods, Payment by card in the
                    department, Google Pay, Online card.
                  </p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-check-circle" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Warranty</h6>
                  <p className="text-gray-700">
                    The Consumer Protection Act does not provide for the return
                    of this product of proper quality.
                  </p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-package" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Packaging</h6>
                  <p className="text-gray-700">
                    Research &amp; development value proposition graphical user
                    interface investor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-80">
          <div className="product-dContent border rounded-24">
            <div className="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16">
              <ul
                className="nav common-tab nav-pills mb-3"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-description-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-description"
                    type="button"
                    role="tab"
                    aria-controls="pills-description"
                    aria-selected="true"
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-reviews-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-reviews"
                    type="button"
                    role="tab"
                    aria-controls="pills-reviews"
                    aria-selected="false"
                  >
                    Reviews
                  </button>
                </li>
              </ul>
              <Link
                href="#"
                className="btn bg-color-one rounded-16 flex-align gap-8 text-main-600 hover-bg-main-600 hover-text-white"
              >
                <img src="assets/images/icon/satisfaction-icon.png" alt="" />
                100% Satisfaction Guaranteed
              </Link>
            </div>
            <div className="product-dContent__box">
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-description"
                  role="tabpanel"
                  aria-labelledby="pills-description-tab"
                  tabIndex={0}
                >
                  <div className="mb-40">
                    <h6 className="mb-24">Product Description</h6>
                    <p>
                      {product.short_description}.{" "}
                    </p>
                    {/* <p>
                      Morbi ut sapien vitae odio accumsan gravida. Morbi vitae
                      erat auctor, eleifend nunc a, lobortis neque. Praesent
                      aliquam dignissim viverra. Maecenas lacus odio, feugiat eu
                      nunc sit amet, maximus sagittis dolor. Vivamus nisi
                      sapien, elementum sit amet eros sit amet, ultricies cursus
                      ipsum. Sed consequat luctus ligula. Curabitur laoreet
                      rhoncus blandit. Aenean vel diam ut arcu pharetra
                      dignissim ut sed leo. Vivamus faucibus, ipsum in
                      vestibulum vulputate, lorem orci convallis quam, sit amet
                      consequat nulla felis pharetra lacus. Duis semper erat
                      mauris, sed egestas purus commodo vel.
                    </p> */}
                    <ul className="list-inside mt-32 ms-16">
                      <li className="text-gray-400 mb-4">
                        8.0 oz. bag of LAY'S Classic Potato Chips
                      </li>
                      <li className="text-gray-400 mb-4">
                        Tasty LAY's potato chips are a great snack
                      </li>
                      <li className="text-gray-400 mb-4">
                        Includes three ingredients: potatoes, oil, and salt
                      </li>
                      <li className="text-gray-400 mb-4">
                        Gluten free product
                      </li>
                    </ul>



                    <ul className="mt-32">
                      <li className="text-gray-400 mb-4">Made in Sri Lanka</li>
                      <li className="text-gray-400 mb-4">Ready To Eat.</li>
                    </ul>
                  </div>

                  {/* <div className="mb-40">
                    <h6 className="mb-24">Product Specifications</h6>
                    <ul className="mt-32">
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Product Type:
                          <span className="text-gray-500">
                            {" "}
                            Chips &amp; Dips
                          </span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Product Name:
                          <span className="text-gray-500">
                            {" "}
                            Potato Chips Classic{" "}
                          </span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Brand:
                          <span className="text-gray-500"> Lay's</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          FSA Eligible:
                          <span className="text-gray-500"> No</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Size/Count:
                          <span className="text-gray-500"> 8.0oz</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Item Code:
                          <span className="text-gray-500"> 331539</span>
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          Ingredients:
                          <span className="text-gray-500">
                            {" "}
                            Potatoes, Vegetable Oil, and Salt.
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="mb-40">
                    <h6 className="mb-24">Nutrition Facts</h6>
                    <ul className="mt-32">
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          {" "}
                          Total Fat 10g 13%
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          {" "}
                          Saturated Fat 1.5g 7%
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          {" "}
                          Cholesterol 0mg 0%
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          {" "}
                          Sodium 170mg 7%
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-heading fw-medium">
                          {" "}
                          Potassium 350mg 6%
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="mb-0">
                    <h6 className="mb-24">More Details</h6>
                    <ul className="mt-32">
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          Lunarlon midsole delivers ultra-plush responsiveness
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          Encapsulated Air-Sole heel unit for lightweight
                          cushioning
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          Colour Shown: Ale Brown/Black/Goldtone/Ale Brown
                        </span>
                      </li>
                      <li className="text-gray-400 mb-14 flex-align gap-14">
                        <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                          <i className="ph ph-check" />
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          Style: 805899-202
                        </span>
                      </li>
                    </ul>
                  </div> */}

                  {/* DYNAMIC SECTIONS – Replace your entire hard-coded block with this */}
                  {Object.keys(sections).length > 0 ? (
                    Object.values(sections).map((section, idx) => {
                      const sectionType = section.type;
                      const titleMap = {
                        product_specifications: "Product Specifications",
                        ingredients: "Nutrition Facts",
                        more_details: "More Details",
                      };

                      const title = titleMap[sectionType] || sectionType;

                      return (
                        <div key={idx} className="mb-40">
                          <h6 className="mb-24">{title}</h6>
                          <ul className="mt-32">
                            {section.labels.map((item, i) => (
                              <li
                                key={i}
                                className="text-gray-400 mb-14 flex-align gap-14"
                              >
                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                  <i className="ph ph-check" />
                                </span>

                                {/* If it's Product Specifications → show "Key: Value" */}
                                {sectionType === "product_specifications" &&
                                item.value ? (
                                  <span className="text-heading fw-medium">
                                    {item.key}:
                                    <span className="text-gray-500">
                                      {" "}
                                      {item.value}
                                    </span>
                                  </span>
                                ) : (
                                  /* For Nutrition Facts & More Details → show only key */
                                  <span
                                    className={
                                      sectionType === "product_specifications"
                                        ? "text-heading fw-medium"
                                        : "text-gray-500"
                                    }
                                  >
                                    {item.key}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-600">
                      No additional information available for this product.
                    </p>
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-reviews"
                  role="tabpanel"
                  aria-labelledby="pills-reviews-tab"
                  tabIndex={0}
                >
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <h6 className="mb-24">Product Description</h6>
                      <div className="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44">
                        <img
                          src="assets/images/thumbs/comment-img1.png"
                          alt=""
                          className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                        />
                        <div className="flex-grow-1">
                          <div className="flex-between align-items-start gap-8 ">
                            <div className="">
                              <h6 className="mb-12 text-md">Nicolas cage</h6>
                              <div className="flex-align gap-8">
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-800 text-xs">
                              3 Days ago
                            </span>
                          </div>
                          <h6 className="mb-14 text-md mt-24">
                            Greate Product
                          </h6>
                          <p className="text-gray-700">
                            There are many variations of passages of Lorem Ipsum
                            available, but the majority have suffered alteration
                            in some form, by injected humour
                          </p>
                          <div className="flex-align gap-20 mt-44">
                            <button className="flex-align gap-12 text-gray-700 hover-text-main-600">
                              <i className="ph-bold ph-thumbs-up" />
                              Like
                            </button>
                            <Link
                              href="#comment-form"
                              className="flex-align gap-12 text-gray-700 hover-text-main-600"
                            >
                              <i className="ph-bold ph-arrow-bend-up-left" />
                              Replay
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-start gap-24">
                        <img
                          src="assets/images/thumbs/comment-img1.png"
                          alt=""
                          className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                        />
                        <div className="flex-grow-1">
                          <div className="flex-between align-items-start gap-8 ">
                            <div className="">
                              <h6 className="mb-12 text-md">Nicolas cage</h6>
                              <div className="flex-align gap-8">
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-800 text-xs">
                              3 Days ago
                            </span>
                          </div>
                          <h6 className="mb-14 text-md mt-24">
                            Greate Product
                          </h6>
                          <p className="text-gray-700">
                            There are many variations of passages of Lorem Ipsum
                            available, but the majority have suffered alteration
                            in some form, by injected humour
                          </p>
                          <div className="flex-align gap-20 mt-44">
                            <button className="flex-align gap-12 text-gray-700 hover-text-main-600">
                              <i className="ph-bold ph-thumbs-up" />
                              Like
                            </button>
                            <Link
                              href="#comment-form"
                              className="flex-align gap-12 text-gray-700 hover-text-main-600"
                            >
                              <i className="ph-bold ph-arrow-bend-up-left" />
                              Replay
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="mt-56">
                        <div className="">
                          <h6 className="mb-24">Write a Review</h6>
                          <span className="text-heading mb-8">
                            What is it like to Product?
                          </span>
                          <div className="flex-align gap-8">
                            <span className="text-15 fw-medium text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-15 fw-medium text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-15 fw-medium text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-15 fw-medium text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                            <span className="text-15 fw-medium text-warning-600 d-flex">
                              <i className="ph-fill ph-star" />
                            </span>
                          </div>
                        </div>
                        <div className="mt-32">
                          <form action="#">
                            <div className="mb-32">
                              <label
                                htmlFor="title"
                                className="text-neutral-600 mb-8"
                              >
                                Review Title
                              </label>
                              <input
                                type="text"
                                className="common-input rounded-8"
                                id="title"
                                placeholder="Great Products"
                              />
                            </div>
                            <div className="mb-32">
                              <label
                                htmlFor="desc"
                                className="text-neutral-600 mb-8"
                              >
                                Review Content
                              </label>
                              <textarea
                                className="common-input rounded-8"
                                id="desc"
                                defaultValue={
                                  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
                                }
                              />
                            </div>
                            <button
                              type="submit"
                              className="btn btn-main rounded-pill mt-48"
                            >
                              Submit Review
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="ms-xxl-5">
                        <h6 className="mb-24">Customers Feedback</h6>
                        <div className="d-flex flex-wrap gap-44">
                          <div className="border border-gray-100 rounded-8 px-40 py-52 flex-center flex-column flex-shrink-0 text-center">
                            <h2 className="mb-6 text-main-600">4.8</h2>
                            <div className="flex-center gap-8">
                              <span className="text-15 fw-medium text-warning-600 d-flex">
                                <i className="ph-fill ph-star" />
                              </span>
                              <span className="text-15 fw-medium text-warning-600 d-flex">
                                <i className="ph-fill ph-star" />
                              </span>
                              <span className="text-15 fw-medium text-warning-600 d-flex">
                                <i className="ph-fill ph-star" />
                              </span>
                              <span className="text-15 fw-medium text-warning-600 d-flex">
                                <i className="ph-fill ph-star" />
                              </span>
                              <span className="text-15 fw-medium text-warning-600 d-flex">
                                <i className="ph-fill ph-star" />
                              </span>
                            </div>
                            <span className="mt-16 text-gray-500">
                              Average Product Rating
                            </span>
                          </div>
                          <div className="border border-gray-100 rounded-8 px-24 py-40 flex-grow-1">
                            <div className="flex-align gap-8 mb-20">
                              <span className="text-gray-900 flex-shrink-0">
                                5
                              </span>
                              <div
                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={70}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "70%" }}
                                />
                              </div>
                              <div className="flex-align gap-4">
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                              </div>
                              <span className="text-gray-900 flex-shrink-0">
                                124
                              </span>
                            </div>
                            <div className="flex-align gap-8 mb-20">
                              <span className="text-gray-900 flex-shrink-0">
                                4
                              </span>
                              <div
                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={50}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "50%" }}
                                />
                              </div>
                              <div className="flex-align gap-4">
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                              </div>
                              <span className="text-gray-900 flex-shrink-0">
                                52
                              </span>
                            </div>
                            <div className="flex-align gap-8 mb-20">
                              <span className="text-gray-900 flex-shrink-0">
                                3
                              </span>
                              <div
                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={35}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "35%" }}
                                />
                              </div>
                              <div className="flex-align gap-4">
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                              </div>
                              <span className="text-gray-900 flex-shrink-0">
                                12
                              </span>
                            </div>
                            <div className="flex-align gap-8 mb-20">
                              <span className="text-gray-900 flex-shrink-0">
                                2
                              </span>
                              <div
                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={20}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "20%" }}
                                />
                              </div>
                              <div className="flex-align gap-4">
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                              </div>
                              <span className="text-gray-900 flex-shrink-0">
                                5
                              </span>
                            </div>
                            <div className="flex-align gap-8 mb-0">
                              <span className="text-gray-900 flex-shrink-0">
                                1
                              </span>
                              <div
                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                role="progressbar"
                                aria-label="Basic example"
                                aria-valuenow={5}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="progress-bar bg-main-600 rounded-pill"
                                  style={{ width: "5%" }}
                                />
                              </div>
                              <div className="flex-align gap-4">
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                              </div>
                              <span className="text-gray-900 flex-shrink-0">
                                2
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsOne;
