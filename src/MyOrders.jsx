import { useEffect, useState } from "react";

function MyOrders({ user, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/orders?email=${encodeURIComponent(
        user.email
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="my-orders-page">

      <div className="my-orders-container">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Shop
        </button>

        <h1>My Orders 📦</h1>

        <p className="orders-subtitle">
          View your previous ShopZone orders
        </p>

        {loading ? (

          <p className="orders-message">
            Loading your orders...
          </p>

        ) : orders.length === 0 ? (

          <div className="no-orders">
            <div className="no-orders-icon">
              📦
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              className="continue-shopping-button"
              onClick={onBack}
            >
              Start Shopping 🛍️
            </button>
          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order._id}
              >

                <div className="order-header">

                  <div>
                    <h2>
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h2>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <span className="order-status">
                    {order.status}
                  </span>

                </div>

                <div className="order-items">

                  {order.items.map((item, index) => (

                    <div
                      className="order-item"
                      key={index}
                    >

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <p>
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <strong>
                        ₹{(
                          item.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>

                  ))}

                </div>

                <div className="order-footer">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹{order.total.toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyOrders;