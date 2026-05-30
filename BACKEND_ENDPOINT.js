/**
 * =====================================================
 * ADD THIS ENDPOINT TO YOUR EXPRESS BACKEND
 * File: inventorybackend route file (e.g. routes/product.js)
 * =====================================================
 *
 * GET /api/myntra-image?style_id=33800318
 *
 * Fetches Myntra product page server-side (no X-Frame-Options restriction),
 * extracts og:image URL, returns it as JSON.
 *
 * npm install node-fetch  (if not already installed)
 * or use axios which you likely already have
 */

// Using axios (already in most Node backends):
const axios = require('axios');

// Add this route to your Express app:
app.get('/api/myntra-image', async (req, res) => {
  const { style_id } = req.query;

  if (!style_id) {
    return res.status(400).json({ imageUrl: null, error: 'style_id required' });
  }

  try {
    const response = await axios.get(`https://www.myntra.com/${style_id}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    const html = response.data;

    // Extract og:image meta tag
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    if (ogMatch && ogMatch[1]) {
      return res.json({ imageUrl: ogMatch[1] });
    }

    // Fallback: try to find first product image in page JSON
    const jsonMatch = html.match(/"imageURL"\s*:\s*"([^"]+)"/);
    if (jsonMatch && jsonMatch[1]) {
      return res.json({ imageUrl: jsonMatch[1] });
    }

    return res.json({ imageUrl: null });
  } catch (err) {
    console.error('Myntra image fetch error:', err.message);
    return res.json({ imageUrl: null });
  }
});

// =====================================================
// CORS: Make sure your backend allows requests from your
// Netlify domain. Add to your CORS config:
// =====================================================
// app.use(cors({
//   origin: ['https://made-by-many.netlify.app', 'http://localhost:3000']
// }));
