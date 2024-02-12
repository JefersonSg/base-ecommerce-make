import express from "express";
import cors from "cors";
import UserRoutes from "./server/routes/UserRoutes";
import ProductRoutes from "./server/routes/ProductRoutes";
import CategoryRoutes from "./server/routes/CategoryRoutes";
import SubcategoryRoutes from "./server/routes/SubcategoryRoutes";
import path from "path";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 5000;

// config JSON response
app.use(express.json());

// Configuração do CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://base-ecommerce-git-formularios-jefersonsg.vercel.app',
    'https://basecommerce.vercel.app'
  ];

  const origin = req.headers.origin ?? '';

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors());

// Public folder images
app.use(express.static("public"));
app.use("/files", express.static(path.resolve(__dirname, "public", "images")));

// Routes
app.use("/user", UserRoutes);
app.use("/products", ProductRoutes);
app.use("/categories", CategoryRoutes);
app.use("/subcategories", SubcategoryRoutes);

// Routes
app.listen(port);
