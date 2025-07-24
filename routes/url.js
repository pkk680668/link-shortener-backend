// const express = require('express');
// const router = express.Router();
// const shortid = require('shortid');
// const Url = require('../models/Url');

// const baseUrl = 'http://localhost:5000';  // baad me env file me daal sakte ho

// // POST route for shortening URL
// router.post('/shorten', async (req, res) => {
//   const { originalUrl } = req.body;

//   // Basic validation
//   if (!originalUrl || !originalUrl.startsWith('http')) {
//     return res.status(400).json({ message: 'Invalid URL format' });
//   }

//   // Check if already exists in DB
//   const existing = await Url.findOne({ originalUrl });
//   if (existing) {
//     return res.json({ shortUrl: `${baseUrl}/${existing.shortId}` });
//   }

//   // Create new short ID
//   const shortId = shortid.generate();

//   const newUrl = new Url({
//     originalUrl,
//     shortId
//   });

//   await newUrl.save();

//   res.json({ shortUrl: `${baseUrl}/${shortId}` });
// });

// module.exports = router;




//cursur ka code
const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');

// const baseUrl = 'http://localhost:5000';  // isko chahe to env se le sakte ho

const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

// POST route for shortening URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  // Basic validation
  if (!originalUrl || !originalUrl.startsWith('http')) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  // Check if already exists in DB
  let urlDoc = await Url.findOne({ originalUrl });
  if (urlDoc) {
    return res.json({
      originalUrl: urlDoc.originalUrl,
      shortId: urlDoc.shortId,
      shortUrl: `${baseUrl}/${urlDoc.shortId}`,
      date: urlDoc.createdAt
    });
  }

  // Create new short ID
  const shortId = shortid.generate();

  urlDoc = new Url({
    originalUrl,
    shortId
  });

  await urlDoc.save();

  res.json({
    originalUrl: urlDoc.originalUrl,
    shortId: urlDoc.shortId,
    shortUrl: `${baseUrl}/${urlDoc.shortId}`,
    date: urlDoc.createdAt
  });
});





//baad me cursor ka code
// GET route for redirecting short URL
router.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const urlDoc = await Url.findOne({ shortId });
  if (urlDoc) {
    // Redirect to original URL
    return res.redirect(urlDoc.originalUrl);
    // Agar sirf JSON chahiye toh:
    // return res.json({ originalUrl: urlDoc.originalUrl });
  } else {
    return res.status(404).send('URL not found');
  }
});

module.exports = router;