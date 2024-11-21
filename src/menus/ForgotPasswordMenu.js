import React, { useRef, useState } from "react";
import { Menus } from "../App";

export default function ForgotPasswordMenu({ setMenu, forgotPassword })
{

    const [username, setUsername] = useState();

    function onSubmitClicked(e)
    {
        e.preventDefault();
        forgotPassword(username);
        setMenu(Menus.Login);
    }

    function onBackClicked(e)
    {
        setMenu(Menus.Login);
    }

    return (
        <>
            <h2>Forgot Password?</h2>
            <div className="info">No problem, just enter your username.</div>
            <form>
                <input type="text" placeholder="Username" required onChange={(e) => {setUsername(e.target.value)}}></input> <br />
                <input className="loginButton" type="submit" value="Send Reset Email" onClick={onSubmitClicked}></input>
            </form>
            <div className="registerText">
                <span className="registerLink" onClick={onBackClicked}>Back to login</span>
            </div>
        </>
    )

}