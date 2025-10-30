import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../../component/Button.jsx";
import { Helmet } from "react-helmet-async";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://sierra-catalogue.onrender.com/api/listings/${id}`,
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add to cart.");
        return;
      }

      const res = await axios.post(
        "https://sierra-catalogue.onrender.com/api/cart/add",
        { listingId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <div className="text-center py-20 text-white">Loading...</div>;
  if (!product)
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/shop" className="text-primary-gold underline">
          Back to Shop
        </Link>
      </div>
    );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image:
      product.images.length > 0
        ? product.images
        : ["https://www.sierracatalogue.com/assets/placeholder.jpg"],
    description: product.description,
    sku: product._id,
    offers: {
      "@type": "Offer",
      url: `https://www.sierracatalogue.com/shop/product/${product._id}`,
      priceCurrency: "SLL",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <Helmet>
        <title>{product.title} | Sierra Catalogue</title>
        <meta name="description" content={product.description} />
        <link
          rel="canonical"
          href={`https://www.sierracatalogue.com/shop/product/${product._id}`}
        />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta
          property="og:url"
          content={`https://www.sierracatalogue.com/shop/product/${product._id}`}
        />
        <meta property="og:type" content="product" />
        <meta
          property="og:image"
          content={
            product.images[0] ||
            "https://www.sierracatalogue.com/assets/placeholder.jpg"
          }
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images[0] || "/assets/placeholder.jpg"}
            alt={product.title}
            className="w-full h-80 object-cover rounded-xl"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-300 mb-4">{product.description}</p>
          <p className="text-primary-gold font-bold text-2xl mb-6">
            Nle {product.price}
          </p>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={`flex items-center gap-2 ${product.stock === 0 || adding ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-primary-gold text-black"}`}
          >
            <FaShoppingCart />{" "}
            {product.stock === 0
              ? "Unavailable"
              : adding
                ? "Adding..."
                : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
