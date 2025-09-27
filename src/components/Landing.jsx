

export default function Landing ({onLoginClick, onSignUpClick}){

    return(
        <div>
        <div className = "px-4 py-4 flex flex-col md:flex-row items-center justify-between bg-stone-100">
        <div className = "max-w-xl mr-2 p-6">
        <h1 className = "uppercase text-xs text-orange-400 font-semibold">Auto Repair Management, Simplified</h1>
        <h2 className = "font-extrabold text-4xl md:text-6xl mb-4 text-stone-800">From Wrench to Web</h2>
        <p className = "mb-6 font-light text-lg">An all-in-one tool for auto-repair shops to manage repairs, track progress, and update customers in real time.</p>
        <div className = "flex gap-3">
        <button onClick = {onSignUpClick} className = "px-6 py-2 mx-1 md:text-base rounded-md bg-cyan-500/70 text-stone-200 hover:bg-stone-950">Get Started</button>
        <button onClick = {onLoginClick} className = "px-6 py-2 md:text-base rounded-md text-stone-800 border-solid border border-stone-800 hover:bg-stone-500 hover:text-stone-200" >Log In</button>
        </div>
        </div>
        <div className = "mt-6 md:mt-0"><img src = 'automotive.png' alt = "landing page image" className = "max-w-sm w-full"/></div>
        </div>
        <div className="mt-10">
    <h1 className="mt-4 text-3xl font-semibold text-center">How It Works</h1>
    <p className="text-center font-light mb-5">Start Tracking Repairs with Ease</p>
    <ul className="flex flex-row justify-between gap-4">
        <li className="bg-stone-100 p-6 text-center rounded-xl transition-all duration-300 hover:-translate-y-1 flex-1 h-32 flex flex-col justify-center">
            <h2 className="font-semibold mb-2">Create Your Shop</h2>
            <p className="font-light text-sm leading-relaxed">Set Up Your Digital Garage</p>
        </li>
        <li className="bg-stone-100 p-6 text-center rounded-xl  transition-all duration-300 hover:-translate-y-1 flex-1 h-32 flex flex-col justify-center">
            <h2 className="font-semibold mb-2">Manage Repairs</h2>
            <p className="font-light text-sm leading-relaxed">Track progress and manage repairs</p>
        </li>
        <li className="bg-stone-100 p-6 text-center rounded-xl  transition-all duration-300 hover:-translate-y-1 flex-1 h-32 flex flex-col justify-center">
            <h2 className="font-semibold mb-2">Update Customers</h2>
            <p className="font-light text-sm leading-relaxed">Send real time updates directly to customers</p>
        </li>
    </ul>
</div>
        </div>
        
    )
}