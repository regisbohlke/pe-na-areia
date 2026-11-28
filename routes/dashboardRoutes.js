
import express from 'express';
import { carregarDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

// Página principal da administração
router.get('/', carregarDashboard);

export default router;
