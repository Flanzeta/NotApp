import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profesor from "./pages/Profesor";
import InfoCurso from "./pages/InfoCurso";
import Calendario from "./components/Calendario/Calendario";
import Admini from "./pages/Admini";
import Apoderado from "./pages/Apoderado";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Casa from "./pages/Casa";
import Products from "./pages/products";
import Product1 from "./pages/product1";
import Product2 from "./pages/product2";
import Product3 from "./pages/product3";
import DynamicPage from "./pages/DynamicPage";

import { auth } from "./AuthContext";
import { getDatabase } from "firebase/database"; // Firebase v9+
import { getFirestore } from "firebase/firestore";
import {
  AuthProvider,
  DatabaseProvider,
  FirestoreProvider,
  useFirebaseApp,
} from "reactfire";

function App() {
  const app = useFirebaseApp(); // a parent element contains a `FirebaseAppProvider`

  // initialize Database and Auth with the normal Firebase SDK functions
  const database = getDatabase(app);
  const firestore = getFirestore(app);

  return (
    <FirestoreProvider sdk={firestore}>
      <AuthProvider sdk={auth}>
        <DatabaseProvider sdk={database}>
          <UserProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admini/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/admini"
                    element={
                      <ProtectedRoute>
                        <Admini />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/calendario"
                    element={
                      <ProtectedRoute>
                        <Calendario />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profesor"
                    element={
                      <ProtectedRoute>
                        <Profesor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cursos/:id"
                    element={
                      <ProtectedRoute>
                        <InfoCurso />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/Apoderado"
                    element={
                      <ProtectedRoute>
                        <Apoderado />
                      </ProtectedRoute>
                    }
                  />
                  {/* <Route path="/products" element={<Products />} />
                <Route path="/products/product1" element={<Product1 />} />
                <Route path="/products/product2" element={<Product2 />} />
                <Route path="/products/product3" element={<Product3 />} />
                <Route path="/products/:id" element={<DynamicPage />} /> */}
                </Routes>
              </div>
            </Router>
          </UserProvider>
        </DatabaseProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
}

export default App;
