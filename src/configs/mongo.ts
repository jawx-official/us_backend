import { ConnectOptions } from 'mongoose';

/**
 * MongoDB configurations
 * @category Configurations
 */
class Mongo {
  /**
   * @param {string} uri Connection string for mongodb database server
   */
  static uri = process.env.MONGODB_URL || 'mongodb://localhost:27017/test';

  /**
   * @param {ConnectOptions} options Mongodb server options
   */
  static options: ConnectOptions = {
    socketTimeoutMS: 0,
    keepAlive: true
  };
}

export default Mongo;
