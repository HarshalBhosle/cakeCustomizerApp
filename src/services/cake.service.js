// src/services/cake.service.js
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Get cake customization options
export const getCakeOptions = async () => {
  try {
    const flavorSnapshot = await getDocs(collection(db, "flavors"));
    const frostingSnapshot = await getDocs(collection(db, "frostings"));
    const toppingsSnapshot = await getDocs(collection(db, "toppings"));
    const sizesSnapshot = await getDocs(collection(db, "sizes"));
    
    const flavors = flavorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const frostings = frostingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const toppings = toppingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sizes = sizesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return { flavors, frostings, toppings, sizes };
  } catch (error) {
    console.error("Error getting cake options:", error);
    throw error;
  }
};

// Save order to database
export const saveOrder = async (orderData) => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: new Date()
    });
    return orderRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId) => {
  try {
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId));
    const ordersSnapshot = await getDocs(ordersQuery);
    return ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw error;
  }
};

export default { getUserOrders };