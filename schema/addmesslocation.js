// insert-messlocations.js
import pool from '../config/db.config.js';

const messLocations = [
  {
    id: 1,
    name: "Annapurna Mess",
    description: "Authentic home-style meals with pure ghee",
    ratings: 3,
    user_id: 1,
    city: "Pune",
    address: 'address',
    type: 'both',
    image: 'https://res.cloudinary.com/dd8oitnyu/image/upload/v1754217081/jyfrsridj4siggjax8ox.png',
    coordinates: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: 2,
    name: "Green Leaf Mess",
    description: "Healthy and nutritious vegetarian food",
    ratings: 3,
    city: "Pune",
    user_id: 1,
    address: 'address',
    type: 'both',
    image: 'https://res.cloudinary.com/dd8oitnyu/image/upload/v1754217081/jyfrsridj4siggjax8ox.png',
    coordinates: { lat: 18.5314, lng: 73.8446 }
  },
  {
    id: 3,
    name: "Maharaja Mess",
    description: "Premium thalis with variety of items",
    ratings: 3,
    city: "Pune",
    address: 'address',
    user_id: 1,
    type: 'both',
    image: 'https://res.cloudinary.com/dd8oitnyu/image/upload/v1754217081/jyfrsridj4siggjax8ox.png',
    coordinates: { lat: 18.5123, lng: 73.8289 }
  },
    {
      id: 4,
      name: "Mumbai Tiffin",
      description: "Delicious Maharashtrian food",
      ratings: 3,
      city: "Mumbai",
      address: 'address',
      user_id: 1,
      type: 'both',
      image: 'https://res.cloudinary.com/dd8oitnyu/image/upload/v1754217081/jyfrsridj4siggjax8ox.png',
      coordinates: { lat: 19.076, lng: 72.8777 }
    },
    {
      id: 5,
      name: "Delhi Thali House",
      description: "Authentic North Indian thalis",
      ratings: 3,
      city: "Delhi",
      user_id: 1,
      address: 'address',
      type: 'both',
      image: 'https://res.cloudinary.com/dd8oitnyu/image/upload/v1754217081/jyfrsridj4siggjax8ox.png',
      coordinates: { lat: 28.6139, lng: 77.209 }
    },
    {
      id: 6,
      name: "Bangalore Meals",
      description: "South Indian meals with filter coffee",
      ratings: 3,
      city: "Bangalore",
      user_id: 1,
      address: 'address',
      type: 'both',
      image: 'https://res.cloudinary.com/dd8oitnyu/image/upload/v1754217081/jyfrsridj4siggjax8ox.png',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: 7,
      name: "Hyderabad Ruchi",
      description: "Spicy and flavorful Hyderabadi thalis",
      ratings: 3,
      city: "Hyderabad",
      address: 'address',
      user_id: 1,
      type: 'both',
      image: 'https://res.cloudinary.com/dd8oitnyu/image/upload/v1754217081/jyfrsridj4siggjax8ox.png',
      coordinates: { lat: 17.385, lng: 78.4867 }
    },
    {
      id: 8,
      name: "Chennai Veg Delight",
      description: "Pure veg South Indian meals",
      ratings: 3,
      city: "Chennai",
      address: 'address',
      user_id: 1,
      type: 'both',
      image: 'https://res.cloudinary.com/dd8oitnyu/image/upload/v1754217081/jyfrsridj4siggjax8ox.png',
      coordinates: { lat: 13.0827, lng: 80.2707 }
    }
  
];

const insertMessLocations = async () => {
  try {
    const insertQuery = `
      INSERT INTO mess 
      (name, city, description, ratings, latitude, longitude, image, type, user_id, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    for (const location of messLocations) {
      const values = [
        location.name,
        location.city,
        location.description,
        location.ratings,
        location.coordinates.lat,
        location.coordinates.lng,
        location.image,        
        location.type,        
        location.user_id,        
        location.address,        

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
