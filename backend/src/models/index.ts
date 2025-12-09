import sequelize from '../config/database';
import User from './User';
import Ticket from './Ticket';
import Comment from './Comment';

// ✅ ALL ASSOCIATIONS HERE (safe order)
User.hasMany(Ticket, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });

Ticket.belongsTo(User, { foreignKey: 'userId', as: 'User' });
Ticket.hasMany(Comment, { foreignKey: 'ticketId' });

Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Ticket, { foreignKey: 'ticketId' });

export { sequelize, User, Ticket, Comment };
export default sequelize;
