import mongoose from 'mongoose';
import config from '../configs/common.config';
import responseMessages from '../constants/messages.constants';
import { dataSeeder } from './dataSeeder';

const connectMongo = () => {
  mongoose.set('strictQuery', true);

  const dbUrl = `${config.MONGODB_URL}/${config.MONGODB_DATABASE_NAME}`;

  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log(
        `========== ${responseMessages.db_connection_success} ==========`
      );

      dataSeeder();
    })
    .catch((error) => {
      console.log(
        `========== ${responseMessages.db_connection_fail} ==========`,
        error
      );
    });
};

export default connectMongo;
