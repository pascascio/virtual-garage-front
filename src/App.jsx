import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Sidebar from "./components/Sidebar";
import NewCar from "./components/NewCar";
import NoCarSelected from "./components/NoCarSelected";
import SelectedCar from "./components/SelectedCar";
import AdminDashboard from "./components/Dashboard";
import Landing from "./components/Landing";

function App() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState("");
  const [carsState, setCarsState] = useState({ selectedCarId: undefined, cars: [] });

  const selectedCar = carsState.cars.find((car) => car.id === carsState.selectedCarId);

  // --- USER AUTH ---
  const handleLogin = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUserData(user);
        setIsLoggedIn(true);
        alert("Login successful!");
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error during login:", error);
    }
  };

  const handleSignUp = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setUserData(data);
        alert("Signup successful!");
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.message}`);
      }
      setAuthScreen("login");
    } catch (error) {
      alert("Error during signup:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCarsState({ selectedCarId: undefined, cars: [] });
    setAuthScreen("login");
  };

  const handleLogInClick = () => setAuthScreen("login");
  const handleSignUpClick = () => setAuthScreen("signup");

  // --- CARS ---
  async function getCars() {
    const token = localStorage.getItem("authToken");
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (!userLocal) return;

    const url = userLocal.role === "admin"
      ? `${import.meta.env.VITE_API_URL}/api/v1/admin`
      : `${import.meta.env.VITE_API_URL}/api/v1/cars`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const carsList = await response.json();
        const normalizedCars = carsList.cars.map(car => ({
          ...car,
          id: car._id?.toString() || car.id?.toString(),
        }));
        console.log("Fetched cars:", normalizedCars);
        setCarsState(prev => ({
          ...prev,
          cars: normalizedCars,
          selectedCarId: prev.selectedCarId, // keep selection
        }));
      } else {
        const errorData = await response.json();
        console.error("Error fetching cars:", errorData.message);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }

  useEffect(() => { if (isLoggedIn) getCars(); }, [isLoggedIn]);

  const handleSelectCar = (id) => {
    setCarsState(prev => ({ ...prev, selectedCarId: id.toString() }));
  };

  const handleStartAddCar = () => setCarsState(prev => ({ ...prev, selectedCarId: null }));
  const handleCancelAddCar = () => setCarsState(prev => ({ ...prev, selectedCarId: undefined }));

  const handleAddCar = async (carData) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(carData),
      });
      if (response.ok) {
        alert("Car successfully added!");
        await getCars();
      } else {
        const errorData = await response.json();
        alert(`Error adding car: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error adding car:", error);
    }
  };

  const handleDeleteCar = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cars/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) {
        setCarsState(prev => ({
          ...prev,
          selectedCarId: undefined,
          cars: prev.cars.filter(car => car.id !== id),
        }));
        alert("Car deleted!");
      } else {
        const errorData = await response.json();
        alert(`Error deleting car: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error deleting car:", error);
    }
  };

  const handleEditCar = async (id, updatedFields) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedFields),
      });
      if (response.ok) {
        setCarsState(prev => ({
          ...prev,
          cars: prev.cars.map(car => (car.id === id ? { ...car, ...updatedFields } : car)),
        }));
        alert("Car updated!");
      } else {
        const errorData = await response.json();
        alert(`Error updating car: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error editing car:", error);
    }
  };

  // --- RENDER LOGIC ---
  let content;

  if (!isLoggedIn && authScreen === "signup") content = <Signup onLoginClick={handleLogInClick} onSubmit={handleSignUp} />;
  else if (!isLoggedIn && authScreen === "login") content = <Login onLogin={handleLogin} onSignUpClick={handleSignUpClick} />;
  else if (!isLoggedIn) content = <Landing onLoginClick={handleLogInClick} onSignUpClick={handleSignUpClick} />;
  else if (isLoggedIn && carsState.selectedCarId === null) content = <NewCar onAdd={handleAddCar} onCancel={handleCancelAddCar} user={userData} />;
  else if (isLoggedIn && carsState.selectedCarId !== undefined && carsState.selectedCarId !== null) content = <SelectedCar car={selectedCar} onDeleteCar={handleDeleteCar} onEditCar={handleEditCar} user={userData} />;
  else if (isLoggedIn && userData.role === "admin" && carsState.cars.length > 0) content = <AdminDashboard cars={carsState.cars} userData={userData} onSelectCar={handleSelectCar} onStartAddCar={handleStartAddCar} onEditCar={handleEditCar} />;
  else content = <NoCarSelected onStartAddCar={handleStartAddCar} />;

  return (
    <div className="flex flex-col min-h-screen">
      <Header onLoginClick={handleLogInClick} onSignUpClick={handleSignUpClick} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden mt-6 mb-6">
        {isLoggedIn && userData.role !== "admin" && <Sidebar cars={carsState.cars} onSelectCar={handleSelectCar} onStartAddCar={handleStartAddCar} />}
        <main className="flex-1 p-6 overflow-y-auto bg-white flex items-center justify-center">
          <div>
            <h1 className="font-bold md:text-xl text-stone-500">{isLoggedIn && `Welcome back to your garage, ${userData?.name.split(" ")[0] || ""}!`}</h1>
            <p className="mb-6 font-light text-stone-400">{isLoggedIn && "Manage cars and see progress here"}</p>
            {content}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
