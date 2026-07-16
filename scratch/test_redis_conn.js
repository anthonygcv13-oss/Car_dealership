const { createClient } = require('redis');

async function testConn() {
  const url = 'redis://default:BeEVM2BqRDGutoGCOS4LkMKP2TYCiPHs@potato-shimmery-masterful-90149.db.redis.io:10114';
  console.log('Probando conexión a Redis...');
  const client = createClient({ url });
  
  client.on('error', (err) => {
    console.error('Error en cliente Redis:', err);
  });
  
  try {
    await client.connect();
    console.log('¡Conectado exitosamente a Redis Cloud!');
    await client.set('test_key', 'hello_world_from_node');
    const val = await client.get('test_key');
    console.log('Valor recuperado de Redis:', val);
    await client.disconnect();
    console.log('Desconectado.');
  } catch (error) {
    console.error('Error durante la prueba:', error);
  }
}

testConn();
