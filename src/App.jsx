import { useEffect, useState } from "react";
import "./App.css";

import Auth from "./Auth";
import Checkout from "./Checkout";
import MyOrders from "./MyOrders";

function App() {
  /* =====================================================
     STATE
     ===================================================== */

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);

  const [promoIndex, setPromoIndex] = useState(0);

  /* =====================================================
     PROMOTIONAL SLIDES
     ===================================================== */

  const promoSlides = [
    {
      tag: "🔥 LIMITED TIME OFFER",
      title: "Big Electronics Sale",
      text:
        "Discover amazing deals on mobiles, laptops, audio and wearables.",
      button: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=85",
    },
    {
      tag: "📱 SMARTPHONE DEALS",
      title: "Upgrade Your Mobile",
      text:
        "Find the latest smartphones at exciting prices.",
      button: "Explore Mobiles",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=85",
    },
    {
      tag: "💻 LAPTOP SALE",
      title: "Power Your Productivity",
      text:
        "Explore laptops built for study, work and entertainment.",
      button: "View Laptops",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&q=85",
    },
    {
      tag: "🎧 AUDIO COLLECTION",
      title: "Feel Every Beat",
      text:
        "Discover headphones and audio products for every moment.",
      button: "Shop Audio",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=85",
    },
  ];

  /* =====================================================
     LOAD USER
     ===================================================== */

  useEffect(() => {
    const savedUser = localStorage.getItem("shopzoneUser");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("shopzoneUser");
      }
    }
  }, []);

  /* =====================================================
     LOAD PRODUCTS
     ===================================================== */

  useEffect(() => {
    fetch("https://shopzone-52ep.onrender.com/api/products")
      .then((response) => response.json())
      .then((data) => {
        const formattedProducts = data.map((product) => ({
          ...product,
          id: product._id,
        }));

        setProducts(formattedProducts);
      })
      .catch((error) => {
        console.error("Product fetch error:", error);
      });
  }, []);

  /* =====================================================
     PROMO AUTO SLIDER
     ===================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex(
        (previous) =>
          (previous + 1) % promoSlides.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [promoSlides.length]);

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const goHome = () => {
    setShowCheckout(false);
    setShowMyOrders(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openProducts = () => {
    setShowCheckout(false);
    setShowMyOrders(false);

    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 50);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);

    setShowCheckout(false);
    setShowMyOrders(false);

    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 50);
  };

  const openCart = () => {
    setShowCheckout(false);
    setShowMyOrders(false);

    setTimeout(() => {
      document
        .getElementById("cart-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 50);
  };

  const openLogin = () => {
    setShowCheckout(false);
    setShowMyOrders(false);

    setTimeout(() => {
      document
        .getElementById("auth-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 50);
  };

  const openMyOrders = () => {
    setShowCheckout(false);
    setShowMyOrders(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("shopzoneUser");

    setUser(null);
    setShowCheckout(false);
    setShowMyOrders(false);

    goHome();
  };

  /* =====================================================
     CART
     ===================================================== */

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  };

  /* =====================================================
     CART TOTALS
     ===================================================== */

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  /* =====================================================
     FILTER PRODUCTS
     ===================================================== */

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      product.name?.toLowerCase().includes(searchText) ||
      product.description
        ?.toLowerCase()
        .includes(searchText) ||
      product.category
        ?.toLowerCase()
        .includes(searchText);

    return matchesCategory && matchesSearch;
  });

  /* =====================================================
     PRODUCT IMAGE FALLBACK
     ===================================================== */

  const getProductImage = (product) => {
    if (product.image) {
      return product.image;
    }

    const category = product.category?.toLowerCase();

    if (category === "mobiles") {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80";
    }

    if (category === "laptops") {
      return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80";
    }

    if (category === "audio") {
      return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80";
    }

    if (category === "wearables") {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80";
    }

    return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80";
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="app">

      {/* =================================================
          NAVBAR
          ================================================= */}

      <nav className="navbar">

        <button
          className="brand"
          type="button"
          onClick={goHome}
        >
          <span className="brand-icon">
            🛒
          </span>

          <span className="brand-name">
            ShopZone
          </span>
        </button>

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                openProducts();
              }
            }}
          />

          <button
            type="button"
            onClick={openProducts}
          >
            Search
          </button>

        </div>

        <div className="nav-links">

          <button
            type="button"
            onClick={goHome}
          >
            Home
          </button>

          <button
            type="button"
            onClick={openProducts}
          >
            Products
          </button>

          {user ? (
            <>
              <span className="welcome-user">
                Welcome, {user.name}
              </span>

              <button
                type="button"
                onClick={openMyOrders}
              >
                📦 My Orders
              </button>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className="login-button"
              onClick={openLogin}
            >
              Login
            </button>
          )}

          <button
            type="button"
            className="nav-cart"
            onClick={openCart}
          >
            <span>🛒</span>

            <span>Cart</span>

            <span className="cart-count">
              {cartCount}
            </span>
          </button>

        </div>

      </nav>

      {/* =================================================
          CHECKOUT / ORDERS / SHOP
          ================================================= */}

      {showCheckout ? (
        <Checkout
          cart={cart}
          total={totalPrice}
          onBack={() => setShowCheckout(false)}
        />
      ) : showMyOrders ? (
        <MyOrders
          user={user}
          onBack={() => setShowMyOrders(false)}
        />
      ) : (
        <>

          {/* =============================================
              PROMOTIONAL BANNER
              ============================================= */}

          <section className="promo-slider">

            {promoSlides.map((slide, index) => (
              <div
                key={index}
                className={`promo-slide ${
                  index === promoIndex
                    ? "active"
                    : ""
                }`}
                style={{
                  backgroundImage: `url("${slide.image}")`,
                }}
              >

                <div className="promo-overlay"></div>

                <div className="promo-content">

                  <span className="promo-tag">
                    {slide.tag}
                  </span>

                  <h2>
                    {slide.title}
                  </h2>

                  <p>
                    {slide.text}
                  </p>

                  <button
                    className="promo-button"
                    type="button"
                    onClick={openProducts}
                  >
                    {slide.button} →
                  </button>

                </div>

              </div>
            ))}

            <button
              type="button"
              className="promo-arrow left"
              onClick={() =>
                setPromoIndex(
                  (promoIndex -
                    1 +
                    promoSlides.length) %
                    promoSlides.length
                )
              }
            >
              ‹
            </button>

            <button
              type="button"
              className="promo-arrow right"
              onClick={() =>
                setPromoIndex(
                  (promoIndex + 1) %
                    promoSlides.length
                )
              }
            >
              ›
            </button>

            <div className="promo-dots">

              {promoSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`promo-dot ${
                    index === promoIndex
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPromoIndex(index)
                  }
                />
              ))}

            </div>

          </section>

          {/* =============================================
              VIDEO HERO
              ============================================= */}

          <section className="hero">

            <video
              className="hero-background-video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source
                src="/shopzone-video.mp4"
                type="video/mp4"
              />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">

              <span className="hero-badge">
                🛍️ Welcome to ShopZone
              </span>

              <h1>
                Welcome to ShopZone
              </h1>

              <p>
                Discover amazing products
                at great prices.
              </p>

              <button
                className="shop-btn"
                type="button"
                onClick={openProducts}
              >
                Shop Now →
              </button>

            </div>

          </section>

          {/* =============================================
              CATEGORIES
              ============================================= */}

          <section className="section category-section">

            <h2>
              Shop by Category
            </h2>

            <p className="category-subtitle">
              Choose a category to explore products
            </p>

            <div className="category-buttons">

              <button
                type="button"
                className={`category-button ${
                  selectedCategory === "All"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectCategory("All")
                }
              >
                <span>🛍️</span>
                <strong>All Products</strong>
              </button>

              <button
                type="button"
                className={`category-button ${
                  selectedCategory === "Mobiles"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectCategory("Mobiles")
                }
              >
                <span>📱</span>
                <strong>Mobiles</strong>
              </button>

              <button
                type="button"
                className={`category-button ${
                  selectedCategory === "Laptops"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectCategory("Laptops")
                }
              >
                <span>💻</span>
                <strong>Laptops</strong>
              </button>

              <button
                type="button"
                className={`category-button ${
                  selectedCategory === "Audio"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectCategory("Audio")
                }
              >
                <span>🎧</span>
                <strong>Audio</strong>
              </button>

              <button
                type="button"
                className={`category-button ${
                  selectedCategory === "Wearables"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectCategory("Wearables")
                }
              >
                <span>⌚</span>
                <strong>Wearables</strong>
              </button>

            </div>

          </section>

          {/* =============================================
              PRODUCTS
              ============================================= */}

          <section
            id="products-section"
            className="section products-section"
          >

            <h2>
              Featured Products
            </h2>

            <p className="section-subtitle">
              Explore our latest products
            </p>

            {filteredProducts.length === 0 ? (

              <div className="no-products">

                <div>🔍</div>

                <h3>
                  No products found
                </h3>

                <p>
                  Try another category or search term.
                </p>

              </div>

            ) : (

              <div className="products">

                {filteredProducts.map(
                  (product) => (

                    <div
                      className="product-card"
                      key={product.id}
                    >

                      <div className="product-image">

                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80";
                          }}
                        />

                      </div>

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.description ||
                          "Quality product from ShopZone."}
                      </p>

                      <div className="product-rating">
                        ⭐⭐⭐⭐⭐
                        <span>
                          4.8
                        </span>
                      </div>

                      <span className="product-category">
                        {product.category ||
                          "Product"}
                      </span>

                      <div className="product-price">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      <button
                        type="button"
                        className="add-cart-button"
                        onClick={() =>
                          addToCart(product)
                        }
                      >
                        Add to Cart
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

          {/* =============================================
              CART
              ============================================= */}

          <section
            id="cart-section"
            className="section cart-section"
          >

            <h2>
              Your Cart 🛒
            </h2>

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛒
                </div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add some products to your cart
                  and they will appear here.
                </p>

                <button
                  type="button"
                  className="start-shopping-button"
                  onClick={openProducts}
                >
                  Start Shopping 🛍️
                </button>

              </div>

            ) : (

              <div className="cart-container">

                <div className="cart-items">

                  {cart.map((item) => (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      <div className="cart-item-image">

                        <img
                          src={getProductImage(item)}
                          alt={item.name}
                        />

                      </div>

                      <div className="cart-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                      <div className="quantity-controls">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.id
                            )
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.id
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                      <div className="cart-item-price">
                        ₹
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                  ))}

                </div>

                <div className="cart-summary">

                  <h3>
                    Cart Summary
                  </h3>

                  <div className="cart-summary-row">
                    <span>
                      Items
                    </span>

                    <span>
                      {cartCount}
                    </span>
                  </div>

                  <div className="cart-summary-row">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {totalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="cart-summary-row">
                    <span>
                      Delivery
                    </span>

                    <span>
                      Free
                    </span>
                  </div>

                  <div className="cart-total">
                    <span>
                      Total
                    </span>

                    <span>
                      ₹
                      {totalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="checkout-button"
                    onClick={() =>
                      setShowCheckout(true)
                    }
                  >
                    Proceed to Checkout →
                  </button>

                </div>

              </div>

            )}

          </section>

          {/* =============================================
              AUTH
              ============================================= */}

          {!user && (
            <section
              id="auth-section"
              className="auth-section"
            >

              <Auth />

            </section>
          )}

          {/* =============================================
              FOOTER
              ============================================= */}

          <footer className="footer">

            <div className="footer-container">

              <div>
                <h3>
                  🛒 ShopZone
                </h3>

                <p>
                  Your online destination for
                  mobiles, laptops, audio,
                  wearables and more.
                </p>
              </div>

              <div>

                <h3>
                  Quick Links
                </h3>

                <div className="footer-links">

                  <button
                    type="button"
                    onClick={goHome}
                  >
                    Home
                  </button>

                  <button
                    type="button"
                    onClick={openProducts}
                  >
                    Products
                  </button>

                  <button
                    type="button"
                    onClick={openCart}
                  >
                    Cart
                  </button>

                </div>

              </div>

              <div>

                <h3>
                  Categories
                </h3>

                <div className="footer-links">

                  <button
                    type="button"
                    onClick={() =>
                      selectCategory("Mobiles")
                    }
                  >
                    Mobiles
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      selectCategory("Laptops")
                    }
                  >
                    Laptops
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      selectCategory("Audio")
                    }
                  >
                    Audio
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      selectCategory("Wearables")
                    }
                  >
                    Wearables
                  </button>

                </div>

              </div>

            </div>

            <div className="footer-bottom">
              © 2026 ShopZone. All rights reserved.
            </div>

          </footer>

        </>
      )}

    </div>
  );
}

export default App;