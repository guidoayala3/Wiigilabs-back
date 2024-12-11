// src/seeders/xxxxxx-demo-user.ts
import User from '../models/User';
import bcrypt from 'bcrypt';

export default {
  up: async () => {
    try {
      const hashedPassword = await bcrypt.hash('Admin123*', 10);
      console.log('Hash generado:', hashedPassword);  // Verifica el hash

      const user = await User.create({
        name: 'User Test',
        email: 'test@test.com',
        password: hashedPassword,
      });
      console.log('Usuario creado:', user);  // Verifica el usuario creado
    } catch (error) {
      console.error('Error al ejecutar el seeder:', error);
    }
  },

  down: async () => {
    try {
      const deletedCount = await User.destroy({ where: { email: 'test@test.com' } });
      console.log(`Usuarios eliminados: ${deletedCount}`);
    } catch (error) {
      console.error('Error al revertir el seeder:', error);
    }
  },
};
