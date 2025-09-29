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
    selectedCarId: undefined, // undefined = no car selected
    cars: [],
  });

  const selectedCar = carsState.cars.find((car) => car.id === carsState.selectedCarId);

  // -------------------- AUTH FUNCTIONS --------------------
  async function handleLogin(data) {
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
        setIsLoggedIn(true);
        setUserData(user);
        alert("Login successful!");
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error during login:", error);
    }
  }

  async function handleSignUp(data) {
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
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setAuthScreen("login");
    setCarsState({ selectedCarId: undefined, cars: [] });
  }

  const handleLogInClick = () => setAuthScreen("login");
  const handleSignUpClick = () => setAuthScreen("signup");

  // -------------------- FETCH CARS --------------------
  async function getCars() {
    const token = localStorage.getItem("authToken");
    const userDataLocal = JSON.parse(localStorage.getItem("user"));
    if (!userDataLocal) return;

    const url =
      userDataLocal.role === "admin"
        ? `${import.meta.env.VITE_API_URL}/api/v1/admin`
        : `${import.meta.env.VITE_API_URL}/api/v1/cars`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const carsList = await response.json();
        const normalizedCars = carsList.cars.map((car) => ({ ...car, id: car._id || car.id }));
        console.log("Fetched cars:", normalizedCars);
        setCarsState((prevState) => ({
          ...prevState,
          cars: normalizedCars,
          // preserve currently selected car if still exists
          selectedCarId:
            prevState.selectedCarId &&
            normalizedCars.some((c) => c.id === prevState.selectedCarId)
              ? prevState.selectedCarId
              : undefined,
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

  // -------------------- CAR FUNCTIONS --------------------
  const handleSelectCar = (id) => {
    setCarsState((prevState) => ({ ...prevState, selectedCarId: id }));
  };

  const handleStartAddCar = () => {
    setCarsState((prevState) => ({ ...prevState, selectedCarId: null }));
  };

  const handleCancelAddCar = () => {
    setCarsState((prevState) => ({ ...prevState, selectedCarId: undefined }));
  };

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCarsState((prevState) => ({
          ...prevState,
          cars: prevState.cars.filter((car) => car.id !== id),
          selectedCarId: undefined,
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

  const handleEditCar = async (selectedCarId, updatedFields) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/${selectedCarId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedFields),
        }
      );

      if (response.ok) {
        setCarsState((prevState) => ({
          ...prevState,
          cars: prevState.cars.map((car) =>
            car.id === selectedCarId ? { ...car, ...updatedFields } : car
          ),
        }));
        alert("Car successfully updated!");
      } else {
        const errorData = await response.json();
        alert(`Error updating car: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error editing car:", error);
    }
  };

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

  // -------------------- JSX --------------------
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
            <h1 className="font-bold text-xl text-stone-500 mb-2">
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
