import "./App.css";
import LoginContainer from "./menus/LoginContainer.js";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Parser } from "./CustomParser.js";
import UserMenu from "./menus/UserMenu.js";

export const Menus = {
    Login: "login",
    Register: "register",
    ForgotPassword: "forgotPassword"
}
const LOCAL_STORAGE_KEY = "arsenal.username";
const URL = "https://arsenal-account-us.wilkingames.net/";

/**
 * Socket.IO
 */
export const socket = io(URL, {
    parser: Parser,
    autoConnect: false
});

/**
 * React app
 * @returns 
 */
export default function App() 
{
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() =>
    {
        fetch("https://xwilkinx.com/data/arsenal/account.txt").then((res) =>
        {
            res.text().then((url) =>
            {
                socket.connect();
                function onConnect()
                {
                    console.log("%cConnected to server", "color:green;");
                    setIsConnected(true);
                }
                function onDisconnect()
                {
                    console.log("%cDisconnected from server", "color:red;");
                    setIsConnected(false);
                }
                socket.on("connect", (onConnect));
                socket.on("disconnect", onDisconnect);
                socket.on("onLogin", (data) =>
                {
                    console.log("Log in success!", data);
                    setUser(data);
                    setMessage(null);
                });
                socket.on("onLoginFailed", (data) =>
                {
                    console.log("Log in failed", data);
                    setUser(null);
                    setMessage({ message: data.message, bError: true });
                });
                socket.on("onUpdateData", (data) =>
                {
                    console.log("Updated data", data);
                });
                socket.on("onUpdateDataFailed", (data) =>
                {
                    console.log("Update data failed", data);
                });
                socket.on("onRegister", (data) =>
                {
                    console.log("Register success", data);
                });
                socket.on("onRegisterFailed", (data) =>
                {
                    console.log("Register failed", data);
                    setMessage({ message: data.message, bError: true });
                });
                socket.on("onOrderResult", (data) =>
                {
                    console.log(data);
                    if (data.bSuccess)
                    {
                        //data.money;
                    }
                    else 
                    {
                        console.warn(data.message);
                    }
                });
                socket.on("onForgotPassword", (data) =>
                {
                    if (data.bSuccess)
                    {
                        setMessage({ message: "Check your email for a Reset Password email!" });
                    }
                    else 
                    {
                        setMessage({ message: "An unknown error occurred", bError: 1 });
                    }
                });
                return () =>
                {
                    socket.off("connect", onConnect);
                    socket.off("disconnect", onDisconnect);
                    socket.removeAllListeners();
                };
            });
        });
    }, []);

    useEffect(() =>
    {
        const lastUsername = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (lastUsername)
        {
            setUsername(lastUsername);
        }
    }, []);

    useEffect(() =>
    {
        if (user)
        {
            localStorage.setItem(LOCAL_STORAGE_KEY, user.username);
        }
    }, [user]);

    useEffect(() =>
    {
        console.log(message);
    }, [message]);

    function login(username, password, callback)
    {
        socket.emit("login", username, password);
        socket.once("onLogin", (data) =>
        {
            callback(data);
        });
        socket.once("onLoginFailed", (data) =>
        {
            callback(data);
        });
    }

    function register(username, password, email, callback)
    {
        socket.emit("register", username, password, email);
        socket.once("onRegister", (data) =>
        {
            callback(data);
        });
        socket.once("onRegisterFailed", (data) =>
        {
            callback(data);
        });
    }

    function forgotPassword(username)
    {
        socket.emit("forgotPassword", username);
    }

    function logout()
    {
        socket.emit("logout");
        setUser(null);
        setMessage(null);
    }

    function Menu()
    {
        if (user)
        {
            return <UserMenu user={user} logout={logout} />
        }
        else 
        {
            return <LoginContainer username={username} login={login} register={register} forgotPassword={forgotPassword} user={user} message={message} setMessage={setMessage} />
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                {Menu()}
            </header>
        </div>
    );
}