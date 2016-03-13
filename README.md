# Errr
Error factory with the ability to append stack traces from previous errors and append debug params.  Great for great full stack traces from all layers of code, especially when using promise chains.

## API

<a name="Errr"></a>
## Errr
Error Factory for the Error Builder.

**Kind**: global class  
<a name="Errr.newError"></a>
### Errr.newError([message], [template]) ⇒ <code>ErrorBuilder</code>
Gets a new ErrorBuilder instance.

**Kind**: static method of <code>[Errr](#Errr)</code>  
**Returns**: <code>ErrorBuilder</code> - Gets an ErrorBuilder to get or throw an Error.  

| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |

## ErrorBuilder
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

