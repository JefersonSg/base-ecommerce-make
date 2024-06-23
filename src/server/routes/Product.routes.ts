/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import multer from 'multer';

import { ProductController } from '../controllers';

// middleware
import checkToken from '../shared/helpers/checkToken';
import checkAdminToken from '../shared/helpers/checkAdminToken';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GETS
router.get('/', ProductController.getAll);
router.get('/actives/:page/:total', ProductController.getAllActives);
router.get('/no-actives', ProductController.getAllNoActives);
router.get('/:id', ProductController.getProductById);
router.get(
  '/category/:id/:page/:total',
  ProductController.getProductByCategory
);
router.get('/name/:name/:page/:total', ProductController.getByName);
router.get('/subcategory/:id/:page/:total', ProductController.getBySubcategory);
router.get('/sales/:page/:total', ProductController.getBySales);
router.get('/get-by-views/:page/:total', ProductController.getByViews);
router.get('/promotion/:page/:total', ProductController.getByPromotion);

// comments
router.get('/comments/get-all/:productId', ProductController.getAllComments);

// POST
router.post(
  '/create',
  checkAdminToken,
  upload.fields([
    { name: 'images' },
    { name: 'coverPhoto1', maxCount: 1 },
    { name: 'coverPhoto2', maxCount: 1 }
  ]),
  ProductController.validationProduct,
  ProductController.create
);

// comments
router.post(
  '/create/comment',
  checkToken,
  upload.single('image'),
  ProductController.createComment
);

// UPDATE
router.patch(
  '/edit/:id',
  checkAdminToken,
  upload.fields([
    { name: 'images' },
    { name: 'coverPhoto1', maxCount: 1 },
    { name: 'coverPhoto2', maxCount: 1 }
  ]),
  ProductController.validationProduct,
  ProductController.updateProduct
);
// comments
router.patch(
  '/update/comment',
  checkToken,
  upload.single('image'),
  ProductController.updateCommentById
);
// router.patch(
//   "/reupdate/allProducts",
//   checkToken,
//   ProductController.updateAllProduct,
// );

// DELETE
router.delete(
  '/delete/:id',
  checkAdminToken,
  ProductController.removeProductById
);

// comment
router.delete(
  '/delete/comment/:id',
  checkToken,
  ProductController.removeCommentById
);

export default router;
