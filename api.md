<a name="Errr"></a>
## Errr
Provides an interface to build an error.  Then allows you to get or throw the error.

**Kind**: global class  

* [Errr](#Errr)
    * [new Errr([message], [template])](#new_Errr_new)
    * [.newError([message], [template])](#Errr.newError) ⇒ <code>ErrorBuilder</code>

<a name="new_Errr_new"></a>
### new Errr([message], [template])

| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |

<a name="Errr.newError"></a>
### Errr.newError([message], [template]) ⇒ <code>ErrorBuilder</code>
Gets a new ErrorBuilder instance.

**Kind**: static method of <code>[Errr](#Errr)</code>  
**Returns**: <code>ErrorBuilder</code> - Gets an ErrorBuilder to get or throw an Error.  

| Param | Type | Description |
| --- | --- | --- |
| [message] | <code>String</code> | Error message that will supplied to Error Object. |
| [template] | <code>Array</code> | Array of parameters.  If given, util.format(message, template) will be applied to the message string. |

