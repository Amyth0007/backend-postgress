// insert-messlocations.js
import pool from '../config/db.config.js';

const messLocations = [
  {
    id: 1,
    name: "Annapurna Mess",
    description: "Authentic home-style meals with pure ghee",
    distance: 0.8,
    rating: 4.5,
    city: "pune",
    coordinates: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: 2,
    name: "Green Leaf Mess",
    description: "Healthy and nutritious vegetarian food",
    distance: 1.2,
    rating: 4.3,
    city: "pune",
    coordinates: { lat: 18.5314, lng: 73.8446 }
  },
  {
    id: 3,
    name: "Maharaja Mess",
    description: "Premium thalis with variety of items",
    distance: 1.5,
    rating: 4.7,
    city: "pune",
    coordinates: { lat: 18.5123, lng: 73.8289 }
  },
    {
      id: 4,
      name: "Mumbai Tiffin",
      description: "Delicious Maharashtrian food",
      distance: 2.0,
      rating: 4.2,
      city: "Mumbai",
      coordinates: { lat: 19.076, lng: 72.8777 }
    },
    {
      id: 5,
      name: "Delhi Thali House",
      description: "Authentic North Indian thalis",
      distance: 2.3,
      rating: 4.4,
      city: "Delhi",
      coordinates: { lat: 28.6139, lng: 77.209 }
    },
    {
      id: 6,
      name: "Bangalore Meals",
      description: "South Indian meals with filter coffee",
      distance: 1.8,
      rating: 4.6,
      city: "Bangalore",
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: 7,
      name: "Hyderabad Ruchi",
      description: "Spicy and flavorful Hyderabadi thalis",
      distance: 2.5,
      rating: 4.3,
      city: "Hyderabad",
      coordinates: { lat: 17.385, lng: 78.4867 }
    },
    {
      id: 8,
      name: "Chennai Veg Delight",
      description: "Pure veg South Indian meals",
      distance: 2.7,
      rating: 4.1,
      city: "Chennai",
      coordinates: { lat: 13.0827, lng: 80.2707 }
    }
  
];

const insertMessLocations = async () => {
  try {
    const insertQuery = `
      INSERT INTO messlocation 
      (name, city, description, ratings, distance, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (const location of messLocations) {
      const values = [
        location.name,
        location.city,
        location.description,
        location.rating,
        location.distance,
        location.coordinates.lat,
        location.coordinates.lng
      ];
      await pool.query(insertQuery, values);
    }

    console.log("✅ All mess locations inserted successfully.");
  } catch (error) {
    console.error("❌ Error inserting mess locations:", error);
  } finally {
    await pool.end(); // close DB connection
  }
};

insertMessLocations();
