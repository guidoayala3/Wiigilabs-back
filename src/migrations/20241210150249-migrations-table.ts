import { DataTypes, QueryInterface, QueryTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  try {
    // Verificar si la tabla ya existe antes de crearla
    const tables = await queryInterface.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_name = 'migrations'",
      { type: QueryTypes.SELECT }
    );

    // Solo crear la tabla si no existe
    if (tables.length === 0) {
      await queryInterface.createTable('migrations', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        executedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      });
      console.log('Tabla migrations creada.');
    } else {
      console.log('La tabla migrations ya existe.');
    }

    // Crear otras tablas
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.createTable('logs', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  } catch (error: any) {
    console.error('Error al crear la tabla migrations:', error);
    throw error;
  }
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.dropTable('users');
  await queryInterface.dropTable('logs');
  await queryInterface.dropTable('migrations');
};
