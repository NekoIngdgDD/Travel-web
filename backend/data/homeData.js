// backend/data/homeData.js
// Sample travel destination data

const homeData = {
  featured: [
    {
      id: 1,
      title: "Bali, Indonesia",
      description: "Tropical paradise with stunning beaches and rich culture",
      price: "$599",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      rating: 4.8,
      duration: "7 days"
    },
    {
      id: 2,
      title: "Paris, France",
      description: "The city of love with iconic landmarks and cuisine",
      price: "$899",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      rating: 4.9,
      duration: "5 days"
    },
    {
      id: 3,
      title: "Tokyo, Japan",
      description: "Modern metropolis blending tradition and technology",
      price: "$1,099",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      rating: 4.7,
      duration: "6 days"
    },
    {
      id: 4,
      title: "Santorini, Greece",
      description: "Beautiful island with white-washed buildings and sunsets",
      price: "$799",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      rating: 4.9,
      duration: "5 days"
    },
    {
      id: 5,
      title: "Dubai, UAE",
      description: "Luxury destination with modern architecture and desert",
      price: "$999",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
      rating: 4.6,
      duration: "4 days"
    },
    {
      id: 6,
      title: "Maldives",
      description: "Overwater bungalows and crystal clear waters",
      price: "$1,499",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
      rating: 5.0,
      duration: "7 days"
    }
  ],
  deals: [
    {
      id: 7,
      title: "Barcelona, Spain",
      description: "Art, architecture, and Mediterranean vibes",
      price: "$649",
      originalPrice: "$899",
      discount: "28%",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
      rating: 4.7
    },
    {
      id: 8,
      title: "New York, USA",
      description: "The city that never sleeps",
      price: "$549",
      originalPrice: "$749",
      discount: "27%",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
      rating: 4.8
    }
  ]
};

module.exports = homeData;