const express = require('express');

const app = express();

const PORT = process.env.PORT || 4002;

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hello world from booking-service' });
});

app.listen(PORT, () =>
  console.log(`Booking service running on http://localhost:${PORT}`),
);
