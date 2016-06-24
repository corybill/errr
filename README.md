# Errr
"Error factory with the ability to append stack traces from previous errors, as well as appending debug params to stack traces.  Great if you want one appended stack trace that defines the error at many levels of your code.  This concept works wonders when using promise chains because you get the stack trace at each level of your code.

[![view on npm](http://img.shields.io/npm/v/errr.svg)](https://www.npmjs.org/package/errr)
[![npm module downloads](http://img.shields.io/npm/dt/errr.svg)](https://www.npmjs.org/package/errr)
[![Build Status](https://travis-ci.org/corybill/errr.svg?branch=master)](https://travis-ci.org/corybill/errr)
[![Gitter](https://badges.gitter.im/corybill/errr.svg)](https://gitter.im/corybill/errr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Best Practices
1. Each layer of your code should catch an error, and append that error to the incoming error.
2. Add debug params to each error build to assist debugging later.
3. Do NOT add large objects to debug params.  It only makes reading the logs more difficult.
4. Throw all errors to the top layer of code and only log the error in that layer of code.  Doing this ensures you have one log statement with the entire stack trace which will make debugging much easier.

## Install
<pre>npm install errr</pre>

## Example
<pre>
// debug, set, and appendTo are optional
// Throws an error

try {
  Errr.newError(message, template).debug(this.debugParams)
    .set("reason", someReason).set("statusCode", 404)
    .appendTo(someError).throw();
} catch (err) {
  let reason = err.reason; // Get value from someReason
  let allDebugParams = err.getAllDebugParams() // Get an array of all the debug params from all appended errors
}
</pre>

<pre>
// Returns an error.
let errr = Errr.newError(message, template).debug(this.debugParams)
  .set("reason", someReason).set("statusCode", 404)
  .appendTo(someError).get();
  
let reason = errr.reason; // Get value from someReason
let allDebugParams = errr.getAllDebugParams() // Get an array of all the debug params from all appended errors
</pre>
<pre>

</pre>
## Example Output
<pre>
Error: [0d7c45075935b73716643af5] Some Error
    at ErrorBuilder._build_ (/Users/corybillparrish/workspace/errr/lib/error-builder.js:89:17)
    at ErrorBuilder.get (/Users/corybillparrish/workspace/errr/lib/error-builder.js:73:17)
    at Object.context.entryPointObject.run (/Users/corybillparrish/workspace/errr/spec/unit/errr-spec.js:1297:74)
    at FromSynchronousScenario.test (/Users/corybillparrish/workspace/errr/node_modules/maddox/lib/scenarios/functional/from-synchronous-scenario.js:17:46)
    at Context.<anonymous> (/Users/corybillparrish/workspace/errr/spec/unit/errr-spec.js:1309:10)
    at callFnAsync (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:338:8)
    at Test.Runnable.run (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:290:7)
    at Runner.runTest (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:422:10)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:533:12
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:342:14)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:352:7
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:284:14)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:315:7
    at done (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:276:5)
    at callFn (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:333:7)
    at Hook.Runnable.run (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:308:7)
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:298:10)
    at Immediate._onImmediate (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:320:5)
    at processImmediate [as _immediateCallback] (timers.js:383:17)

Debug Params: {
  "someParam": "c926b1d07df0749bc61b7cfc"
}

     ------------------------- FROM -------------------------

Error: [79f35d4d75e0653e6ff3b0f0] Some Error 3
    at ErrorBuilder._build_ (/Users/corybillparrish/workspace/errr/lib/error-builder.js:89:17)
    at ErrorBuilder.get (/Users/corybillparrish/workspace/errr/lib/error-builder.js:73:17)
    at Object.context.setupAppendErrors (/Users/corybillparrish/workspace/errr/spec/unit/errr-spec.js:1277:43)
    at Context.<anonymous> (/Users/corybillparrish/workspace/errr/spec/unit/errr-spec.js:1303:15)
    at callFnAsync (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:338:8)
    at Test.Runnable.run (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:290:7)
    at Runner.runTest (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:422:10)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:533:12
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:342:14)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:352:7
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:284:14)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:315:7
    at done (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:276:5)
    at callFn (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:333:7)
    at Hook.Runnable.run (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:308:7)
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:298:10)
    at Immediate._onImmediate (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:320:5)
    at processImmediate [as _immediateCallback] (timers.js:383:17)

     ------------------------- FROM -------------------------

Error: [880a280e670b68a4f2d0efc6] Some Error 2
    at ErrorBuilder._build_ (/Users/corybillparrish/workspace/errr/lib/error-builder.js:89:17)
    at ErrorBuilder.get (/Users/corybillparrish/workspace/errr/lib/error-builder.js:73:17)
    at Object.context.setupAppendErrors (/Users/corybillparrish/workspace/errr/spec/unit/errr-spec.js:1268:43)
    at Context.<anonymous> (/Users/corybillparrish/workspace/errr/spec/unit/errr-spec.js:1303:15)
    at callFnAsync (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:338:8)
    at Test.Runnable.run (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:290:7)
    at Runner.runTest (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:422:10)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:533:12
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:342:14)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:352:7
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:284:14)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:315:7
    at done (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:276:5)
    at callFn (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:333:7)
    at Hook.Runnable.run (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:308:7)
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:298:10)
    at Immediate._onImmediate (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:320:5)
    at processImmediate [as _immediateCallback] (timers.js:383:17)

