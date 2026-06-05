"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const NotificationPage_1 = require("./components/NotificationPage");
require("./App.css");
const App = () => {
    return (<div className="app">
      <NotificationPage_1.NotificationPage />
    </div>);
};
exports.default = App;
//# sourceMappingURL=App.js.map