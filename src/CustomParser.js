/**
 * Custom message parser for Socket.IO
 * @param {*} obj 
 * @returns 
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
export var Parser = {
    Encoder: Encoder,
    Decoder: Decoder
};