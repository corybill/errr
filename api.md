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

