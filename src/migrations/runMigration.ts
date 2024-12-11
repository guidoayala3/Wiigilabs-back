import sequelize from '../config/database';  // Ajusta la ruta según tu configuración
import { up, down } from './20241210150249-migrations-table';  // Ajusta la ruta del archivo de migración

const runMigration = async () => {
  try {
    // Ejecuta la migración 'up' para crear las tablas
    await up(sequelize.getQueryInterface());
    console.log('Migración ejecutada con éxito');
  } catch (error) {
    console.error('Error al ejecutar la migración:', error);
  }
};

const rollbackMigration = async () => {
  try {
    
    await down(sequelize.getQueryInterface());
    console.log('Migración revertida con éxito');
  } catch (error) {
    console.error('Error al revertir la migración:', error);
  }
};


const action = process.argv[2];  

if (action === 'migrate') {
  runMigration();
} else if (action === 'rollback') {
  rollbackMigration();
} else {
  console.log('Por favor, pasa un argumento válido: "migrate" o "rollback".');
}
