import React from "react";
import { useEffect, useState } from 'react';
import { Menus } from "../App";
import LoginMenu from "./LoginMenu";
import RegisterMenu from "./RegisterMenu";
import ForgotPasswordMenu from "./ForgotPasswordMenu";

export default function LoginContainer({ username, login, register, forgotPassword, message, setMessage })
{

    const [currentMenu, setCurrentMenu] = useState(Menus.Login);

    useEffect(() =>
    {
        //setMessage(null);
    }, [currentMenu]);

    function Menu()
    {
        switch (currentMenu)
        {
            case Menus.Login:
            default:
                return <LoginMenu username={username} setMenu={setCurrentMenu} login={login} message={message} />            
            case Menus.Register:
                return <RegisterMenu setMenu={setCurrentMenu} register={register} message={message} setMessage={setMessage} />            
            case Menus.ForgotPassword:
                return <ForgotPasswordMenu setMenu={setCurrentMenu} forgotPassword={forgotPassword} />
        }
    }

    return Menu();
}