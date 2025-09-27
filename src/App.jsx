import {useState, useEffect} from 'react';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Sidebar from "./components/Sidebar"
import NewCar from "./components/NewCar"
import NoCarSelected from './components/NoCarSelected';
import SelectedCar from './components/SelectedCar';
import AdminDashboard from './components/Dashboard';
import Landing from './components/Landing';

function App() {
   
  //technician comments logic 
  async function handleEditCar(selectedCarId, updatedFields){

    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/${selectedCarId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if(response.ok) {
        alert('car successfully updated');
        await getCars();
      } else {
        const errorData = await response.json();
        alert(`there was an error updating car: ${errorData.message}`);
      }
    } catch (error) {
      alert('Error during adding car to garage:', error);
    }

  }

  //create new user aka user signs up!
  const [userData, setUserData] = useState(null);

  //manages login/sign up screen
   const [authScreen, setAuthScreen] = useState('')
   //manages loggedIn state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [carsState, setCarsState] = useState({
    selectedCarId: undefined,  //doing nothing - not adding or selecting a car
    cars: []
  });

    //handles when user submits login form
    async function handleLogin(data){
    

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if(response.ok) {
          const {token, user} = await response.json();
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          setIsLoggedIn(true);
          setUserData(user);
          alert('Login successful!');
        } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.message}`);
        }
        setAuthScreen('signup'); //just incase
      } catch (error) {
        alert('Error during login:', error);
      }
    };


    //handle logout 
    function handleLogout(){
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      setAuthScreen('login')
    }

    //handles submission of sign up form 
    async function handleSignUp(data){
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          setUserData(data);
          alert('Signup successful!');
        } else {
          const errorData = await response.json();
          alert(`Signup failed: ${errorData.message}`);
        }
        setAuthScreen('login'); //just incase
      } catch (error) {
        alert('Error during signup:', error);
      }
    };
    
    //changes UI to log in form from the sign up page
    function handleLogInClick(){
      setAuthScreen('login')
    }

    //changes UI to sign up form from the log in page
    function handleSignUpClick(){
      setAuthScreen('signup')
    }

  //fetch car data from backend to display when user logs in 

  async function getCars(){
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('user'));

    //admins have access to all cars, clients have access to their cars only 
    const adminUrl = `${import.meta.env.VITE_API_URL}/api/v1/admin`;
    let url = `${import.meta.env.VITE_API_URL}/api/v1/cars`;

    if(userData.role === 'admin'){
       url = adminUrl;
    }else{
      url = url;
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.ok) {
        const carsList = await response.json();
       
        const normalizedCars = carsList.cars.map(car => ({
          ...car,
          id: car._id || car.id
        }));
        setCarsState(prevState => ({
            ...prevState, 
            cars: normalizedCars,
            selectedCarId: undefined, 
        }))

       // alert('cars successfully fetched!');
      } else {
        const errorData = await response.json();
        console.error(`there was an error fetching cars: ${errorData.message}`);
      }
      setAuthScreen('login'); //just incase
    } catch (error) {
      console.error('error fetching cars:', error)
      alert('Error fetching cars:');
    }
  }


  //recalls fetchCar if new cars get added
  useEffect(() => {
  if(isLoggedIn){
    getCars();
  }
   }, [isLoggedIn]);


 //saves todoList data in local storage so that it is avaible upon page refresh, get's called every time todolist is updated
 useEffect(() => {
   localStorage.setItem('savedCars', JSON.stringify(carsState.cars));
 }, []);

  //closes add car form and returns to fall back no cars selected screen
  function handleCancelAddCar(){
    setCarsState(prevState => {
      return {
        ...prevState, 
        selectedCarId:undefined,
      }
    })
  }

  
 


  //handles when user clicks the "add car" button to open the add car form
  function handleStartAddCar(){
    setCarsState(prevState => {
      return{
        ...prevState,
        selectedCarId: null,  //signal we are adding new project
      }
    })
  }


  //handles user completes & submits add car form
  async function handleAddCar(carData){
    const token = localStorage.getItem('authToken');
   
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(carData),
      });

      if(response.ok) {
        alert('car successfully added to the garage!');
        await getCars();
      } else {
        const errorData = await response.json();
        alert(`there was an error adding car to the garage: ${errorData.message}`);
      }
      setAuthScreen('login'); //just incase
    } catch (error) {
      alert('Error during adding car to garage:', error);
    }

  }

  //closes add car form and returns to fall back no cars selected screen
  function handleCancelAddCar(){
    setCarsState(prevState => {
      return {
        ...prevState, 
        selectedCarId:undefined,
      }
    })
  }

  //displays car data entered in form when car selected
  function handleSelectCar(id){
    setCarsState((prevState) => {
    return{
      ...prevState, 
      selectedCarId: id,
    }
    })
  }

  async function handleDeleteCar(id){
    const token = localStorage.getItem('authToken');

    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cars/${id}`, 
        {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`,
        }
      });
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.msg || "Something went wrong")
      }
      const data  = await response.json();

      console.log('DeletedCar:', data)

      setCarsState((prevState) => {
        
        return{
          ...prevState, 
          selectedCarId:undefined,
          cars: prevState.cars.filter((car) => car.id !== id),
        }
      })
      
      return data;
 
     }catch(error){
      console.error(error.message);
      return null;
     } 
  }


 
// Determine what content to render
const selectedCar = carsState.cars.find(car => car.id === carsState.selectedCarId);
let content;

//If not logged in, show signup/login screens
if (!isLoggedIn && authScreen === "signup") {
  content = <Signup onLoginClick={handleLogInClick} onSubmit={handleSignUp} />;
} else if (!isLoggedIn && authScreen === "login") {
  content = <Login onLogin={handleLogin} onSignUpClick={handleSignUpClick} />;
} else if (!isLoggedIn) {
  content = <Landing onLoginClick={handleLogInClick} onSignUpClick={handleSignUpClick} />;
}

//If adding a new car
else if (isLoggedIn && carsState.selectedCarId === null) {
  content = <NewCar onAdd={handleAddCar} onCancel={handleCancelAddCar} user = {userData} />;
}

//If viewing a selected car
else if (isLoggedIn && carsState.selectedCarId !== undefined && carsState.selectedCarId !== null) {
  content = <SelectedCar car={selectedCar} onDeleteCar={handleDeleteCar} onEditCar={handleEditCar} user={userData} />;
}

//Admin dashboard (only if logged in, admin, and not adding/viewing a car)
else if (isLoggedIn && userData.role === 'admin' && carsState.cars.length > 0) {
  content = (
    <AdminDashboard
      cars={carsState.cars}
      userData={userData}
      onSelectCar={handleSelectCar}
      onStartAddCar={handleStartAddCar}
      onEditCar = {handleEditCar}
    />
  );
}

//Fallback for normal users with no cars selected
else {
  content = <NoCarSelected onStartAddCar={handleStartAddCar} />;
}

  
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header  onLoginClick = {handleLogInClick} onSignUpClick = {handleSignUpClick} isLoggedIn = {isLoggedIn} onLogout = {handleLogout}/>
    <div className="flex flex-1 overflow-hidden mt-6 mb-6">
        {(isLoggedIn && userData.role !== 'admin') && (<Sidebar
          onStartAddCar={handleStartAddCar}
          cars={carsState.cars}
          onSelectCar={handleSelectCar}
        />)}
        <main className="flex-1 p-6 overflow-y-auto bg-white flex items-center justify-center">
          <div>
          <h1 className = "font-bold md: text-xl text-stone-500">{isLoggedIn && (`Welcome back to your garage, ${userData?.name.split(" ")[0] || ''}!`)}</h1>
          <p className ="mb-20 font-light text-stone-400">{isLoggedIn && ("Manage cars and see progress here")}</p>
          {content}
          </div>
        </main>
      </div>
  
      <Footer />
    </div>
  );
  
}

export default App
