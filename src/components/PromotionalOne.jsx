
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const PromotionalOne = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/latest?limit=4`,
          { next: { revalidate: 1800 } }
        );
        const json = await res.json();
        if (json.success && json.data) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("PromotionalOne fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  // Loading Skeleton (exact same size as original)
  if (loading) {
    return (
      <section className="promotional-banner pt-80">
        <div className="container container-lg">
          <div className="row gy-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-xl-3 col-sm-6 col-xs-6">
                <div className="promotional-banner-item position-relative rounded-24 overflow-hidden z-1 h-360">
                  <div className="bg-gray-200 w-100 h-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="promotional-banner pt-80">
      <div className="container container-lg">
        <div className="row gy-4">
          {products.map((product) => (
            <div key={product.id} className="col-xl-3 col-sm-6 col-xs-6">
              <div className="promotional-banner-item position-relative rounded-24 overflow-hidden z-1">
              

                <Image
                  src={
                    product.thumbnail ||
                    "/assets/images/thumbs/promotional-banner-img1.png"
                  }
                  alt={product.name}
                  fill
                  className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority
                />

                <div className="promotional-banner-item__content">
                  <h6 className="promotional-banner-item__title text-32">
                    {product.name}
                  </h6>
                  <Link
                    href={`/product/${product.slug}`}
                    className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8 mt-24"
                  >
                    Shop Now
                    <span className="icon text-xl d-flex">
                      <i className="ph ph-arrow-right" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalOne;
