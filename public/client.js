/**
 * Arsenal Online Account Manager
 * (c) 2024 Wilkin Games 
 * https://wilkingames.com
 */
function Emitter(obj)
{
    if (obj) return mixin(obj);
};
function mixin(obj)
{
    for (var key in Emitter.prototype)
    {
        obj[key] = Emitter.prototype[key];
    }
    return obj;
}
Emitter.prototype.on =
    Emitter.prototype.addEventListener = function (event, fn)
    {
        this._callbacks = this._callbacks || {};
        (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
            .push(fn);
        return this;
    };
Emitter.prototype.once = function (event, fn)
{
    function on()
    {
        this.off(event, on);
        fn.apply(this, arguments);
    }
    on.fn = fn;
    this.on(event, on);
    return this;
};
Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function (event, fn)
    {
        this._callbacks = this._callbacks || {};
        if (0 == arguments.length)
        {
            this._callbacks = {};
            return this;
        }
        var callbacks = this._callbacks['$' + event];
        if (!callbacks) return this;
        if (1 == arguments.length)
        {
            delete this._callbacks['$' + event];
            return this;
        }
        var cb;
        for (var i = 0; i < callbacks.length; i++)
        {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn)
            {
                callbacks.splice(i, 1);
                break;
            }
        }
        if (callbacks.length === 0)
        {
            delete this._callbacks['$' + event];
        }
        return this;
    };
