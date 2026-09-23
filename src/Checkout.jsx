import { useState } from "react";

function Checkout({ cart, total, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const orderData = {
      customerName: name,
      email: email,
      phone: phone,
      address: address,

      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),

      total: total,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to place order");
        return;
      }

      // Save returned order
      setOrder(data.order);

    } catch (error) {
      console.error("Order error:", error);

      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Order success page
  if (order) {
    return (
      <div className="checkout-page">

        <div className="order-success">

          <div className="success-icon">
            ✅
          </div>

          <h1>
            Order Placed Successfully!
          </h1>

          <p>
            Thank you for shopping with ShopZone 🎉
          </p>

          <div className="order-details">

            <h2>
              Order Details
            </h2>

            <p>
              <strong>Order ID:</strong>{" "}
              {order._id}
            </p>

            <p>
              <strong>Name:</strong>{" "}
              {order.customerName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.email}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {order.address}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            <hr />

            <h3>
              Ordered Products
            </h3>

            {order.items.map((item, index) => (
              <div
                className="success-item"
                key={index}
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹
                  {(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            <hr />

            <h2>
              Total: ₹
              {order.total.toLocaleString("en-IN")}
            </h2>

          </div>

          <button
            className="continue-shopping-button"
            onClick={onBack}
          >
            Continue Shopping 🛍️
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Cart
        </button>

        <h1>Checkout</h1>

        <div className="checkout-content">

          <div className="checkout-form">

            <h2>Delivery Details</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                required
              />

              <textarea
                placeholder="Delivery Address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="place-order-button"
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>

          </div>

          <div className="order-summary">

            <h2>Order Summary</h2>

            {cart.map((item) => (
              <div
                className="checkout-item"
                key={item.id}
              >

                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹
                  {(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </span>

              </div>
            ))}

            <hr />

            <h2>
              Total: ₹
              {total.toLocaleString("en-IN")}
            </h2>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;