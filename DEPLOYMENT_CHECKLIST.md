# 🚀 Production Deployment Checklist

## Pre-Deployment

### Code & Configuration
- [ ] All files created and properly organized
- [ ] `.env` file configured (NOT committed to git)
- [ ] `.gitignore` includes `.env`, `node_modules`, `.next`
- [ ] Admin password changed from default
- [ ] Test application locally (`npm run dev`)

### Database
- [ ] MongoDB Atlas cluster created (or local MongoDB ready)
- [ ] Database connection string tested
- [ ] IP whitelist configured (0.0.0.0/0 for Atlas if needed)

### NOWPayments
- [ ] NOWPayments account created and verified
- [ ] API key obtained
- [ ] IPN secret obtained
- [ ] Understand withdrawal process

---

## Deployment Steps

### 1. Choose Hosting Platform

**Recommended: Vercel (Free tier, easiest)**

#### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/accvault.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Configure:
     - Framework: Next.js (auto-detected)
     - Build Command: `next build`
     - Output Directory: `.next`

3. **Add Environment Variables in Vercel**
   
   Go to Project → Settings → Environment Variables
   
   Add all variables from your `.env`:
   ```
   MONGODB_URI=mongodb+srv://...
   NOWPAYMENTS_API_KEY=...
   NOWPAYMENTS_IPN_SECRET=...
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ADMIN_PASSWORD=...
   NEXT_PUBLIC_ADMIN_PASSWORD=...
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

---

### 2. Configure NOWPayments Webhook

1. Go to NOWPayments dashboard
2. Settings → IPN
3. Set IPN Callback URL: `https://your-project.vercel.app/api/payment/webhook`
4. Save

---

### 3. Custom Domain (Optional)

#### Buy Domain
- Namecheap: https://namecheap.com
- GoDaddy: https://godaddy.com
- Recommended: `accvault.com`, `gamevault.io`, etc.

#### Configure Domain in Vercel
1. Go to Vercel project → Settings → Domains
2. Add your domain
3. Update DNS settings at your registrar:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-60 minutes)

---

## Post-Deployment

### Testing Checklist

- [ ] Homepage loads correctly
- [ ] All 10 categories visible
- [ ] Category pages load
- [ ] Admin login works
- [ ] Can add new listings in admin
- [ ] Checkout page loads
- [ ] Payment creation works (test with small amount)
- [ ] Webhook receives payment confirmations
- [ ] Orders appear in admin dashboard

### Create Test Order

1. Add a test listing ($1 or $2)
2. Go through checkout as customer
3. Pay with crypto (use small amount)
4. Verify order appears in admin
5. Check webhook status in NOWPayments dashboard

---

## Security Hardening

### Immediate Actions

- [ ] Change all default passwords
- [ ] Enable 2FA on:
  - [ ] Vercel account
  - [ ] GitHub account
  - [ ] MongoDB Atlas account
  - [ ] NOWPayments account
- [ ] Review Vercel security settings
- [ ] Set up MongoDB backup schedule

### API Security (Future Enhancement)

Consider adding:
- Rate limiting (express-rate-limit)
- CAPTCHA on checkout (hCaptcha/reCAPTCHA)
- JWT authentication for admin
- Request validation middleware

---

## Monitoring & Maintenance

### Setup Monitoring

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Track page views and performance

2. **NOWPayments Dashboard**
   - Check daily for failed payments
   - Monitor webhook success rate

3. **MongoDB Atlas Monitoring**
   - Set up alerts for:
     - High connection count
     - Storage usage
     - CPU usage

### Regular Tasks

**Daily:**
- [ ] Check orders in admin dashboard
- [ ] Process paid orders (send credentials)
- [ ] Respond to customer inquiries

**Weekly:**
- [ ] Review NOWPayments transaction logs
- [ ] Check for failed webhooks
- [ ] Update listings (add/remove accounts)

**Monthly:**
- [ ] Backup database
- [ ] Review security logs
- [ ] Update dependencies (`npm update`)

---

## Marketing & Launch

### Pre-Launch

- [ ] Add at least 5-10 listings across categories
- [ ] Test complete purchase flow
- [ ] Prepare social media accounts
- [ ] Create support email/WhatsApp

### Launch Channels

