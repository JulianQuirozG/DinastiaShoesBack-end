const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};


try {
  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage(firebaseApp);

  console.log('Conexión a Firebase exitosa');
  module.exports = { storage };
} catch (error) {
  console.error('Error al conectar con Firebase:', error);
  throw error; // Puedes manejar el error según tus necesidades específicas
}

//admin.initializeApp({
//    credential: admin.credential.cert(firebaseConfigu),
//    storageBucket: 'gs://dinastiashoesufps.appspot.com/DinastiaDev', // Reemplaza con tu URL de almacenamiento
//});

