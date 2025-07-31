import './categories.css'
import React, { useEffect, useState,useContext } from 'react';
import { Table, Button, Image, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Categories = ({ setNav }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
    const { user_url } = useContext(AuthContext);


  useEffect(() => {
    setNav(false);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${user_url}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${user_url}/api/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/updateCategory/${id}`);
  };

  return (
    <div className='listCategory'>
    <Container className="list-categories mt-4">
      <h2 className="text-center mb-4">Category List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>
                <Image src={cat.image} alt={cat.category} thumbnail width={80} />
              </td>
              <td>{cat.category}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(cat._id)} className="me-2" size="sm">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(cat._id)} size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </div>
  );
};

export default Categories;
