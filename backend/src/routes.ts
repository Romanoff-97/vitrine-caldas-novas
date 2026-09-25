import { Router, Request, Response } from 'express';
import { FeiraV1Controller } from './controllers/feira-v1.controller';
import { LojaV1Controller } from './controllers/loja-v1.controller';
import {
  authMiddleware,
  compararChavesComSeguranca,
  obterChaveAdministrativaEsperada
} from './middlewares/auth.middleware';
import { upload } from './config/upload';

const router = Router();
const feiraController = new FeiraV1Controller();
const lojaController = new LojaV1Controller();

/**
 * Endpoint para validação prévia de chave administrativa.
 * Suporta header x-admin-key ou chave no corpo da requisição.
 */
router.post('/admin/verificar-chave', (req: Request, res: Response): void => {
  const chaveEsperada = obterChaveAdministrativaEsperada();
  const providedKey = (req.headers['x-admin-key'] || req.body?.chave) as string | undefined;

  if (providedKey && typeof providedKey === 'string' && compararChavesComSeguranca(providedKey, chaveEsperada)) {
    res.status(200).json({ valido: true, mensagem: 'Chave administrativa autenticada com sucesso.' });
    return;
  }


  res.status(401).json({ valido: false, erro: 'Chave administrativa incorreta ou não fornecida.' });
});

// Rotas de Feiras (GET público, POST/PUT/DELETE protegidos)
router.get('/feiras', feiraController.listar);
router.get('/feiras/:id', feiraController.obterPorId);
router.put('/feiras/:id', authMiddleware, feiraController.atualizar);
router.post('/feiras', authMiddleware, feiraController.criar);
router.delete('/feiras/:id', authMiddleware, feiraController.excluir);

// Rotas de Lojas (GET público, POST/PUT/DELETE protegidos com upload de imagem onde aplicável)
router.get('/lojas/feira/:feiraId', lojaController.listarPorFeira);
router.get('/lojas/buscar', lojaController.buscar); // RF06
router.get('/lojas/:id', lojaController.obterPorId);
router.put('/lojas/:id', authMiddleware, upload.single('imagem'), lojaController.atualizar);
router.post('/lojas', authMiddleware, upload.single('imagem'), lojaController.criar);
router.delete('/lojas/:id', authMiddleware, lojaController.excluir);

export default router;