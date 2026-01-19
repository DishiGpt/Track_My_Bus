const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');
const { authMiddleware, roleCheck } = require('../middleware/auth.middleware');

// Get all routes (public)
router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRoute);

// Protected routes
router.post('/', authMiddleware, roleCheck('coordinator'), routeController.createRoute);
router.put('/:id', authMiddleware, roleCheck('coordinator'), routeController.updateRoute);
router.delete('/:id', authMiddleware, roleCheck('coordinator'), routeController.deleteRoute);

module.exports = router;
