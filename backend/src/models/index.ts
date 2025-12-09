import sequelize from '../config/database';
import User from './User';
import Ticket from './Ticket';
import Comment from './Comment';

export { sequelize, User, Ticket, Comment };

export default sequelize;
