import './offerProduct.css'
import React, { useEffect, useState,useContext } from 'react';
import { Table, Button, Container, Image, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const OfferProduct = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [page,SetPage]=useState(1)
  const [totalPages,setTotalPages]=useState(1)
  const [search,setSearch]=useState("")
  const {user_url} = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${user_url}/api/products?page=${page}&limit=4`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };
  console.log(products);


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${user_url}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  console.log(products);


  const handleEdit = (id) => {
    navigate(`/updateProduct/${id}`)
  }

  useEffect(() => {
    fetchProducts();
  }, [page]);


  
   const handleSearch = async (e) => {
    const value = e.target.value.trim();
    setSearch(value);
    try {
      const endPoint = value === ''
        ? `${user_url}/api/products?page=${page}&limit=5`
        : `${user_url}/api/products/search?query=${value}`;
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


  return (
    <div className='list_product'>
      <div>
        <Container className="mt-4">
          <div>
            <Form inline>
              <div className='row'>
                <div className='col' xs="auto">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className=" mr-sm-2"
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </Form></div>
          <div style={{ textAlign: "center" }}><h2>Offer Products</h2></div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                {/* <th>Size</th>
                      <th>Color</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {products.map((product) => (

                product.offerPrice ?
                  <tr key={product._id}>
                    <td>
                      <Image
                        src={product.image}  // ✅ Use singular
                        alt={product.productName}
                        thumbnail
                        width={80}
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
                    {/* <td>{product.size}</td>
                        <td>{product.color}</td> */}
                    <td>
                      <Button variant="warning" onClick={() => handleEdit(product._id)} size="sm" className="me-2">
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
                  </tr> : ""
              ))}
            </tbody>
          </Table>
          <div style={{ textAlign: "center" }}>
            <button style={{ background: "transparent", color: "black", border: "1px solid grey", padding: "2px 15px", borderRadius: "12px" }} disabled={page === 1} onClick={() => SetPage(page - 1)}>Prev</button>
            <span style={{ margin: "0px 5px" }}>page {page} of {totalPages}</span>
            <button style={{ background: "transparent", color: "black", border: "1px solid grey", padding: "2px 15px", borderRadius: "12px" }} disabled={page === totalPages} onClick={() => SetPage(page + 1)}>Next</button>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default OfferProduct
