import mongoose from 'mongoose';

// Listing Schema
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  features: [String],
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  listingSnapshot: { type: Object, required: true }, // Save listing details at time of order
  buyer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true }
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'delivered', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  paymentProvider: { type: String, default: 'nowpayments' },
  paymentDetails: {
    invoiceId: String,
    paymentAddress: String,
    paymentCurrency: String,
    paymentAmount: Number,
    txId: String,
    confirmations: Number
  },
  deliveryNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Admin User Schema (simple)
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Export models
export const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);