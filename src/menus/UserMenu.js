import React from "react";

export default function UserMenu({ user, logout })
{
    function onLogoutClicked(e)
    {
        logout();
    }

    function ProfileMenu()
    {
        return (
            <>
                <div>Hello {user.profile.name}!</div>
                    <div className="credits">
                        <img src='https://arsenalonline.net/wp-content/uploads/2023/10/credits.png' alt="Credits" />{user.profile.money.toLocaleString()}
                </div>
                <div className="info">
                    <div className="registerText">{user.email}</div>
                    <div>
                        Level {user.profile.level} <br />
                        Prestige {user.profile.prestige} <br />
                        {user.profile.xp.toLocaleString()} XP
                    </div>
                    <div className="registerText">
                        <span className="registerLink" onClick={onLogoutClicked}>Logout</span>
                    </div>
                </div>
            </>
        )
    }

    function NoDataMenu()
    {
        return (
            <>
                <h2>Welcome to Arsenal Online</h2>
                <div className="info">Play Arsenal Online to initialize your profile.</div>
                <div className="registerText">
                    <span className="registerLink" onClick={onLogoutClicked}>Back to login</span>
                </div>
            </>
        )
    }

    return user && user.profile ? ProfileMenu() : NoDataMenu();
}