Emitter.prototype.emit = function (event)
{
    this._callbacks = this._callbacks || {};
    var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];
    for (var i = 1; i < arguments.length; i++)
    {
        args[i - 1] = arguments[i];
    }
    if (callbacks)
    {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i)
        {
            callbacks[i].apply(this, args);
        }
    }
    return this;
};
Emitter.prototype.listeners = function (event)
{
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
};
Emitter.prototype.hasListeners = function (event)
{
    return !!this.listeners(event).length;
};
function Encoder() { };
Encoder.prototype.encode = function (packet)
{
    return [JSON.stringify(packet)];
};
class Decoder extends Emitter
{
    add(chunk)
    {
        const packet = JSON.parse(chunk);
        if (this.isPacketValid(packet))
        {
            this.emit("decoded", packet);
        }
        else
        {
            throw new Error("invalid format");
        }
    }
    isPacketValid({ type, data, nsp, id })
    {
        const isNamespaceValid = typeof nsp === "string";
        const isAckIdValid = id === undefined || Number.isInteger(id);
        if (!isNamespaceValid || !isAckIdValid)
        {
            return false;
        }
        switch (type)
        {
            case 0: // CONNECT
                return data === undefined || typeof data === "object";
            case 1: // DISCONNECT
                return data === undefined;
            case 2: // EVENT
                return Array.isArray(data) && data.length > 0;
            case 3: // ACK
                return Array.isArray(data);
            case 4: // CONNECT_ERROR
                return typeof data === "object";
            default:
                return false;
        }
    }
    destroy() { }
};
var customParser = {
    Encoder: Encoder,
    Decoder: Decoder
};
var LoginClient = {
   setError: function (_str)
   {
       var error = document.getElementById("error");
       if (error)
       {
           error.innerHTML = _str;
           error.hidden = false;	
       }
   },
   connect: function (_url)
   {
       if (typeof io === "undefined")
       {
           console.warn("Invalid io reference");
           return;
       }
       var socket = io.connect(_url, {
           parser: customParser,
           reconnection: false
       });
       socket.on("connect", function ()
       {
           console.log("%cConnected to account server", "color: green;");
       });
       socket.on("disconnect", function ()
       {
           console.log("Disconnected from account server");
           document.getElementById("login").hidden = true;
           document.getElementById("register").hidden = true;
           document.getElementById("info").hidden = true;
           document.getElementById("buyContainer").hidden = true;
           document.getElementById("buttonsContainer").hidden = true;
           document.getElementById("success").hidden = true;            
           LoginClient.setError("Connection to account server failed!<br>Please try again later.");
           socket.disconnect();
       });
       socket.io.on("connect_error", function ()
       {
           console.log("Account server connection error");
           socket.disconnect();
       });
       socket.on("onLogin", function (_data)
       {
           console.log("Log in success", _data);
           document.getElementById("login").hidden = true;
           var info = document.getElementById("info");
           info.hidden = false;   
           var error = document.getElementById("error");
           error.hidden = true;	
           document.getElementById("buttonsContainer").hidden = true;			
           //document.getElementById("logoutContainer").hidden = false;	
           var str = "";
           var parsed = _data.profile;
           console.log(parsed);
           if (parsed && parsed.loadouts)
           {
               str += "<h1>Username: <font color=\"#FFE633\">" + _data.username + "</font></h1>";
               str += "<h2>Name: <font color=\"#FFE633\">" + parsed.name + "</font>";
               str += "<br><h2>Credits: <img src='https://arsenalonline.net/wp-content/uploads/2023/10/credits.png'/><span id=credits style='color:#45B3E4;'>" + LoginClient.formatNum(parsed.money) + "</span></h2>";
               str += _data.email + "<br>Level " + parsed.level + (parsed.prestige > 0 ? (" â€¢ Prestige " + parsed.prestige) : "");
               str += "<br><font color=\"#FFE633\">" + LoginClient.formatNum(parsed.xp) + " XP</font>";
               info.innerHTML = str;
               document.getElementById("buyContainer").hidden = false;
           }
           else
           {
               info.innerHTML = str + "Log into Arsenal Online to initialize your account.";
               document.getElementById("buyContainer").hidden = true;
           }
           //document.getElementById("logoutContainer").hidden = false;
           LoginClient.currentData = _data;
       });
       socket.on("onLoginFailed", function (_data)
       {
           console.log("Log in failed", _data);
           LoginClient.setError(_data.message);        
       });
       socket.on("onUpdateData", function (_data)
       {
           console.log("Updated data", _data);
       });
       socket.on("onUpdateDataFailed", function (_data)
       {
           console.log("Update data failed", _data);
       });
       socket.on("onRegister", function (_data)
       {
           console.log("Register success", _data);
           var info = document.getElementById("info");
           info.hidden = false;
           info.innerHTML = "<h2>Account created: " + _data.username + "</h2>";
           var login = document.getElementById("login");
           login.hidden = false;
           var register = document.getElementById("register");
           register.hidden = true;
           var error = document.getElementById("error");
           error.hidden = true;
           var field = document.getElementById("username");
           field.value = _data.username;
           document.getElementById("button_login").disabled = true;
           document.getElementById("button_register").disabled = false;
       });
       socket.on("onRegisterFailed", function (_data)
       {
           console.log("Register failed", _data);
           LoginClient.setError(_data.message);
       }); 
       socket.on("onOrderResult", function (_data)
       {
           console.log(_data);
           if (_data.bSuccess)
           {
               var credits = document.getElementById("credits");
               credits.innerHTML = LoginClient.formatNum(_data.money);
           }
           else 
           {
               console.warn(_data.message);
           }
       }); 
       LoginClient.socket = socket;
   },
   login(_username, _password)
   {
       LoginClient.socket.emit("login", _username, _password, "web");
   },
   ai(_id, _username, _referral)
   {
       LoginClient.socket.emit("addItem", _username, _id, _referral);
   },
   getCurrentData()
   {
       LoginClient.socket.emit("getCurrentData");
   },
   updatePlayerData(_data)
   {
       LoginClient.socket.emit("updatePlayerData", _data);
   },
   logout()
   {
       LoginClient.socket.emit("logout");        
   },
   register(_username, _password, _email, _data)
   {
       LoginClient.socket.emit("register", _username, _password, _email, _data);
   },
   forgotPassword(_username)
   {
       LoginClient.socket.emit("forgotPassword", _username);
   },
   disconnect()
   {
       if (LoginClient.socket)
       {
           LoginClient.socket.disconnect();
           delete LoginClient.socket;
       }
   },
   formatNum(_num) 
   {
       if (isNaN(_num) || _num == null)
       {
           return "0";
       }
       return _num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }    
};