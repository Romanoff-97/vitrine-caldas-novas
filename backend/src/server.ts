import 'dotenv/config';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './database';
import routes from './routes';

const app = express();

/**
 * Whitelist de origens autorizadas para consumo da API.
 * Bloqueia acessos não autorizados via navegador (CORS restrito).
 */
const ORIGENS_PERMITIDAS: readonly string[] = [
  'https://vitrine-cn.vercel.app',
  'https://vitrinecn.pedehub.com.br',
  'http://localhost:4200'
];

const configuracaoCors: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    // Permite requisições sem origem (ex: apps mobile, curl, chamadas internas) ou dentro da whitelist
    if (!origin || ORIGENS_PERMITIDAS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Acesso bloqueado pela política de CORS: origem '${origin}' não autorizada.`));
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

app.use(cors(configuracaoCors));

/**
 * Interface padronizada para resposta de bloqueio por taxa de requisições.
 */
interface RespostaRateLimit {
  erro: string;
  statusCode: number;
  tentarNovamenteEmMinutos: number;
}

/**
 * Rate Limiter Global:
 * Limita até 100 requisições a cada 15 minutos por IP.
 */
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // Máximo de 100 requisições por IP dentro da janela
  standardHeaders: 'draft-7', // Retorna headers RateLimit-*
  legacyHeaders: false, // Desabilita X-RateLimit-* legados
  message: {
    erro: 'Muitas requisições originadas deste IP. Por favor, tente novamente em 15 minutos.',
    statusCode: 429,
    tentarNovamenteEmMinutos: 15
  } satisfies RespostaRateLimit
});

// Aplica o rate limiting em todas as rotas
app.use(limiterGlobal);

app.use(express.json());

connectDatabase(); // Conecta no Mongo Atlas
app.use('/api', routes); // Prefixo da nossa API

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

