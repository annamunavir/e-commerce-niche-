import './listProduct.css';
import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Image, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListProducts = ({ setNav }) => {
  useEffect(() => {
    setNav(false);
  }, [setNav]);

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, SetPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/products?page=${page}&limit=5`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleDelete = async (id) => {
    
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  ;

  const handleEdit = (id) => {
    navigate(`/updateProduct/${id}`);
  };

  const handleSearch = async (e) => {
    const value = e.target.value.trim();
    setSearch(value);
    try {
      const endPoint = value === ''
        ? `http://localhost:3000/api/products?page=${page}&limit=5`
        : `http://localhost:3000/api/products/search?query=${value}`;
      const response = await axios.get(endPoint);
      setProducts(response.data.products ? response.data.products : response.data);

      if (response?.data?.totalPages) {
        setTotalPages(response.data.totalPages);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <div className="list_product">
      <Container className="mt-4">
        <Form className="mb-3">
          <div className="row">
            <div className="col" xs="auto">
              <Form.Control
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                onChange={handleSearch}
              />
            </div>
          </div>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <h2>Product List</h2>
        </div>

        <Table striped bordered hover responsive className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <Image
                    src={product.image}
                    alt={product.productName}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = 'true';
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }
                    }}
                  />
                </td>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>
                  {product.offerPercentage ? (
                    <>
                      ₹{product.offerPrice.toFixed(2)}
                      <span className="text-muted ms-2">
                        <del>₹{product.price}</del>
                      </span>
                    </>
                  ) : (
                    <>₹{product.price}</>
                  )}
                </td>
                <td>{product.stock}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(product._id)}
                    size="sm"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div style={{ textAlign: 'center' }}>
          <button
            style={{
              background: 'transparent',
              color: 'black',
              border: '1px solid grey',
              padding: '2px 15px',
              borderRadius: '12px',
            }}
            disabled={page === 1}
            onClick={() => SetPage(page - 1)}
          >
            Prev
          </button>
          <span style={{ margin: '0px 5px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            style={{
              background: 'transparent',
              color: 'black',
              border: '1px solid grey',
              padding: '2px 15px',
              borderRadius: '12px',
            }}
            disabled={page === totalPages}
            onClick={() => SetPage(page + 1)}
          >
            Next
          </button>
        </div>
      </Container>
    </div>
  );
};

export default ListProducts;
