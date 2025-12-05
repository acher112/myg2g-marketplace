import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { method, amount } = req.query;

    if (!method || !amount) {
      return res.status(400).json({ error: 'Missing method or amount' });
    }

    let walletAddress;
    let cryptoAmount;
    let network;

    // Get wallet address and calculate crypto amount
    if (method === 'USDT') {
      walletAddress = process.env.WALLET_USDT_TRC20;
      cryptoAmount = parseFloat(amount).toFixed(2); // USDT = USD 1:1
      network = 'TRC20 (Tron)';
    } else if (method === 'LTC') {
      walletAddress = process.env.WALLET_LTC;
      // Fetch real-time LTC price
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
      const data = await response.json();
      const ltcPrice = data.litecoin.usd;
      cryptoAmount = (parseFloat(amount) / ltcPrice).toFixed(6);
      network = 'Litecoin';
    } else {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(walletAddress);

    return res.status(200).json({
      success: true,
      walletAddress,
      cryptoAmount,
      method,
      network,
      qrCode: qrCodeData,
      amountUSD: amount
    });

  } catch (error) {
    console.error('Payment instructions error:', error);
    return res.status(500).json({ error: error.message });
  }
}
