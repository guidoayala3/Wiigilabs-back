import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Log extends Model {
  public id!: string;
  public userId!: string;
  public action!: string;
  public createdAt!: Date;
  public updatedAt!: Date;  // Agregar updatedAt si no está definido
}

Log.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
    },
  },
  {
    sequelize,
    tableName: 'logs',
    timestamps: true,  
  }
);

export default Log;
