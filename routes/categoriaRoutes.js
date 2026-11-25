import express from 'express';
import { listarCategorias } from '../controllers/categoriaController.js';

const router = express.Router();

// Listar categorias
router.get('/', listarCategorias);

export default router;