**Social Media:**
- [ ] Create Instagram account
- [ ] Create Twitter/X account
- [ ] Create Facebook page
- [ ] Create TikTok (for gaming content)

**Gaming Communities:**
- [ ] Reddit gaming subreddits
- [ ] Discord gaming servers
- [ ] Facebook gaming groups
- [ ] Gaming forums

**Paid Advertising:**
- [ ] Google Ads (gaming keywords)
- [ ] Facebook/Instagram Ads
- [ ] Reddit Ads (gaming subreddits)

### SEO Basics

Add to each page:
- Proper meta titles
- Meta descriptions
- Open Graph tags (for social sharing)
- Sitemap.xml

---

## Financial Setup

### Crypto to Fiat Conversion (Pakistan)

1. **Setup Binance Account**
   - Complete KYC verification
   - Enable P2P trading
   - Add Pakistani bank account

2. **Withdrawal Process**
   - NOWPayments → Receive USDT
   - Withdraw USDT to Binance
   - Sell USDT on Binance P2P for PKR
   - Transfer PKR to bank (EasyPaisa/JazzCash/Bank)

3. **Alternative Exchanges**
   - Bybit P2P
   - OKX P2P
   - Local crypto traders

### Keep Records

- [ ] Track all transactions
- [ ] Save payment receipts
- [ ] Record conversions and fees
- [ ] Consult accountant for tax implications

---

## Scaling Up

### When You Grow

**Add Features:**
- [ ] Automated delivery system
- [ ] Email notifications (Nodemailer/SendGrid)
- [ ] WhatsApp bot integration
- [ ] Multiple admin users
- [ ] Seller registration (marketplace model)
- [ ] Escrow system for disputes
- [ ] Reputation/rating system

**Infrastructure:**
- [ ] Upgrade MongoDB plan if needed
- [ ] Add CDN (Vercel includes this)
- [ ] Consider dedicated database
- [ ] Add Redis for caching

**Team:**
- [ ] Customer support
- [ ] Account verification team
- [ ] Marketing person
- [ ] Developer for maintenance

---

## Emergency Procedures

### Website Down

1. Check Vercel status page
2. Check MongoDB Atlas connection
3. Review recent deployments
4. Rollback if needed (Vercel dashboard)

### Payment Issues

1. Check NOWPayments status
2. Review webhook logs
3. Contact NOWPayments support
4. Manually verify payment on blockchain if needed

### Database Issues

1. Check MongoDB Atlas status
2. Review connection logs
3. Check IP whitelist
4. Restore from backup if needed

---

## Legal Considerations

### Terms & Policies (Recommended)

Create pages for:
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Refund Policy
- [ ] Acceptable Use Policy

### Compliance

- [ ] Understand digital goods regulations in Pakistan
- [ ] Consider crypto regulations
- [ ] Add disclaimers about account ownership
- [ ] Consult lawyer if operating at scale

---

## Support Resources

### Documentation
- Next.js: https://nextjs.org/docs
- MongoDB: https://docs.mongodb.com
- NOWPayments: https://nowpayments.io/doc
- Vercel: https://vercel.com/docs

### Communities
- Next.js Discord: https://discord.gg/nextjs
- MongoDB Community: https://community.mongodb.com
- Web Dev Reddit: r/webdev, r/nextjs

---

## Success Metrics

Track these KPIs:

**Traffic:**
- Daily visitors
- Page views per session
- Bounce rate

**Conversion:**
- Checkout starts
- Completed purchases
- Conversion rate %

**Revenue:**
- Daily/weekly/monthly sales
- Average order value
- Most popular categories

**Customer:**
- Repeat purchase rate
- Customer satisfaction
- Support ticket volume

---

## Final Checklist Before Going Live

- [ ] All environment variables configured
- [ ] Database connection working
- [ ] NOWPayments webhook configured
- [ ] Test order completed successfully
- [ ] Admin dashboard accessible
- [ ] At least 5 listings added
- [ ] Support email/WhatsApp set up
- [ ] Terms & Privacy pages created
- [ ] Social media accounts created
- [ ] Analytics enabled
- [ ] Backup system configured
- [ ] Security review completed

---

**Congratulations! You're ready to launch! 🎉**

Remember: Start small, test thoroughly, and scale gradually.

Good luck with your marketplace! 💰🚀