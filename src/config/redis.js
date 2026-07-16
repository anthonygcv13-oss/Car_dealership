const { createClient } = require('redis');

let redisClient = null;
let isRedisConnected = false;

const initRedis = async () => {
  const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  console.log(`🔌 Conectando a Redis en: ${url}`);
  
  redisClient = createClient({
    url,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          // Retornar un Error o false detiene los intentos de reconexión automática
          console.warn('⚠️ Se detuvieron los reintentos automáticos de conexión a Redis (Límite de 3 intentos).');
          return false;
        }
        return 3000; // Reintentar cada 3 segundos
      }
    }
  });

  redisClient.on('connect', () => {
    console.log('📡 Conectando al cliente Redis...');
  });

  redisClient.on('ready', () => {
    isRedisConnected = true;
    console.log('✅ Conexión con Redis establecida y lista para su uso.');
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
    console.error('⚠️ Error de conexión en el cliente Redis:', err.message);
  });

  redisClient.on('end', () => {
    isRedisConnected = false;
    console.log('❌ Conexión con Redis cerrada.');
  });

  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ No se pudo establecer conexión inicial con Redis:', err.message);
    console.log('⚠️ El backend continuará operando consultando directamente a PostgreSQL (Bypass).');
  }
};

const getCache = async (key) => {
  if (!isRedisConnected || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn(`⚠️ Error al leer de la caché Redis (Key: ${key}):`, err.message);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 1800) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    const serialized = JSON.stringify(value);
    await redisClient.set(key, serialized, {
      EX: ttlSeconds // TTL por defecto: 30 minutos
    });
    return true;
  } catch (err) {
    console.warn(`⚠️ Error al guardar en la caché Redis (Key: ${key}):`, err.message);
    return false;
  }
};

const deleteCache = async (key) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.warn(`⚠️ Error al eliminar de la caché Redis (Key: ${key}):`, err.message);
    return false;
  }
};

module.exports = {
  initRedis,
  getCache,
  setCache,
  deleteCache,
  keys: {
    VEHICLES: 'vehicles:all',
    BRANDS: 'brands:all',
    MODELS: 'models:all',
  }
};
