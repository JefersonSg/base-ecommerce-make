import express from 'express';
import cors from 'cors';

import path from 'path';
import 'dotenv/config';

import UserRoutes from './server/routes/User.routes';
import ProductRoutes from './server/routes/Product.routes';
import CategoryRoutes from './server/routes/Category.routes';
import SubcategoryRoutes from './server/routes/Subcategory.routes';
import BannersRoutes from './server/routes/Banners.routes';
import FavoritesRoutes from './server/routes/Favorites.routes';
import ShoppingRoutes from './server/routes/Shopping.routes';
import OrderRoutes from './server/routes/Order.routes';
import DeliveryRoutes from './server/routes/Delivery.routes';
import PaymentRoutes from './server/routes/Payment.routes';
import cuponsRoutes from './server/routes/Cupons.routes';
import viewsRoutes from './server/routes/Views.routes';

const app = express();
const port = process.env.PORT ?? 5000;

// config JSON response
app.use(express.json());

// Configuração do CORS
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://lojamayse.com'];

  const origin = req.headers.origin ?? '';

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.set('trust proxy', true);
app.use(cors());

// Public folder images
app.use(express.static('public'));
app.use('/files', express.static(path.resolve(__dirname, 'public', 'images')));

// Routes
app.use('/user', UserRoutes);
app.use('/products', ProductRoutes);
app.use('/categories', CategoryRoutes);
app.use('/subcategories', SubcategoryRoutes);
app.use('/banners', BannersRoutes);
app.use('/favorites', FavoritesRoutes);
app.use('/shopping', ShoppingRoutes);
app.use('/order', OrderRoutes);
app.use('/delivery', DeliveryRoutes);
app.use('/payment', PaymentRoutes);
app.use('/cupons', cuponsRoutes);
app.use('/views', viewsRoutes);

// Routes
app.listen(port);
