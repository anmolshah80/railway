const crypto = require('crypto');

function getDeviceFingerprint(req) {
  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = req.ip || '';
  const accept = req.headers['accept'] || '';

  const raw = `${userAgent}|${ipAddress}|${accept}`;

  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16); // short device id
}

module.exports = getDeviceFingerprint;
