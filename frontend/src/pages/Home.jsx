// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [data, setData] = useState({ featured: [], deals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/home');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-blue-600">Loading...</div>
      </div>
    );
  }

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
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.featured.map((destination) => (
            <div 
              key={destination.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img 
                src={destination.image} 
                alt={destination.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{destination.title}</h3>
                <p className="text-gray-600 mb-4">{destination.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">{destination.price}</span>
                    <span className="text-gray-500 ml-2">/ {destination.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-semibold">{destination.rating}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Deals */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Special Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.deals.map((deal) => (
            <div 
              key={deal.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  {deal.discount} OFF
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-2xl font-semibold mb-2">{deal.title}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">{deal.price}</span>
                    <span className="text-gray-400 line-through ml-2">{deal.originalPrice}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-semibold">{deal.rating}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;