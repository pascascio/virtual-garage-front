
export default function Header({onLogoClick, onLoginClick, onSignUpClick, isLoggedIn, onLogout, onHomeClick}){
    return(
        <header className = "p-4 bg-stone-800">
        <nav className = "flex items-center justify-between">
            <div className = "flex items-center space-x-3">
            {/* <img src = "logo.png" alt = "Virtual Garage Logo" className = "h-8 w-auto"/>*/}
            <button className = "text-2xl font-light text-stone-200" onClick = {onLogoClick}>Virtual Garage</button>
            </div>
            {isLoggedIn? 
            <ul className = "flex space-x-4">
                 <li className = "font-light px-4 py-2 mx-1 md:text-base rounded-md  bg-cyan-500/70 text-stone-200 hover:bg-stone-500 hover:text-stone-200" onClick = {onHomeClick}> Home</li> 
                <li className = "font-light px-4 py-2 mx-1 md:text-base rounded-md text-stone-800 bg-stone-200  hover:bg-stone-500  hover:text-stone-200" onClick = {onLogout}>  Logout</li> 
                </ul>
                :
            <ul className = "flex space-x-4">
                <li className = "font-light px-4 py-2 mx-1 md:text-base rounded-md  bg-cyan-500/70 text-stone-200 hover:bg-stone-500 hover:text-stone-200" onClick = {onSignUpClick}> Sign Up</li> 
                <li className = "font-light px-4 py-2 mx-1 md:text-base rounded-md text-stone-800 bg-stone-200  hover:bg-stone-500  hover:text-stone-200" onClick = {onLoginClick}>  Login</li>
            </ul>
}
        </nav>
    </header>
    )
}