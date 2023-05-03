import express, { urlencoded } from "express";
import { config } from "dotenv";
config();
const server = express();
const port = process.env.PORT || 3000;

// Server middlewares
server.use(urlencoded({ extended: false }));
server.use(express.json());

// Session
import session from "express-session";
import "./types/session";
server.use(
	session({
		secret: String(process.env.SESSION_SECRET),
		resave: false,
		saveUninitialized: true,
	})
);

// Routes
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import docRoutes from "./routes/documentRoutes";
server.use("/user", userRoutes);
server.use("/project", projectRoutes);
server.use("/doc", docRoutes);

server.listen(port, () => {
	console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
