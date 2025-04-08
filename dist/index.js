"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const UsernameRoute_1 = __importDefault(require("./routes/UsernameRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true
}));
(0, db_1.connectDB)();
app.use("/api/v1", userRoutes_1.default);
app.use("/api/v1", eventRoutes_1.default);
app.use("/api/v1", teamRoutes_1.default);
app.use("/api/v1", UsernameRoute_1.default);
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
