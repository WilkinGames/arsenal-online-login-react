import React, { useState } from "react";
import { Menus } from "../App";

export default function LoginMenu( { username, setMenu, login, message })
{
    const [usernameText, setUsername] = useState();
    const [passwordText, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);
        
    function handleLogin(e)
    {
        e.preventDefault();
        setIsLoading(true);
        login(usernameText, passwordText, (data) =>
        {
            setIsLoading(false);
        });
    }
        
    function onRegisterClicked(e)
    {
        setMenu(Menus.Register);
    }

    function onForgotPasswordClicked(e)
    {
        setMenu(Menus.ForgotPassword);
    }

    return (
        <>
            <h2>Login to your Arsenal Online account</h2>
            <div>
                <form>
                    <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} /> <br />
                    <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} /> <br />
                    <input className="loginButton" type="submit" value={isLoading ? "Connecting..." : "Login"} disabled={isLoading} onClick={handleLogin} />
                </form>
            </div>
            <div className={message?.bError ? "error" : "message"}>{message?.message}</div>
            <div className="registerText">
                Don't have an account yet? 
                <span className="registerLink" onClick={onRegisterClicked}>Register Now</span>
            </div>
            <div className="registerText">
                <span className="registerLink" onClick={onForgotPasswordClicked}>Forgot Password</span>
            </div>
        </>
    )
}