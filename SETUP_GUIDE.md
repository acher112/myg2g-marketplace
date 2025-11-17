# 🚀 Quick Setup Guide for AccVault Marketplace

## Step-by-Step Installation (For Beginners)

### 1️⃣ Install Required Software

#### Install Node.js
1. Go to https://nodejs.org
2. Download LTS version (18.x or higher)
3. Install with default settings
4. Verify: Open terminal and type `node --version`

#### Install MongoDB
**Option A: Local MongoDB (Easier for development)**
1. Go to https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Install with default settings
4. MongoDB will run automatically

**Option B: MongoDB Atlas (Free cloud database)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Get connection string (looks like: `mongodb+srv://...`)

### 2️⃣ Download the Project Files

Create a folder structure like this:

```
accvault-marketplace/
├── components/
│   ├── Header.js
│   └── Footer.js
├── lib/
│   ├── categories.js
│   ├── models.js
│   └── mongodb.js
├── pages/
│   ├── _app.js
│   ├── index.js
│   ├── admin/
│   │   └── index.js
│   ├── category/
│   │   └── [id].js
│   ├── checkout/
│   │   └── [id].js
│   └── api/
│       ├── listings/
│       │   ├── index.js
│       │   └── [id].js
│       ├── orders/
│       │   └── index.js
│       │   └── [id]/
│       │       └── status.js
│       └── payment/
│           ├── create-invoice.js
│           └── webhook.js
├── styles/
│   └── globals.css
├── .env
├── .env.example
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

Copy all the code I provided into respective files.

### 3️⃣ Install Dependencies

Open terminal in project folder and run:

```bash
npm install
```

This will install all required packages.

### 4️⃣ Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Edit `.env` file with your details:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/accvault

# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accvault

# Leave these for now (will configure later)
NOWPAYMENTS_API_KEY=
NOWPAYMENTS_IPN_SECRET=

# Change these
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_PASSWORD=mySecurePassword123
NEXT_PUBLIC_ADMIN_PASSWORD=mySecurePassword123
```

### 5️⃣ Run the Application

```bash
npm run dev
```

Open browser: http://localhost:3000

🎉 **Your marketplace is now running!**

---

## 🔧 NOWPayments Configuration (For Crypto Payments)

### Step 1: Create NOWPayments Account

1. Go to https://nowpayments.io
2. Click "Sign Up"
3. Complete registration
4. Verify email

### Step 2: Get API Credentials

1. Login to NOWPayments dashboard
2. Go to **Settings → API Keys**
3. Copy your API Key
4. Add to `.env`:
   ```
   NOWPAYMENTS_API_KEY=your_api_key_here
   ```

### Step 3: Setup Webhooks (IPN)

1. In NOWPayments dashboard, go to **Settings → IPN**
2. Enable IPN
3. Copy your IPN Secret
4. Add to `.env`:
   ```
   NOWPAYMENTS_IPN_SECRET=your_secret_here
   ```

### Step 4: Configure Webhook URL (For Production)

When you deploy to production:
1. Set IPN Callback URL to: `https://yourdomain.com/api/payment/webhook`

**For local testing with NOWPayments:**
- Use ngrok: https://ngrok.com
- Run: `ngrok http 3000`
- Use ngrok URL as webhook URL

---

## 📱 Testing the Application

### Test as Customer

1. Go to http://localhost:3000
2. Click any game category
3. Click "Buy Now" on a listing
4. Fill contact details
5. Click "Proceed to Crypto Payment"

**Note:** Without NOWPayments configured, you'll see a demo message.

### Test Admin Dashboard

1. Go to http://localhost:3000/admin
2. Enter password: `mySecurePassword123` (or what you set in `.env`)
3. Add new listings
4. View orders

---

## 🌐 Deploy to Production (Free Options)

### Option 1: Vercel (Recommended - Easiest)

1. Push code to GitHub
2. Go to https://vercel.com
3. Sign up with GitHub
4. Click "New Project"
5. Import your repository
6. Add environment variables (all from `.env`)
7. Click "Deploy"

**Your site will be live at:** `your-project.vercel.app`

### Option 2: Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repo
5. Add environment variables
6. Deploy

### Option 3: Render

1. Go to https://render.com
2. Sign up
3. Create "Web Service"
4. Connect GitHub repo
5. Add environment variables
6. Deploy

---

## 💰 Setting Up Payment Flow (Real World)

### For Pakistani Sellers:

1. **Receive Crypto Payments**
   - Customer pays with BTC/USDT/ETH via NOWPayments
   - Payment confirmed automatically via webhook

2. **Convert to PKR**
   
   **Method A: Binance P2P (Recommended)**
   - Create Binance account
   - When order paid, you receive USDT in NOWPayments
   - Withdraw USDT to Binance
   - Sell USDT for PKR via Binance P2P
   - Get money in Pakistani bank (EasyPaisa, JazzCash, Bank Transfer)

   **Method B: Local Exchanges**
   - Use Pakistani-friendly exchanges
   - Examples: Bybit P2P, OKX P2P

3. **Deliver Account**
   - Check order in admin dashboard
   - See order status = "paid"
   - Send account credentials to customer email/WhatsApp
   - Mark order as "delivered"

---

## 🛡️ Security Checklist

Before going live:

- [ ] Change admin password from default
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB authentication
- [ ] Add rate limiting to APIs
- [ ] Use HTTPS (automatic with Vercel/Railway)
- [ ] Don't commit `.env` to GitHub
- [ ] Enable 2FA on hosting platform
- [ ] Backup database regularly

---

## 📝 Daily Operations

### Adding New Accounts for Sale

1. Login to admin dashboard
2. Select category
3. Enter account details:
   - Title: "Steam Account - 50 Games + CS:GO Skins"
   - Description: Brief description
   - Features: One per line (e.g., "100+ hours played", "Level 40", etc.)
   - Price: In USD
4. Click "Add Listing"

### Processing Orders

1. Check admin dashboard → Orders tab
2. When status = "paid":
   - Copy customer email/WhatsApp
   - Send account credentials
   - Update status to "delivered"
3. After customer confirms:
   - Update status to "completed"

### Handling Issues

**Customer didn't pay:**
- Order stays "pending"
- Auto-expires after 1 hour (NOWPayments default)

**Customer paid but account not working:**
- Contact customer via email/WhatsApp
- Offer replacement or refund
- Mark order as "disputed" in admin

---

## 🆘 Common Issues & Solutions

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** 
- Make sure MongoDB is running
- For Windows: Check Services → MongoDB is started
- For Mac: Run `brew services start mongodb-community`

### Port 3000 Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### NOWPayments Webhook Not Receiving

**Solution:**
1. Check webhook URL is publicly accessible
2. For local testing, use ngrok
3. Verify IPN secret in `.env`
4. Check NOWPayments dashboard for webhook logs

---

## 📞 Need Help?

- NOWPayments Support: https://nowpayments.io/help
- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com

---

## 🎓 Recommended Domain Names

For your marketplace, consider:

- **accvault.com** (if available)
- **gamevault.store**
- **accmarket.io**
- **playaccounts.com**
- **procounts.com**

Check availability: https://namecheap.com

---

**Good luck with your marketplace! 🚀**

If you need any modifications or have questions, feel free to ask!