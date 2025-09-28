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
  // -------------------- USER & AUTH --------------------
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState(""); // 'login' | 'signup'

  // -------------------- CARS STATE --------------------
  const [carsState, setCarsState] = useState({
    selectedCarId: undefined,
    cars: [],
  });

  const selectedCar = carsState.cars.find(
    (car) => car.id === carsState.selectedCarId
  );

  // -------------------- FETCH CARS --------------------
  async function getCars() {
    const token = localStorage.getItem("authToken");
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (!localUser) return;

    let url =
      localUser.role === "admin"
        ? `${import.meta.env.VITE_API_URL}/api/v1/admin`
        : `${import.meta.env.VITE_API_URL}/api/v1/cars`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const normalizedCars = data.cars.map((car) => ({
          ...car,
          id: car._id?.toString() || car.id?.toString(),
        }));
        setCarsState((prev) => ({
          ...prev,
          cars: normalizedCars,
          // keep selectedCarId as-is
        }));
      } else {
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) getCars();
  }, [isLoggedIn]);

  // -------------------- AUTH HANDLERS --------------------
  async function handleLogin(data) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUserData(user);
        setIsLoggedIn(true);
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  async function handleSignUp(data) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        alert("Signup successful! Please login.");
        setAuthScreen("login");
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    setCarsState({ selectedCarId: undefined, cars: [] });
    setAuthScreen("login");
  }

  function handleLogInClick() {
    setAuthScreen("login");
  }

  function handleSignUpClick() {
    setAuthScreen("signup");
  }

  // -------------------- CAR HANDLERS --------------------
  function handleSelectCar(id) {
    setCarsState((prev) => ({ ...prev, selectedCarId: id.toString() }));
  }

  function handleStartAddCar() {
    setCarsState((prev) => ({ ...prev, selectedCarId: null }));
  }

  function handleCancelAddCar() {
    setCarsState((prev) => ({ ...prev, selectedCarId: undefined }));
  }

  async function handleAddCar(carData) {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(carData),
      });
      if (response.ok) {
        await getCars();
        handleCancelAddCar();
      } else {
        const errorData = await response.json();
        alert(`Error adding car: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Add car error:", error);
    }
  }

  async function handleDeleteCar(id) {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setCarsState((prev) => ({
          ...prev,
          cars: prev.cars.filter((car) => car.id !== id),
          selectedCarId: undefined,
        }));
      } else {
        const errorData = await response.json();
        alert(`Error deleting car: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Delete car error:", error);
    }
  }

  async function handleEditCar(id, updatedFields) {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedFields),
      });
      if (response.ok) {
        setCarsState((prev) => ({
          ...prev,
          cars: prev.cars.map((car) => (car.id === id ? { ...car, ...updatedFields } : car)),
        }));
      } else {
        const errorData = await response.json();
        alert(`Error updating car: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Edit car error:", error);
    }
  }

  // -------------------- RENDER LOGIC --------------------
  let content;
  if (!isLoggedIn && authScreen === "signup") {
    content = <Signup onLoginClick={handleLogInClick} onSubmit={handleSignUp} />;
  } else if (!isLoggedIn && authScreen === "login") {
    content = <Login onLogin={handleLogin} onSignUpClick={handleSignUpClick} />;
  } else if (!isLoggedIn) {
    content = <Landing onLoginClick={handleLogInClick} onSignUpClick={handleSignUpClick} />;
  } else if (isLoggedIn && carsState.selectedCarId === null) {
    content = <NewCar onAdd={handleAddCar} onCancel={handleCancelAddCar} user={userData} />;
  } else if (isLoggedIn && carsState.selectedCarId !== undefined && carsState.selectedCarId !== null) {
    content = (
      <SelectedCar
        car={selectedCar}
        onDeleteCar={handleDeleteCar}
        onEditCar={handleEditCar}
        user={userData}
      />
    );
  } else if (isLoggedIn && userData.role === "admin" && carsState.cars.length > 0) {
    content = (
      <AdminDashboard
        cars={carsState.cars}
        userData={userData}
        onSelectCar={handleSelectCar}
        onStartAddCar={handleStartAddCar}
        onEditCar={handleEditCar}
      />
    );
  } else {
    content = <NoCarSelected onStartAddCar={handleStartAddCar} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        onLoginClick={handleLogInClick}
        onSignUpClick={handleSignUpClick}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 overflow-hidden mt-6 mb-6">
        {isLoggedIn && userData.role !== "admin" && (
          <Sidebar
            onStartAddCar={handleStartAddCar}
            cars={carsState.cars}
            onSelectCar={handleSelectCar}
          />
        )}
        <main className="flex-1 p-6 overflow-y-auto bg-white flex items-center justify-center">
          <div className="w-full">
            <h1 className="font-bold text-xl text-stone-500">
              {isLoggedIn && `Welcome back to your garage, ${userData?.name.split(" ")[0] || ""}!`}
            </h1>
            <p className="mb-6 font-light text-stone-400">
              {isLoggedIn && "Manage cars and see progress here"}
            </p>
            {content}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
