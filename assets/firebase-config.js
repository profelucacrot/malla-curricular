// 1) Reemplaza estos datos con la configuración de tu app web de Firebase.
// Firebase Console → Project settings → General → Your apps → Web app.
export const firebaseConfig = {
  apiKey: "AIzaSyBRRPtLjsWm1JzjMXxI-kr6X5ZzDKcGg2k",
  authDomain: "malla-curricular-fc77a.firebaseapp.com",
  projectId: "malla-curricular-fc77a",
  storageBucket: "malla-curricular-fc77a.firebasestorage.app",
  messagingSenderId: "508513856894",
  appId: "1:508513856894:web:2135601e997ab95bddd72f",
  measurementId: "G-ZLTQ6D7GY3"
};

// Ruta donde se guardará la malla en Realtime Database.
export const DB_PATH = "malla/cursos";

// Ya no se usa clave visible en el código.
// El editor usa Firebase Authentication. La autorización real se define en las reglas
// de Realtime Database mediante el UID del usuario administrador.
