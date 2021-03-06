import fs, { promises as fsPromises } from 'fs';
import path from 'path';
import mongoSetup from '@shelf/jest-mongodb/setup';
import {
  DATA_DIR_PATH,
  DATA_HISTORY_DIR_PATH,
  DATA_MESSAGES_DIR_PATH,
  DATA_REPLIES_DIR_PATH,
} from '../../utils/file/path';
import { fakeDate, fakeFileContent, fakeFilename } from './fake';

module.exports = async () => {
  console.log('\n----- SETUP INTEGRATION -----\n');

  const rootDir = path.resolve(DATA_DIR_PATH);

  if (fs.existsSync(rootDir)) {
    console.log(`\n----- REMOVE DIRECTORY ${rootDir}-----\n`);
    await fsPromises.rmdir(rootDir, { recursive: true, force: true });
  }

  await fsPromises.mkdir(rootDir);
  await fsPromises.mkdir(path.resolve(DATA_HISTORY_DIR_PATH));
  await fsPromises.mkdir(path.resolve(DATA_REPLIES_DIR_PATH));
  await fsPromises.mkdir(path.resolve(DATA_MESSAGES_DIR_PATH));

  await fsPromises.writeFile(
    path.resolve(`${DATA_HISTORY_DIR_PATH}/${fakeDate}.json`),
    JSON.stringify(fakeFileContent, null, 4)
  );

  await fsPromises.writeFile(
    path.resolve(`${DATA_REPLIES_DIR_PATH}/${fakeFilename}.json`),
    JSON.stringify(fakeFileContent, null, 4)
  );

  await mongoSetup();
};
