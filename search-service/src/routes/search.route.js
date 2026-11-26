const { Router } = require('express');
const searchController = require('../controllers/search.controller');

const router = Router();

// GET /search/trains?from=Delhi&to=Mumbai&date=2026-11-26
router.get('/trains', searchController.searchTrains);

// GET /search/autocomplete?q=del
router.get('/autocomplete', searchController.autocomplete);

// Debug endpoints
router.get('/debug/stations', searchController.debugStations);
router.get('/debug/trains', searchController.debugTrains);

module.exports = router;
