import express, { urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
config();

// Iniciando variáveis de servidor
const server = express();
const port = process.env.PORT || 3000;

// Server middlewares
server.use(urlencoded({ extended: false }));
server.use(express.json());
server.use(cors());

// Session
import session from "express-session";
import "./types/Session.type";
server.use(
	session({
		secret: String(process.env.SESSION_SECRET),
		resave: false,
		saveUninitialized: true,
	})
);

// Routes
import userRoutes from "./routes/User.routes";
import projectRoutes from "./routes/Project.routes";
import docRoutes from "./routes/Document.routes";
server.use("/user", userRoutes);
server.use("/project", projectRoutes);
server.use("/doc", docRoutes);

server.listen(port, () => {
	console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
