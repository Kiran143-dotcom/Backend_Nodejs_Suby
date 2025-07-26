const express = require('express');
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ✅ FIXED ROUTE with multer middleware
router.post('/add-product/:firmId', upload.single('image'), productController.addProduct);

router.get('/:firmId/products', productController.getProductByFirm);

router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.set('Content-Type', 'image/jpeg');
  res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:productId', productController.deleteProductById);

module.exports = router;