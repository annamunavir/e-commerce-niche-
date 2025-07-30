import React, { useContext, useEffect, useState } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { productContext } from '../../context/ProductContext';
import './placeOrder.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AdressForm from '../../components/addressForm/AdressForm';
import axios from 'axios';

const MySwal = withReactContent(Swal);
const RozorpayKey = 'rzp_test_q0P4pGmdiDu9Hh'
const PlaceOrder = () => {
  const { cart, setCart, setSubNav, token, url, user_url, fetchCart } = useContext(productContext);
  const navigate = useNavigate();

  const [addressForm, setAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState('default');
  const [selected, setSelected] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  console.log("defaultAddress", defaultAddress);
  console.log("newAddress", newAddress);
  console.log("selectedAddressIndex", selectedAddressIndex);


  useEffect(() => {
    setSubNav(false);
    fetchAddress();
  }, []);

  const deleteAddress = async (index) => {
    try {
      await axios.delete(`${user_url}/profile/address/${index}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Address deleted');
      fetchAddress(); // Refresh UI
    } catch (error) {
      toast.error('Failed to delete address');
      console.error(error);
    }
  };




  const fetchAddress = async () => {
    try {
      const res = await axios.get(`${user_url}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      setDefaultAddress(res.data.profile.addresses[0]);
      setNewAddress(res.data.profile.addresses[1])
    } catch (err) {
      toast.error('Failed to load address');
    }
  };

  //amount calculation

  const totalMRP = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalOfferPrice = cart.reduce(
    (acc, item) =>
      acc + (item.product.offerPrice || item.product.price) * item.quantity,
    0
  );
  const deliveryFee = totalOfferPrice > 500 ? 0 : 40;
  const discount =
    totalOfferPrice > 2500
      ? Math.round(totalOfferPrice * 0.2)
      : totalOfferPrice > 1000
        ? Math.round(totalOfferPrice * 0.1)
        : 0;
  const totalAmount = totalOfferPrice - discount + deliveryFee;
  const totalSaved = totalMRP - totalOfferPrice + discount;

  //atm card adding

  const handleAddCard = () => {
    MySwal.fire({
      title: 'Add Card Details',
      html: `
      <input type="text" id="cardNumber" class="swal2-input" placeholder="Card Number">
      <input type="text" id="expiry" class="swal2-input" placeholder="MM/YY">
      <input type="password" id="cvv" class="swal2-input" placeholder="CVV">
    `,
      confirmButtonText: 'Save Card',
      showCancelButton: true,
      preConfirm: () => {
        const cardNumber = Swal.getPopup().querySelector('#cardNumber').value;
        const expiry = Swal.getPopup().querySelector('#expiry').value;
        const cvv = Swal.getPopup().querySelector('#cvv').value;

        if (!cardNumber || !expiry || !cvv) {
          Swal.showValidationMessage(`Please fill out all fields`);
          return false;
        }

        return { cardNumber, expiry, cvv };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success('Card added successfully!');
      }
    });
  };




  //address form button handling

  const handleAddAddress = () => {
    setAddressForm(!addressForm);
  };



  // Razorpay integration
  const handlePlaceOrder = async () => {
    if (!selectedAddressIndex) return toast.error('Select delivery address');
    if (!selected) return toast.error('Select payment method');
    if (selected === 'netbanking' && !selectedBank) return toast.error('Select bank');

    const selectedAddress =
      selectedAddressIndex === 'default'
        ? defaultAddress
        : newAddress

    console.log(selectedAddress);

    const shippingAddress = {
      name: selectedAddress?.fullName || selectedAddress?.name,
      phone: selectedAddress?.phone || selectedAddress?.phoneNumber,
      address: `${selectedAddress?.house}, ${selectedAddress.street}, ${selectedAddress?.city}, ${selectedAddress?.state} - ${selectedAddress?.pincode}`,
    };

    if (selected === 'cod') {
      // COD orders
      const orderPayload = {
        orderItems: cart.map((item) => ({ product: item.product._id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        deliveryStatus: 'processing',
        totalPrice: totalMRP,
        discount,
        deliveryFee,
        totalAmount,
      };

      try {
        await axios.post(`${url}/orders/`, orderPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

     
       setCart([]); 
       
       
        toast.success('Order placed (COD)');
        setCart([])
        navigate('/orders');
      } catch (err) {
        toast.error('Failed to place order');
        console.log(err);
      }
    } else {
      // Razorpay
      try {
        const razorRes = await axios.post(`${url}/razorpay/create-order`, { amount: totalAmount });
        const { id: order_id, currency } = razorRes.data;

        const options = {
          key: RozorpayKey,
          amount: totalAmount * 100,
          currency,
          name: 'Kids Ecommerce',
          description: 'Product Order',
          order_id,
          handler: async function (response) {
            const orderPayload = {
              orderItems: cart.map((item) => ({ product: item.product._id, quantity: item.quantity })),
              shippingAddress,
              paymentMethod: 'card',
              paymentStatus: 'paid',
              deliveryStatus: 'processing',
              totalPrice: totalMRP,
              discount,
              deliveryFee,
              totalAmount,
            };

            await axios.post(`${url}/orders`, orderPayload, {
              headers: { Authorization: `Bearer ${token}` },
            });

           setCart([]);  
            toast.success('✅ Payment & Order placed!');
            setCart([])
            navigate('/orders');
          },
          prefill: {
            name: shippingAddress.name,
            contact: shippingAddress.phone,
          },
          theme: { color: '#3399cc' },
        };

        const razor = new window.Razorpay(options);
        razor.open();

      } catch (err) {
        toast.error('Payment initiation failed');
        console.log(err);
      }
    }
  };

  return (
    <div className="place-order-container">
      <h2>Review & Place Your Order</h2>
      <div className="place-order-flex">
        {/* Left: Delivery + Items */}
        <div className="order-left">
          <div style={{ borderBottom: '1px solid grey' }}>
            <h5>Delivery Address</h5>

            {defaultAddress && (
              <div style={{ paddingBottom: '10px' }}>
                <Form.Check
                  type="radio"
                  name="address"
                  id="defaultAddress"
                  label={
                    <div>
                      <strong>{defaultAddress.name || 'Your Name'}</strong>
                      <br />
                      {defaultAddress.house},{' '}
                      {defaultAddress.address?.street}
                      <br />
                      {defaultAddress.city},{' '}
                      {defaultAddress.state},{' '}
                      {defaultAddress.pincode}
                      <br />
                      Phone: {defaultAddress.phoneNumber}
                    </div>
                  }
                  value="default"
                  checked={selectedAddressIndex === 'default'}
                  onChange={() => setSelectedAddressIndex('default')}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}><MdDeleteForever onClick={() => deleteAddress(0)} /></div>
              </div>
            )}

            {/* Dynamically added addresses */}
            {newAddress &&

              <div style={{ marginBottom: '10px', paddingBottom: '10px', borderTop: '1px dashed #aaa', paddingTop: '10px', }}>
                <Form.Check
                  type="radio"
                  name="address"
                  id='address'
                  label={
                    <div>
                      <strong>{newAddress.name}</strong>
                      <br />
                      {newAddress.house},{' '}
                      {newAddress.address?.street}
                      <br />
                      {newAddress.city},{' '}
                      {newAddress.state},{' '}
                      {newAddress.pincode}
                      <br />
                      Phone : {newAddress.phoneNumber}

                    </div>
                  }

                  checked={selectedAddressIndex === "newAddress"}
                  onChange={() => setSelectedAddressIndex("newAddress")}
                />

                <div style={{ display: "flex", justifyContent: "flex-end" }}><MdDeleteForever size={18} onClick={() => deleteAddress(1)} /></div>
              </div>

            }

            <button onClick={handleAddAddress}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'blue',
                border: 'none',
                background: 'transparent',
                padding: '25px 30px',
              }}
            >
              Add a new delivery address
            </button>
          </div>

          <div>
            {addressForm ?
              <AdressForm fetchAddress={fetchAddress} /> : ""}
          </div>

          {/* Payment method */}
          <div>
            <h5>Select Payment Method</h5>
            <Form className="p-3 shadow rounded bg-white">
              <Form.Check
                type="radio"
                id="card"
                label="Credit / Debit Card"
                value="card"
                name="payment"
                onChange={(e) => setSelected(e.target.value)}
                checked={selected === 'card'}
              />

              {selected === 'card' && (
                <div className="mt-2 ms-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddCard}
                  >
                    Add New Card
                  </Button>
                </div>
              )}

              <Form.Check
                type="radio"
                id="netbanking"
                label="Net Banking"
                value="netbanking"
                name="payment"
                onChange={(e) => {
                  setSelected(e.target.value);
                  setSelectedBank('');
                }}
                checked={selected === 'netbanking'}
              />

              {selected === 'netbanking' && (
                <div className="mt-2 ms-3">
                  <Form.Select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="">-- Select Bank --</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                  </Form.Select>
                </div>
              )}

              <Form.Check
                type="radio"
                id="upi"
                label="UPI / Wallet"
                value="upi"
                name="payment"
                onChange={(e) => setSelected(e.target.value)}
                checked={selected === 'upi'}
              />

              {selected === 'upi' && (
                <div className="mt-2 ms-3">
                  <Form.Control type="text" placeholder="Enter your UPI ID" />
                </div>
              )}

              <Form.Check
                type="radio"
                id="cod"
                label="Cash on Delivery (COD)"
                value="cod"
                name="payment"
                onChange={(e) => setSelected(e.target.value)}
                checked={selected === 'cod'}
              />
            </Form>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="order-summary">
          <h5>Price Summary</h5>
          <p>Total MRP: ₹{totalMRP}</p>
          <p>Discount: -₹{discount}</p>
          <p>Delivery Fee: ₹{deliveryFee}</p>
          <hr />
          <h5>Total Amount: ₹{totalAmount}</h5>
          <p style={{ color: 'green' }}>
            You saved ₹{totalSaved} on this order
          </p>
          <button onClick={handlePlaceOrder} className="place-order-btn">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;

