/**
 * Compile-only checks that the published types resolve for consumers.
 * Run: npx tsc --noEmit
 */
import Errr, {type ErrrBuiltError, type ErrorBuilder} from "errr";

const builder: ErrorBuilder = Errr.newError("hello");
builder.set("reason", "not found").debug({userId: "1"});

const err: ErrrBuiltError = builder.get();
err.message;
err.get("reason");

Errr.newError("tpl %s", ["id"]);
Errr.fromError(new Error("x"));
