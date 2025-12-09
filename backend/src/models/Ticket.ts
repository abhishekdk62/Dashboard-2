import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface TicketAttributes {
  id?: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  userId: number;
}

class Ticket extends Model<TicketAttributes> {
  declare id: number;
  declare userId: number;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        'technical',
        'billing',
        'support',
        'feature',
        'other'
      ),
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'in-progress', 'resolved', 'closed'),
      allowNull: false,
      defaultValue: 'open',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Ticket',
  }
);

Ticket.belongsTo(User, { foreignKey: 'userId' });

export default Ticket;
