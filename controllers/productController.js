const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const Firm = require("../models/Firm");
const path = require("path");

// -------------------- ADD PRODUCT CONTROLLER --------------------
const addProduct = async (req, res) => {
  try {
    console.log("💡 PRODUCT ADD CONTROLLER HIT");
    console.log("Firm ID from req.params:", req.params.firmId);
    console.log("Form Data:", req.body);
    console.log("Uploaded file:", req.file);

    const {
      productName,
      price,
      category,
      bestseller,
      description
    } = req.body;

    const image = req.file ? req.file.filename : undefined;
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller: bestseller === 'true', // ensure boolean
      description,
      image,
      firm: firmId
    });

    const savedProduct = await product.save();
    console.log("✅ PRODUCT SAVED:", savedProduct);

    firm.products.push(savedProduct._id);
    await firm.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("❌ ADD PRODUCT ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- GET PRODUCTS BY FIRM --------------------
const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const restaurantName = firm.firmName;
    const products = await Product.find({ firm: firmId });

    res.status(200).json({ restaurantName, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

// -------------------- DELETE PRODUCT --------------------
const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "No product found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

// -------------------- EXPORT MODULE --------------------
module.exports = {
  addProduct,
  getProductByFirm,
  deleteProductById
};