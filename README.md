# AccVault - Game Accounts Marketplace

A modern, crypto-powered marketplace for buying and selling game accounts. Built with Next.js, MongoDB, and NOWPayments integration.

## 🚀 Features

- ✅ 10 Game Categories (Discord, Reddit, Steam, Fortnite, Valorant, PUBG, GTA V, Apex, COD, Epic)
- 💰 Crypto Payment Integration (Bitcoin, USDT, Ethereum, 100+ coins via NOWPayments)
- 🔐 Admin Dashboard for managing listings and orders
- 📧 Manual delivery via Email/WhatsApp
- 🌍 Global accessibility from Pakistan
- 📱 Fully responsive design

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- NOWPayments account (for crypto payments)

## 🛠️ Installation

### 1. Clone or create project

```bash
mkdir accvault-marketplace
cd accvault-marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/accvault
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accvault

# NOWPayments API (Get from https://nowpayments.io)
NOWPAYMENTS_API_KEY=your_api_key_here
NOWPAYMENTS_IPN_SECRET=your_webhook_secret_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Password (Change this!)
ADMIN_PASSWORD=your_secure_password_here
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 NOWPayments Setup

### 1. Create NOWPayments Account

1. Go to [NOWPayments.io](https://nowpayments.io)
2. Sign up and complete KYC verification
3. Get your API key from Dashboard → Settings → API

### 2. Configure Webhooks

1. In NOWPayments dashboard, go to Settings → IPN
2. Set IPN Callback URL: `https://yourdomain.com/api/payment/webhook`
3. Copy your IPN Secret and add to `.env`

### 3. Test Payments

NOWPayments provides a sandbox mode for testing. Enable it in your dashboard.

## 📁 Project Structure

```
accvault-marketplace/
├── components/
│   ├── Header.js          # Navigation header
│   └── Footer.js          # Footer component
├── lib/
│   ├── categories.js      # Game categories data
│   ├── models.js          # MongoDB schemas
│   └── mongodb.js         # Database connection
├── pages/
│   ├── index.js           # Homepage
│   ├── category/[id].js   # Category listings
│   ├── checkout/[id].js   # Checkout page
│   ├── admin/index.js     # Admin dashboard
│   └── api/
│       ├── listings/      # Listings API
│       ├── orders/        # Orders API
│       └── payment/       # Payment API
├── .env                   # Environment variables
├── package.json
└── README.md
```

## 👨‍💼 Admin Dashboard

### Access Admin Panel

1. Go to `/admin`
2. Enter password (default: `admin123`)
3. Manage listings and orders

### Add New Listing

1. Select category
2. Enter title, description, price
3. Add features (one per line)
4. Click "Add Listing"

### Manage Orders

1. View all customer orders
2. Update order status (pending → paid → delivered → completed)
3. Contact customers via email/WhatsApp shown in order details

## 🔐 Security Best Practices

1. **Change default admin password** in `.env`
2. **Never commit `.env`** file to git
3. **Use strong passwords** for MongoDB
4. **Enable HTTPS** in production
5. **Implement rate limiting** for APIs
6. **Add CAPTCHA** on checkout to prevent spam

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Railway/Render

1. Create account on [Railway](https://railway.app) or [Render](https://render.com)
2. Connect GitHub repo
3. Add environment variables
4. Deploy

### MongoDB Atlas Setup

1. Create free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

## 💳 Converting Crypto to Fiat (PKR)

### Option 1: Binance P2P

1. Create Binance account
2. Receive USDT payments
3. Sell USDT for PKR via P2P
4. Withdraw to Pakistani bank

### Option 2: NOWPayments Auto-Convert

1. Enable auto-convert in NOWPayments dashboard
2. Payments auto-convert to stablecoin
3. Withdraw to exchange

### Option 3: Local Crypto Exchanges

- Use Pakistani crypto exchanges
- Examples: MEXC, Bybit (with P2P)

## 📧 Email Integration (Optional)

To send automated emails on order completion:

```bash
npm install nodemailer
```

Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

Create `lib/email.js` and integrate with order webhook.

## 📱 WhatsApp Integration (Optional)

Use WhatsApp Business API or services like:
- Twilio
- WhatsApp Business Platform
- MessageBird

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check MongoDB is running: `mongod`
- Verify connection string in `.env`
- For Atlas, check IP whitelist

### NOWPayments Webhook Not Working
- Ensure webhook URL is publicly accessible (use ngrok for local testing)
- Check IPN secret matches
- View webhook logs in NOWPayments dashboard

### Admin Login Not Working
- Check password in `.env` matches
- Clear browser localStorage: `localStorage.clear()`

## 📞 Support

For issues or questions:
- Check NOWPayments docs: https://nowpayments.io/doc
- MongoDB docs: https://docs.mongodb.com
- Next.js docs: https://nextjs.org/docs

## 📝 License

MIT License - feel free to use for commercial projects!

## 🎯 Roadmap

- [ ] Email notifications on order status
- [ ] WhatsApp bot integration
- [ ] Seller reputation system
- [ ] Automatic account delivery
- [ ] Multiple admin users
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

Built with ❤️ for Pakistani crypto entrepreneurs