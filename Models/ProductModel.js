const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: { 
    type: String,
    required: false,
    trim: true
  },

  price: {
    type: Number,
    required: false,
    min: 0
  },

  category: {
    type: String,
       required: false,
    trim: true
  },

  stock: {
    type: Number,
        required: false,
    min: 0
  },

  sku: {
    type: String,
        required: false,
    trim: true
  },

  productAddDate: {   
    type: Date,
    default: Date.now   
  },

  uploadedImages: [
    {
      type: String,
      trim: true
    }
  ]
});

module.exports = mongoose.model('Products', productSchema);