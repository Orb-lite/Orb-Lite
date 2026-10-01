import { t as __commonJSMin } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";

const React = typeof require_react === "function" ? require_react() : null;

var require_react_jsx_dev_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.Fragment = Symbol.for("react.fragment");
	exports.jsxDEV = (type, props, key) => {
		if (React && typeof React.createElement === "function") {
			return React.createElement(type, key !== void 0 ? { ...props, key } : props);
		}
		return { type, props, key };
	};
}));
var require_jsx_dev_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_dev_runtime_production();
}));
export { require_jsx_dev_runtime as t };
