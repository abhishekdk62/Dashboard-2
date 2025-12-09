import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Ticket from './Ticket';

interface CommentAttributes {
  id?: number;
  ticketId: number;
  userId: number;
  content: string;
}

class Comment extends Model<CommentAttributes> {
  declare id: number;
  declare ticketId: number;
  declare userId: number;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ticket,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
  }
);

Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Ticket, { foreignKey: 'ticketId' });

export default Comment;
