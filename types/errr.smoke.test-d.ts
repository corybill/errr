/**
 * Compile-only checks that the published types resolve for consumers.
 * Run: npx tsc --noEmit
 */
import Errr, {
  type Errrorrr,
  type ErrrorrrBuilder,
  formatDebugParams,
  inspectDebugParams,
  defaultDebugInspectOptions,
  DebugPrefix
} from "errr";

const builder: ErrrorrrBuilder = Errr.newError("hello");
builder.set("reason", "not found").debug({userId: "1"});

const err: Errrorrr = builder.get();
err.message;
err.get("reason");

Errr.newError("tpl %s", ["id"]);
Errr.fromError(new Error("x"));

// Under `useUnknownInCatchVariables` (enabled by `strict`) the caught error is `unknown`.
// `appendTo` must accept it directly — no `toError` shim required at the call site.
try {
  Errr.newError("inner").throw();
} catch (caught) {
  Errr.newError("wrapper").appendTo(caught).get();
}

Errr.newError("nullish").appendTo(null);
Errr.newError("nullish").appendTo(undefined);
Errr.newError("string").appendTo("a thrown string");
Errr.newError("object").appendTo({code: "EBAD"});
Errr.newError("number").appendTo(42);

formatDebugParams({ actual: true, expected: false });
inspectDebugParams({ userId: "1" });
Errr.formatDebugParams({ key: "value" }, { depth: 2 });
DebugPrefix;
defaultDebugInspectOptions.depth;
