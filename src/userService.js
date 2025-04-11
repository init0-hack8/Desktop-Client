// src/userService.js
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const createUser = async () => {
  const userId = uuidv4(); // Generate a UUID
  try {
    // Create a reference to the 'users' collection with the generated UUID as the document ID
    const userRef = doc(db, 'users', userId);
    // Set the document with the generated UUID
    await setDoc(userRef, {
      uuid: userId,
      createdAt: new Date()
    });
    console.log("User created with ID: ", userId);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
