import React, { useEffect, useState, useContext } from 'react';
import { Table, Spinner, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './orders.css';
import { AuthContext } from '../../context/AuthContext';

const Orders = ({ setNav }) => {
  const { token,user_url } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔢 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 🔁 Fetch orders
  useEffect(() => {
    setNav(false);
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${user_url}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token, setNav]);

  // 🧾 Handle status update
  const handleStatusChange = async (orderId, field, value) => {
    try {
      const res = await axios.put(
        `${user_url}/api/orders/${orderId}/status`,
        { [field]: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res);
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, [field]: value } : order
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Status update failed.');
    }
  };

  // 🔢 Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className='orders container py-4'>
      <h4 className='mb-4'>All Orders</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table responsive bordered hover>
            <thead className='table-dark'>
              <tr>
                <th>UserName</th>
                <th>Email</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Qty</th>
                <th>Payment</th>
                <th>Delivery</th>
                <th>Ordered At</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) =>
                order.orderItems.map((item, idx) => (
                  <tr key={`${order._id}-${idx}`}>
                    <td>{order.user?.userName || 'N/A'}</td>
                    <td>{order.user?.email}</td>
                    <td>{item.product?._id || 'Deleted'}</td>
                    <td>{item.product?.productName || 'Deleted Product'}</td>
                    <td>{item.quantity}</td>

                    <td>
                      <Form.Select
                        size="sm"
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, 'paymentStatus', e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </Form.Select>
                    </td>

                    <td>
                      <Form.Select
                        size="sm"
                        value={order.deliveryStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, 'deliveryStatus', e.target.value)
                        }
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </Form.Select>
                    </td>

                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* 🔘 Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 flex-wrap mt-3">
              <Button
                variant="outline-dark"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                &laquo; Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <Button
                  key={num}
                  variant={currentPage === num ? 'dark' : 'outline-dark'}
                  size="sm"
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </Button>
              ))}

              <Button
                variant="outline-dark"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next &raquo;
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
