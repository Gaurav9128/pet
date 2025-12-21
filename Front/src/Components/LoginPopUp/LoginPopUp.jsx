import React,{useState} from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets';

const LoginPopUp = ({setShowLogin}) => {

    const [currState,setCurrState]=useState("Login");
  return (
    <div className='login-PopUp'>
        <form  className="login-PopUp-container">
            <div className='login-popup-title'>
                <h2>{currState}</h2>
                <img  onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt='' className='close-icon' />
            </div>
               <div className="login-popup-inputs">
                {currState==="Login"?<></>:  <input type="text" placeholder='Full Name' required />}
              
                <input type="email" placeholder='Email Address' required />
                <input type="password" placeholder='Password' required />
               </div>
               <button>{currState==="Sign Up"?"Create account":"Login"}</button>
               <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>I agree to the Terms of Service and Privacy Policy</p>
               </div>
               {currState==="Login"? <p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click Here</span></p>:<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login Here</span></p>}
              
               
               <div className="login-popup-switch">
               </div>
        </form>
        </div>
  )
}

export default LoginPopUp