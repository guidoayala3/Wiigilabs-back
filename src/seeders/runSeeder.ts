import seeder from './20241210150428-demo-user';  

const runSeeder = async (action: 'up' | 'down') => {
  try {
    console.log(`Ejecutando el seeder: ${action}`);
    if (action === 'up') {
      await seeder.up();  
    } else if (action === 'down') {
      await seeder.down();  
    }
    console.log('Seeder ejecutado con éxito');
  } catch (error) {
    console.error('Error al ejecutar el seeder:', error);
  }
};


const action = process.argv[2] as 'up' | 'down';
if (action) {
  runSeeder(action);
} else {
  console.error('Se debe especificar una acción: up o down');
  process.exit(1);
}