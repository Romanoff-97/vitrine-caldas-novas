import { Router, Request, Response } from 'express';
import { FeiraV1Controller } from './controllers/feira-v1.controller';
import { LojaV1Controller } from './controllers/loja-v1.controller';
import { adminAuthMiddleware } from './middlewares/admin-auth.middleware';

const router = Router();
const feiraController = new FeiraV1Controller();
const lojaController = new LojaV1Controller();

// Verificação de autenticação administrativa
router.post('/admin/verificar-chave', (req: Request, res: Response): void => {
  const adminKey = process.env.ADMIN_KEY || 'admin123';
  const providedKey = req.headers['x-admin-key'] || req.body?.chave;

  if (providedKey && providedKey === adminKey) {
    res.status(200).json({ valido: true, mensagem: 'Chave administrativa autenticada com sucesso.' });
    return;
  }

  res.status(401).json({ valido: false, erro: 'Chave administrativa incorreta ou não fornecida.' });
});

// Rotas de Feiras
router.get('/feiras', feiraController.listar);
router.get('/feiras/:id', feiraController.obterPorId);
router.put('/feiras/:id', adminAuthMiddleware, feiraController.atualizar);
router.post('/feiras', adminAuthMiddleware, feiraController.criar);

// Rotas de Lojas
router.get('/lojas/feira/:feiraId', lojaController.listarPorFeira);
router.get('/lojas/buscar', lojaController.buscar); // Implementando o RF06
router.get('/lojas/:id', lojaController.obterPorId);
router.put('/lojas/:id', adminAuthMiddleware, lojaController.atualizar);
router.post('/lojas', adminAuthMiddleware, lojaController.criar);

export default router;
