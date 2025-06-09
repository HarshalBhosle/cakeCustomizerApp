/*
Firebase Firestore Database Schema

Collections:
1. users
2. flavors
3. toppings
4. sizes
5. orders

Schema Details:
*/

// users collection
const userSchema = {
    uid: "string", // Firebase Auth UID
    name: "string",
    email: "string",
    phone: "string", // Optional
    address: "string", // Optional
    city: "string", // Optional
    state: "string", // Optional
    zipCode: "string", // Optional
    createdAt: "timestamp",
    orders: ["string"] // Array of order IDs (optional, can be queried)
  };
  
  // flavors collection
  const flavorSchema = {
    name: "string", // e.g. "Chocolate", "Vanilla", "Red Velvet"
    description: "string",
    price: "number", // Base price
    colorCode: "string", // for visual representation
    available: "boolean",
    popular: "boolean", // Optional for featuring
    imageUrl: "string" // Optional
  };
  
  // toppings collection
  const toppingSchema = {
    name: "string", // e.g. "Chocolate Chips", "Sprinkles", "Fruit"
    description: "string",
    price: "number",
    colorCode: "string", // for visual representation
    category: "string", // e.g. "Candy", "Fruit", "Nuts"
    available: "boolean",
    popular: "boolean", // Optional for featuring
    imageUrl: "string" // Optional
  };
  
  // sizes collection
  const sizeSchema = {
    name: "string", // e.g. "Small", "Medium", "Large"
    diameter: "number", // in inches
    priceMultiplier: "number", // e.g. 1.0, 1.5, 2.0
    servings: "number", // Approximate number of servings
    available: "boolean"
  };
  
  // orders collection
  const orderSchema = {
    userId: "string", // Reference to the user
    items: [
      {
        id: "string",
        flavor: {
          id: "string",
          name: "string",
          price: "number",
          colorCode: "string"
        },
        toppings: [
          {
            id: "string",
            name: "string",
            price: "number",
            colorCode: "string"
          }
        ],
        size: {
          id: "string",
          name: "string",
          priceMultiplier: "number",
          diameter: "number",
          servings: "number"
        },
        quantity: "number",
        totalPrice: "number"
      }
    ],
    customer: {
      name: "string",
      address: "string",
      city: "string",
      state: "string",
      zipCode: "string",
      phone: "string"
    },
    delivery: {
      date: "string", // YYYY-MM-DD format
      time: "string", // HH:MM format
      specialInstructions: "string"
    },
    payment: {
      method: "string", // "credit", "paypal", "cash"
      status: "string" // "pending", "completed", "failed"
    },
    pricing: {
      subtotal: "number",
      deliveryFee: "number", 
      total: "number"
    },
    status: "string", // "pending", "confirmed", "baking", "delivering", "delivered", "cancelled"
    createdAt: "timestamp",
    updatedAt: "timestamp" // Last status update
  };
  
  // Sample Seed Data for Firestore
  const sampleData = {
    flavors: [
      {
        name: "Chocolate",
        description: "Rich chocolate cake made with premium cocoa",
        price: 20,
        colorCode: "#3c2218",
        available: true,
        popular: true
      },
      {
        name: "Vanilla",
        description: "Classic vanilla cake made with Madagascar vanilla",
        price: 18,
        colorCode: "#f3e5ab",
        available: true,
        popular: true
      },
      {
        name: "Red Velvet",
        description: "Smooth red velvet cake with a hint of cocoa",
        price: 22,
        colorCode: "#b20000",
        available: true,
        popular: true
      },
      {
        name: "Carrot",
        description: "Moist carrot cake with cinnamon and spices",
        price: 24,
        colorCode: "#e97451",
        available: true,
        popular: false
      },
      {
        name: "Lemon",
        description: "Refreshing lemon cake with a zesty flavor",
        price: 21,
        colorCode: "#fff44f",
        available: true,
        popular: false
      }
    ],
    toppings: [
      {
        name: "Chocolate Frosting",
        description: "Rich chocolate frosting made with dark chocolate",
        price: 5,
        colorCode: "#3c2218",
        category: "Frosting",
        available: true,
        popular: true
      },
      {
        name: "Vanilla Buttercream",
        description: "Light and fluffy vanilla buttercream",
        price: 4,
        colorCode: "#f3e5ab",
        category: "Frosting",
        available: true,
        popular: true
      },
      {
        name: "Fresh Strawberries",
        description: "Sliced fresh strawberries",
        price: 6,
        colorCode: "#ff3030",
        category: "Fruit",
        available: true,
        popular: true
      },
      {
        name: "Chocolate Chips",
        description: "Semi-sweet chocolate chips",
        price: 3,
        colorCode: "#3c2218",
        category: "Candy",
        available: true,
        popular: true
      },
      {
        name: "Sprinkles",
        description: "Rainbow colored sprinkles",
        price: 2,
        colorCode: "#e97451",
        category: "Candy",
        available: true,
        popular: true
      },
      {
        name: "Chopped Nuts",
        description: "Mixed chopped nuts",
        price: 4,
        colorCode: "#c68e50",
        category: "Nuts",
        available: true,
        popular: false
      },
      {
        name: "Caramel Drizzle",
        description: "Sweet caramel sauce drizzle",
        price: 3,
        colorCode: "#c68e50",
        category: "Sauce",
        available: true,
        popular: false
      },
      {
        name: "Edible Flowers",
        description: "Beautiful and edible flower decorations",
        price: 7,
        colorCode: "#ff3030",
        category: "Decoration",
        available: true,
        popular: false
      }
    ],
    sizes: [
      {
        name: "Small (6-inch)",
        diameter: 6,
        priceMultiplier: 1.0,
        servings: 8,
        available: true
      },
      {
        name: "Medium (8-inch)",
        diameter: 8,
        priceMultiplier: 1.5,
        servings: 12,
        available: true
      },
      {
        name: "Large (10-inch)",
        diameter: 10,
        priceMultiplier: 2.0,
        servings: 16,
        available: true
      },
      {
        name: "Extra Large (12-inch)",
        diameter: 12,
        priceMultiplier: 2.5,
        servings: 24,
        available: true
      }
    ]
  };