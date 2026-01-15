// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    rating: 4.5,
    duration: '5 days',
    featured: false,
    discount: '',
    originalPrice: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/destinations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDestinations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    const formDataImages = new FormData();
    selectedFiles.forEach(file => {
      formDataImages.append('images', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/upload', formDataImages, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      
      // Upload images first
      const imageUrls = await uploadImages();
      const allImages = [...uploadedImages, ...imageUrls];

      const destinationData = {
        ...formData,
        images: allImages
      };

      if (editingId) {
        // Update existing destination
        await axios.put(
          `http://localhost:5000/api/admin/destinations/${editingId}`,
          destinationData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Destination updated successfully!');
      } else {
        // Create new destination
        await axios.post(
          'http://localhost:5000/api/admin/destinations',
          destinationData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Destination added successfully!');
      }

      // Reset form
      resetForm();
      fetchDestinations();
    } catch (error) {
      console.error('Error saving destination:', error);
      alert('Failed to save destination');
    }
  };

  const handleEdit = (destination) => {
    setFormData({
      title: destination.title,
      description: destination.description,
      price: destination.price,
      location: destination.location,
      rating: destination.rating,
      duration: destination.duration,
      featured: destination.featured,
      discount: destination.discount || '',
      originalPrice: destination.originalPrice || ''
    });
    setUploadedImages(destination.images || []);
    setEditingId(destination._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Destination deleted successfully!');
      fetchDestinations();
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Failed to delete destination');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      rating: 4.5,
      duration: '5 days',
      featured: false,
      discount: '',
      originalPrice: ''
    });
    setSelectedFiles([]);
    setUploadedImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Destination'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Destination' : 'Add New Destination'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="$599"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original Price</label>
                <input
                  type="text"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="$799"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount</label>
                <input
                  type="text"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="25%"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="5 days"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Featured Destination</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Images (Max 5)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {uploadedImages.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Existing images: {uploadedImages.length}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? 'Update Destination' : 'Add Destination'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Destinations List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b">All Destinations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {destinations.map((destination) => (
                <tr key={destination._id}>
                  <td className="px-6 py-4">{destination.title}</td>
                  <td className="px-6 py-4">{destination.location}</td>
                  <td className="px-6 py-4">{destination.price}</td>
                  <td className="px-6 py-4">⭐ {destination.rating}</td>
                  <td className="px-6 py-4">
                    {destination.featured ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Yes</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(destination)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(destination._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {destinations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No destinations yet. Click "Add Destination" to create one.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;