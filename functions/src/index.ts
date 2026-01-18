import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// ================================
//  V1 EQUIVALENT OF onCall
// ================================

export const hello = functions.https.onCall((data, context) => {
  return { text: "Hello from Firebase Functions!" };
});

// ================================
//  V1 EQUIVALENT OF onRequest
// ================================

export const helloWorld = functions.https.onRequest((req, res) => {
  console.log("Hello logs!");
  res.send("Hello from Firebase!");
});
