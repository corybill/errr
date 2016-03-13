# Errr
Error factory with the ability to append stack traces from previous errors and append debug params.  Great for great full stack traces from all layers of code, especially when using promise chains.

## Best Practices
1. Each layer of your code should catch an error, and append that error to the incoming error.
2. Add debug params to each error build to assist debugging later.
3. Do NOT add large objects to debug params.  It only makes reading the logs more difficult.
4. Throw all errors to the top layer of code and only log the error in that layer of code.  Doing this ensures you have one log statement with the entire stack trace which will make debugging much easier.

## Install
<pre>npm install errr</pre>

## Example
<pre>
// debug and appendTo are optional
// Throws an error
Errr.newError(message, template).debug(this.debugParams).appendTo(this.appendError3).throw();
</pre>
<pre>
// Returns an error.
Errr.newError(message, template).debug(this.debugParams).appendTo(this.appendError3).get();
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
<dt><a href="#ErrorBuilder">ErrorBuilder</a></dt>
<dd><p>Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.</p>
</dd>
<dt><a href="#Errr">Errr</a></dt>
<dd><p>Static class that contains the &#39;newError&#39; factory function.  Use the &#39;newError&#39; factory function to return an ErrorBuilder instance.</p>
</dd>
</dl>

<a name="ErrorBuilder"></a>
## ErrorBuilder
Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.

**Kind**: global class  

* [ErrorBuilder](#ErrorBuilder)
    * [new ErrorBuilder([message], [template])](#new_ErrorBuilder_new)
    * [.debug(params, [shouldDebug])](#ErrorBuilder+debug) ⇒ <code>[ErrorBuilder](#ErrorBuilder)</code>
    * [.appendTo(err)](#ErrorBuilder+appendTo) ⇒ <code>[ErrorBuilder](#ErrorBuilder)</code>
    * [.get()](#ErrorBuilder+get) ⇒ <code>Error</code>
    * [.throw()](#ErrorBuilder+throw)

<a name="new_ErrorBuilder_new"></a>
### new ErrorBuilder([message], [template])
Provides an interface to build an error.  Then allows you to get or throw the error.


| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |

<a name="ErrorBuilder+debug"></a>
### errorBuilder.debug(params, [shouldDebug]) ⇒ <code>[ErrorBuilder](#ErrorBuilder)</code>
Add parameters to the stack trace that will make it easier to debug the problem.

**Kind**: instance method of <code>[ErrorBuilder](#ErrorBuilder)</code>  
**Returns**: <code>[ErrorBuilder](#ErrorBuilder)</code> - - Returns the instance of errorBuilder to allow chainability.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Object Map of key value parameters that will make it easier to debug the error. |
| [shouldDebug] | <code>Boolean</code> | If shouldDebug === false, then debug params will not print.  Any other value (including undefined), and the debug params will be printed. Useful if you want to only print debugParams given an Environment Variable. |

<a name="ErrorBuilder+appendTo"></a>
### errorBuilder.appendTo(err) ⇒ <code>[ErrorBuilder](#ErrorBuilder)</code>
Append the error being built, to the end of this error's stack trace.

**Kind**: instance method of <code>[ErrorBuilder](#ErrorBuilder)</code>  
**Returns**: <code>[ErrorBuilder](#ErrorBuilder)</code> - - Returns the instance of errorBuilder to allow chainability.  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The stack trace of the error being built, will be appended to this error's stack trace. |

<a name="ErrorBuilder+get"></a>
### errorBuilder.get() ⇒ <code>Error</code>
Returns a new Error object using the given parameters from the builder.

**Kind**: instance method of <code>[ErrorBuilder](#ErrorBuilder)</code>  
**Returns**: <code>Error</code> - - Returns a new Error object using the given parameters from the builder.  
<a name="ErrorBuilder+throw"></a>
### errorBuilder.throw()
Throws a new Error object using the given parameters from the builder.

**Kind**: instance method of <code>[ErrorBuilder](#ErrorBuilder)</code>  
**Throws**:

- <code>Error</code> - Throws a new Error object using the given parameters from the builder.

<a name="Errr"></a>
## Errr
Static class that contains the 'newError' factory function.  Use the 'newError' factory function to return an ErrorBuilder instance.

**Kind**: global class  
<a name="Errr.newError"></a>
### Errr.newError([message], [template]) ⇒ <code>[ErrorBuilder](#ErrorBuilder)</code>
Gets a new ErrorBuilder instance.

**Kind**: static method of <code>[Errr](#Errr)</code>  
**Returns**: <code>[ErrorBuilder](#ErrorBuilder)</code> - Gets an ErrorBuilder to get or throw an Error.  

| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |
