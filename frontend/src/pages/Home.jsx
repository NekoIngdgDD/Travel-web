// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/destinations');
      setDestinations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/destination/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-blue-600">Loading destinations...</div>
      </div>
    );
  }

  const featuredDestinations = destinations.filter(d => d.featured);
  const regularDestinations = destinations.filter(d => !d.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-12 text-white mb-12">
        <h1 className="text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
        <p className="text-xl mb-6">Explore amazing destinations around the world</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Start Exploring
        </button>
      </div>

      {/* Featured Destinations */}
      {featuredDestinations.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination) => (
              <div 
                key={destination._id} 
                onClick={() => handleCardClick(destination._id)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.images[0] ? `http://localhost:5000${destination.images[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={destination.title}
                    className="w-full h-full object-cover"
                  />
                  {destination.discount && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                      {destination.discount} OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{destination.title}</h3>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <span className="mr-1">📍</span>
                    {destination.location}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{destination.price}</span>
                      {destination.originalPrice && (
                        <span className="text-gray-400 line-through ml-2">{destination.originalPrice}</span>
                      )}
                      <span className="text-gray-500 ml-2">/ {destination.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Destinations */}
      {regularDestinations.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">All Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularDestinations.map((destination) => (
              <div 
                key={destination._id} 
                onClick={() => handleCardClick(destination._id)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.images[0] ? `http://localhost:5000${destination.images[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={destination.title}
                    className="w-full h-full object-cover"
                  />
                  {destination.discount && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                      {destination.discount} OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{destination.title}</h3>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <span className="mr-1">📍</span>
                    {destination.location}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{destination.price}</span>
                      {destination.originalPrice && (
                        <span className="text-gray-400 line-through ml-2">{destination.originalPrice}</span>
                      )}
                      <span className="text-gray-500 ml-2">/ {destination.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {destinations.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">No destinations available yet.</p>
          <p className="text-gray-400 mt-2">Admin can add destinations from the dashboard.</p>
        </div>
      )}
    </div>
  );
}

export default Home;