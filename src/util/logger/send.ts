import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export async function sendErrorMessage(errorMessage, metaData) {
  await axios.post(process.env.MANAGER_URL, {
    errorMessage,
    metaData,
  });
  return;
}
