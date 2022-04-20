## Classes

<dl>
<dt><a href="#Error">Error</a></dt>
<dd><p>Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.</p>
</dd>
<dt><a href="#Errr">Errr</a></dt>
<dd><p>Static class that contains the &#39;newError&#39; factory function.  Use the &#39;newError&#39; factory function to return an ErrorBuilder instance.</p>
</dd>
<dt><a href="#FromError">FromError</a></dt>
<dd><p>Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.</p>
</dd>
<dt><a href="#FromMessage">FromMessage</a></dt>
<dd><p>Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.</p>
</dd>
</dl>

<a name="Error"></a>

## Error
Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.

**Kind**: global class  

* [Error](#Error)
    * [new Error([message], [template])](#new_Error_new)
    * [.debug(params, [shouldDebug])](#Error+debug) ⇒ <code>ErrorBuilder</code>
    * [.set(key, value, [force])](#Error+set) ⇒ <code>ErrorBuilder</code>
    * [.setAll(object, [force])](#Error+setAll) ⇒ <code>ErrorBuilder</code>
    * [.appendTo(err)](#Error+appendTo) ⇒ <code>ErrorBuilder</code>
    * [.get()](#Error+get) ⇒ [<code>Error</code>](#Error)
    * [.throw()](#Error+throw)

<a name="new_Error_new"></a>

### new Error([message], [template])
Provides an interface to build an error.  Then allows you to get or throw the error.


| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |

<a name="Error+debug"></a>

### error.debug(params, [shouldDebug]) ⇒ <code>ErrorBuilder</code>
Add parameters to the stack trace that will make it easier to debug the problem.  These values will appear in a
in an object labeled "Debug Params" in the stack trace.  You may call the 'debug' function as many times as you'd
like on an ErrorBuilder instance.  If the same key is passed in many times, the time it is passed in, will be
the value that appears in the stack trace.

Unlike the 'set' function, which merges 'set' values from different Errr instances with its own instance, the debug
params start as an empty object for each Errr instance.  They are attached to the stack trace and then forgotten.

**Kind**: instance method of [<code>Error</code>](#Error)  
**Returns**: <code>ErrorBuilder</code> - - Returns the instance of errorBuilder to allow chainability.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Object Map of key value parameters that will make it easier to debug the error. |
| [shouldDebug] | <code>Boolean</code> | If shouldDebug === false, then debug params will not print.  Any other value (including undefined), and the debug params will be printed. Useful if you want to only print debugParams given an Environment Variable. |

<a name="Error+set"></a>

### error.set(key, value, [force]) ⇒ <code>ErrorBuilder</code>
Sets a value on the error object using the key as the variable name.  Values added using the 'set' function will
be appended to new error objects when using the the .appendTo function. I.e. the values on the appendTo err will be
copied to the new error.  These values are immutable though unless you use the 'force' value. As soon as you set
a value with a given key, it cannot be reset unless you pass in 'true' for the force variable.

The reason for enforcing an immutable paradigm, is to allow for values to be set on the error object at the level
where the error was originally thrown (seemingly where the most important info will come from).  This allows the user
to set a value such as 'reason' on the error object at all level of your code, but only the most important reason will
value will persist on the error object.

**Kind**: instance method of [<code>Error</code>](#Error)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key that will be used to set the value on the error object. |
| value | <code>Object</code> | The value that will be set on the object. |
| [force] | <code>Boolean</code> | If force equals true, then this value will override a value with the same key from an errr passed in using the 'appendTo' function. |

<a name="Error+setAll"></a>

### error.setAll(object, [force]) ⇒ <code>ErrorBuilder</code>
Same concept and functionality as the 'set' function.  The difference is that you can set all values in a
given object onto the Errr instance.

Follows the same immutable paradigm as the 'set' function.  The difference is that you are setting the force override
for all value in the given object.

See set to understand functionality better.

**Kind**: instance method of [<code>Error</code>](#Error)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Many key / value pairs to be set on the object. |
| [force] | <code>Boolean</code> | If force equals true, then this value will override a value with the same key from an errr passed in using the 'appendTo' function. |

<a name="Error+appendTo"></a>

### error.appendTo(err) ⇒ <code>ErrorBuilder</code>
Append the error being built, to the end of this error's stack trace.

**Kind**: instance method of [<code>Error</code>](#Error)  
**Returns**: <code>ErrorBuilder</code> - - Returns the instance of errorBuilder to allow chainability.  

| Param | Type | Description |
| --- | --- | --- |
| err | [<code>Error</code>](#Error) | The stack trace of the error being built, will be appended to this error's stack trace. |

<a name="Error+get"></a>

### error.get() ⇒ [<code>Error</code>](#Error)
Returns a new Error object using the given parameters from the builder.

**Kind**: instance method of [<code>Error</code>](#Error)  
**Returns**: [<code>Error</code>](#Error) - - Returns a new Error object using the given parameters from the builder.  
<a name="Error+throw"></a>

### error.throw()
Throws a new Error object using the given parameters from the builder.

**Kind**: instance method of [<code>Error</code>](#Error)  
**Throws**:

- [<code>Error</code>](#Error) - Throws a new Error object using the given parameters from the builder.

<a name="Errr"></a>

## Errr
Static class that contains the 'newError' factory function.  Use the 'newError' factory function to return an ErrorBuilder instance.

**Kind**: global class  

* [Errr](#Errr)
    * [.newError([message], [template])](#Errr.newError) ⇒ [<code>FromMessage</code>](#FromMessage)
    * ~~[.fromError(err)](#Errr.fromError) ⇒ [<code>FromError</code>](#FromError)~~

<a name="Errr.newError"></a>

### Errr.newError([message], [template]) ⇒ [<code>FromMessage</code>](#FromMessage)
Gets a new ErrorBuilder instance.

**Kind**: static method of [<code>Errr</code>](#Errr)  
**Returns**: [<code>FromMessage</code>](#FromMessage) - Gets an ErrorBuilder to get or throw an Error.  

| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |

<a name="Errr.fromError"></a>

### ~~Errr.fromError(err) ⇒ [<code>FromError</code>](#FromError)~~
***Deprecated***

**Kind**: static method of [<code>Errr</code>](#Errr)  
**Returns**: [<code>FromError</code>](#FromError) - Gets an ErrorBuilder to get or throw an Error.  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>String</code> | Will be used for the top level error and stack trace. |

<a name="FromError"></a>

## FromError
Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.

**Kind**: global class  
<a name="new_FromError_new"></a>

### new FromError(error)
Provides an interface to build an error from an error.  Then allows you to get or throw the error.


| Param | Type | Description |
| --- | --- | --- |
| error | <code>String</code> | Will be used for the top level error and stack trace. |

<a name="FromMessage"></a>

## FromMessage
Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.

**Kind**: global class  
<a name="new_FromMessage_new"></a>

### new FromMessage([message], [template])
Provides an interface to build an error from a message.  Then allows you to get or throw the error.


| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object.  If not given, empty string will be used for the error message. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |

