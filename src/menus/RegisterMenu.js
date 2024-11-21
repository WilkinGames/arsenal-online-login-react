import React, { useState } from "react";
import { Menus } from "../App";

export default function RegisterMenu({ setMenu, register, message, setMessage })
{

    const [usernameText, setUsername] = useState();
    const [passwordText, setPassword] = useState();
    const [confirmPasswordText, setConfirmPassword] = useState();
    const [emailText, setEmail] = useState();
    const [isLoading, setIsLoading] = useState(false);

    function onSubmitClicked(e)
    {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        if (!usernameText)
        {
            setMessage({ message: "Please use a valid username", bError: true });
            return;
        }
        if (!passwordText)
        {
            setMessage({ message: "Please use a valid password", bError: true });
            return;
        }
        if (!confirmPasswordText || passwordText !== confirmPasswordText)
        {
            setMessage({ message: "Passwords do not match", bError: true });
            return;
        }
        if (!emailText)
        {
            setMessage({ message: "Please use a valid email", bError: true });
            return;
        }
        register(usernameText, passwordText, emailText, (data) =>
        {
            setIsLoading(false);
            if (data.username)
            {
                setMenu(Menus.Login);
                setMessage({ message: data.username + " is now registered!" });
            }
        });
    }

    function onLoginClicked(e)
    {
        setMenu(Menus.Login);
    }

    return (
        <>
            <h2>Create a new Arsenal Online account</h2>
            <div>
                <form>
                    <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} /> <br />
                    <input type="password" placeholder="Password" required onChange={(e) => {setPassword(e.target.value)}} /> <br />
                    <input type="password" placeholder="Confirm Password" required onChange={(e) => {setConfirmPassword(e.target.value)}} /> <br />
                    <input type="email" placeholder="Email" required onChange={(e) => {setEmail(e.target.value)}} /> <br />
                    <input className="loginButton" type="submit" value={isLoading ? "Connecting..." : "Register"} disabled={isLoading} onClick={onSubmitClicked}/>
                </form>
            </div>
            <div className={message?.bError ? "error" : "message"}>{message?.message}</div>
            <div className="registerText">
                Already have an account?
                <span className="registerLink" onClick={onLoginClicked}>Login</span>
            </div>
        </>
    )
}