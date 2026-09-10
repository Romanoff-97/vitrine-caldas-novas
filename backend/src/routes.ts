import { Router } from 'express';
import { FeiraV1Controller } from './controllers/feira-v1.controller';
import { LojaV1Controller } from './controllers/loja-v1.controller';

const router = Router();
const feiraController = new FeiraV1Controller();
const lojaController = new LojaV1Controller();

// Rotas de Feiras
router.get('/feiras', feiraController.listar);
router.post('/feiras', feiraController.criar);

// Rotas de Lojas
router.get('/lojas/feira/:feiraId', lojaController.listarPorFeira);
router.get('/lojas/buscar', lojaController.buscar); // Implementando o RF06
router.post('/lojas', lojaController.criar);

export default router;