Debug Params: {
  "someParam2": "7e8a3ef64acc245d87ce49f0"
}

     ------------------------- FROM -------------------------

Error: [cff70d396b7cac6ddf12c8c2] Some Error 1
    at ErrorBuilder._build_ (/Users/corybillparrish/workspace/errr/lib/error-builder.js:89:17)
    at ErrorBuilder.get (/Users/corybillparrish/workspace/errr/lib/error-builder.js:73:17)
    at Object.context.setupAppendErrors (/Users/corybillparrish/workspace/errr/spec/unit/errr-spec.js:1255:42)
    at Context.<anonymous> (/Users/corybillparrish/workspace/errr/spec/unit/errr-spec.js:1303:15)
    at callFnAsync (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:338:8)
    at Test.Runnable.run (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:290:7)
    at Runner.runTest (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:422:10)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:533:12
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:342:14)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:352:7
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:284:14)
    at /Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:315:7
    at done (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:276:5)
    at callFn (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:333:7)
    at Hook.Runnable.run (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runnable.js:308:7)
    at next (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:298:10)
    at Immediate._onImmediate (/Users/corybillparrish/workspace/errr/node_modules/mocha/lib/runner.js:320:5)
    at processImmediate [as _immediateCallback] (timers.js:383:17)
</pre>

## NPM Scripts
1. npm run test - Run linter and unit tests.
2. npm run ut - Use Maddox to Run Unit Tests.
3. npm run perf - Use Maddox to Performance metrics.
3. npm run uap - Use Maddox to Unit Tests and Performance metrics.
4. npm run lint - Run linter.
5. npm run docs - Rebuild public API Docs.

## API

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
    * [.setAll(object, force)](#Error+setAll) ⇒ <code>ErrorBuilder</code>
    * [.appendTo(err)](#Error+appendTo) ⇒ <code>ErrorBuilder</code>
    * [.get()](#Error+get) ⇒ <code>[Error](#Error)</code>
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

**Kind**: instance method of <code>[Error](#Error)</code>  
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

**Kind**: instance method of <code>[Error](#Error)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key that will be used to set the value on the error object. |
| value | <code>Object</code> | The value that will be set on the object. |
| [force] | <code>Boolean</code> | If force equals true, then this value will override a value with the same key from an errr passed in using the 'appendTo' function. |

<a name="Error+setAll"></a>
### error.setAll(object, force) ⇒ <code>ErrorBuilder</code>
Same concept and functionality as the 'set' function.  The difference is that you can set all values in a
given object onto the Errr instance.

Follows the same immutable paradigm as the 'set' function.  The difference is that you are setting the force override
for all value in the given object.

See set to understand functionality better.

**Kind**: instance method of <code>[Error](#Error)</code>  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Many key / value pairs to be set on the object. |
| force | <code>Boolean</code> | If force equals true, then this value will override a value with the same key from an errr passed in using the 'appendTo' function. |

<a name="Error+appendTo"></a>
### error.appendTo(err) ⇒ <code>ErrorBuilder</code>
Append the error being built, to the end of this error's stack trace.

**Kind**: instance method of <code>[Error](#Error)</code>  
**Returns**: <code>ErrorBuilder</code> - - Returns the instance of errorBuilder to allow chainability.  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>[Error](#Error)</code> | The stack trace of the error being built, will be appended to this error's stack trace. |

<a name="Error+get"></a>
### error.get() ⇒ <code>[Error](#Error)</code>
Returns a new Error object using the given parameters from the builder.

**Kind**: instance method of <code>[Error](#Error)</code>  
**Returns**: <code>[Error](#Error)</code> - - Returns a new Error object using the given parameters from the builder.  
<a name="Error+throw"></a>
### error.throw()
Throws a new Error object using the given parameters from the builder.

**Kind**: instance method of <code>[Error](#Error)</code>  
**Throws**:

- <code>[Error](#Error)</code> - Throws a new Error object using the given parameters from the builder.

<a name="Errr"></a>
## Errr
Static class that contains the 'newError' factory function.  Use the 'newError' factory function to return an ErrorBuilder instance.

**Kind**: global class  

* [Errr](#Errr)
    * [.newError([message], [template])](#Errr.newError) ⇒ <code>[FromMessage](#FromMessage)</code>
    * [.fromError(err)](#Errr.fromError) ⇒ <code>[FromError](#FromError)</code>

<a name="Errr.newError"></a>
### Errr.newError([message], [template]) ⇒ <code>[FromMessage](#FromMessage)</code>
Gets a new ErrorBuilder instance.

**Kind**: static method of <code>[Errr](#Errr)</code>  
**Returns**: <code>[FromMessage](#FromMessage)</code> - Gets an ErrorBuilder to get or throw an Error.  

| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |

<a name="Errr.fromError"></a>
### Errr.fromError(err) ⇒ <code>[FromError](#FromError)</code>
Gets a new FromError instance.

**Kind**: static method of <code>[Errr](#Errr)</code>  
**Returns**: <code>[FromError](#FromError)</code> - Gets an ErrorBuilder to get or throw an Error.  

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
