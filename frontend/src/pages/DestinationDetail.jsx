// frontend/src/pages/DestinationDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/destinations/${id}`);
      setDestination(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching destination:', error);
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (destination.images && destination.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % destination.images.length);
    }
  };

  const prevImage = () => {
    if (destination.images && destination.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + destination.images.length) % destination.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-blue-600">Loading...</div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-2xl text-red-600 mb-4">Destination not found</div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const hasImages = destination.images && destination.images.length > 0;
  const currentImage = hasImages 
    ? `http://localhost:5000${destination.images[currentImageIndex]}`
    : 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-semibold"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image Carousel */}
        <div className="relative h-96 bg-gray-200">
          <img
            src={currentImage}
            alt={destination.title}
            className="w-full h-full object-cover"
          />
          
          {/* Discount Badge */}
          {destination.discount && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              {destination.discount} OFF
            </div>
          )}

          {/* Carousel Controls */}
          {hasImages && destination.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
              >
                →
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {destination.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{destination.title}</h1>
              <p className="text-gray-600 text-lg flex items-center">
                <span className="mr-2">📍</span>
                {destination.location}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 text-2xl mr-2">⭐</span>
                <span className="text-3xl font-bold">{destination.rating}</span>
              </div>
              <p className="text-gray-500">Rating</p>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-gray-600 mb-2">Starting from</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-blue-600">{destination.price}</span>
                  {destination.originalPrice && (
                    <span className="text-2xl text-gray-400 line-through ml-3">{destination.originalPrice}</span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">Per person • {destination.duration}</p>
              </div>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
                Book Now
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">About This Destination</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{destination.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-semibold">Duration</div>
              <div className="text-gray-600">{destination.duration}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold">Rating</div>
              <div className="text-gray-600">{destination.rating} / 5.0</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Best Price</div>
              <div className="text-gray-600">{destination.price}</div>
            </div>
          </div>

          {/* Highlights */}
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Expert Guides</div>
                  <div className="text-gray-600 text-sm">Professional local guides</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Best Hotels</div>
                  <div className="text-gray-600 text-sm">4-5 star accommodations</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">All Meals Included</div>
                  <div className="text-gray-600 text-sm">Breakfast, lunch, and dinner</div>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">24/7 Support</div>
                  <div className="text-gray-600 text-sm">Customer service available</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Ready for an adventure?</h3>
            <p className="mb-4">Book this amazing destination today and create unforgettable memories!</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Contact Us Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetail;