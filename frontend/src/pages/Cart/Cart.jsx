import React, { useContext, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { productContext } from '../../context/ProductContext';
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // ✅ Required for notifications
import './cart.css';

const Cart = () => {
  const { cart, token, user_url, fetchCart, setSubNav } = useContext(productContext);
  if (!Array.isArray(cart)) {
    return <div style={{ padding: '50px' }}>Loading cart...</div>;
  }
  // Hide subnav when on cart page
  useEffect(() => {
    setSubNav(false);
    fetchCart(); // ✅ Make sure cart is loaded fresh on page load
  }, []);

  // ✅ Update quantity handler
  const updateCart = async (product, quantity) => {
    if (quantity < 1) return; // prevent quantity going below 1
    try {
      await axios.put(`${user_url}/cart/update/${product._id}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart(); // Refresh cart after update
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${user_url}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart(); // Refresh the cart after deletion
      toast.success("🗑️ Item removed from cart");
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
      toast.error("Failed to remove item");
    }
  };

  // ✅ Price calculations
  const totalMRP = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const totalOfferPrice = cart.reduce(
    (acc, item) =>
      acc + (item.product.offerPrice || item.product.price) * item.quantity,
    0
  );

  const totalPrice = totalOfferPrice;
  const deliveryFee = totalPrice > 500 ? 0 : 40;

  const discount =
    totalPrice > 2500
      ? Math.round(totalPrice * 0.2)
      : totalPrice > 1000
        ? Math.round(totalPrice * 0.1)
        : 0;

  const totalAmount = totalPrice - discount + deliveryFee;
  const totalSaved = totalMRP - totalOfferPrice + discount;

  return (
    <div style={{minHeight:"100vh"}}>
      <h2 className="mt-4 ms-3">Shopping Cart</h2>

      <div className="container-fluid mt-4">
        <div className="row">

          {/* ============== LEFT: Cart Items ============== */}
          <div className="col-12 col-md-8 mb-4">
            {cart.map((item, i) => (
              <div
                key={item.product._id}
                className='row mb-3 p-2 shadow-sm'
                style={{ borderRadius: "8px", background: "#fff" }}
              >
                {/* Product image */}
                <div className='col-12 col-sm-4 d-flex align-items-center justify-content-center mb-2 mb-sm-0'>
                  <img
                    src={item.product.image}
                    alt=""
                    style={{ width: "100px", maxWidth: "100%" }}
                  />
                </div>

                {/* Product info */}
                <div className='col-12 col-sm-4'>
                  <h6>{item.product.productName}</h6>
                  <div style={{
                    border: "1px solid yellow",
                    borderRadius: "16px",
                    width: "100px",
                    textAlign: "center"
                  }}>
                    <button className='quantity_button' onClick={() => updateCart(item.product, item.quantity - 1)}>-</button>
                    {item.quantity}
                    <button className='quantity_button' onClick={() => updateCart(item.product, item.quantity + 1)}>+</button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    style={{
                      margin: "20px 10px",
                      background: "transparent",
                      border: "none",
                      color: "brown",
                      fontSize: "16px",
                      fontWeight: "500"
                    }}
                  >
                    <MdDeleteForever size={20} /> delete
                  </button>
                </div>

                {/* Price info */}
                <div className='col-12 col-sm-4 d-flex align-items-center justify-content-sm-start justify-content-center'>
                  <h6>
                    ₹{(item.product.offerPrice || item.product.price) * item.quantity}
                    <span style={{
                      marginLeft: "12px",
                      color: "red",
                      textDecoration: "line-through"
                    }}>
                      ₹{item.product.price * item.quantity}
                    </span>
                  </h6>
                </div>
              </div>
            ))}
          </div>

          {/* ============== RIGHT: Price Summary ============== */}
          <div className="col-12 col-md-4">
            <div
              style={{
                border: "1px solid grey",
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: "8px",
                padding: "20px",
                height: "100%",
                background: "#fff"
              }}
            >
              <h6 style={{ borderBottom: "1px solid grey", paddingBottom: "10px" }}>PRICE DETAILS</h6>
              <div className="d-flex flex-column gap-2 mt-3">

                <p className="d-flex justify-content-between fw-semibold">
                  Price ({cart.length} item{cart.length > 1 ? "s" : ""}) :
                  <span>₹{totalPrice}</span>
                </p>

                <p className="d-flex justify-content-between fw-semibold">
                  Discount :
                  <span className="text-danger">
                    {discount > 0 && (
                      <>
                        ({totalPrice > 2500 ? '20%' : '10%'} Off) ₹{discount}
                      </>
                    )}
                  </span>
                </p>

                <p className="d-flex justify-content-between fw-semibold">
                  Delivery fee :
                  <span>₹{deliveryFee}</span>
                </p>

                <h5 className="d-flex justify-content-between mt-3 text-success">
                  Total Amount :
                  <span>₹{totalAmount}</span>
                </h5>

                <p className="text-end text-danger mt-2 mb-0">
                  You will save ₹{totalSaved} on this order
                </p>

                <Link to='/placeOrder' className="text-center">
                  <button
                    style={{
                      border: "none",
                      background: "black",
                      color: "white",
                      padding: "10px 30px",
                      borderRadius: "12px",
                      marginTop: "15px"
                    }}
                  >
                    Proceed to Buy
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Cart;
