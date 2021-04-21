/* eslint-disable no-console */
import { promises as fsPromises } from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { writeHistoryJSON, writeRepliesJSON } from '../file';

const TESTS_DIR_PATH = 'src/data/tests';
const TESTS_HISTORY_DIR_PATH = `${TESTS_DIR_PATH}/history`;
const TESTS_REPLIES_DIR_PATH = `${TESTS_DIR_PATH}/replies`;

beforeAll(async () => {
  await fsPromises.mkdir(path.resolve(TESTS_DIR_PATH));
  await fsPromises.mkdir(path.resolve(TESTS_HISTORY_DIR_PATH));
  await fsPromises.mkdir(path.resolve(TESTS_REPLIES_DIR_PATH));
});

afterAll(async () => {
  await fsPromises.rm(TESTS_DIR_PATH, { recursive: true, force: true });
});

test('writeHistoryJSON', async () => {
  const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const data = [{ test: 'test' }];
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  await writeHistoryJSON(data, TESTS_HISTORY_DIR_PATH);

  expect(spyConsoleLog).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenLastCalledWith(`Writing file ${currentDate}.json success !`);

  const result = await fsPromises.readFile(path.resolve(`${TESTS_HISTORY_DIR_PATH}/${currentDate}.json`), {
    encoding: 'utf-8',
  });
  expect(JSON.parse(result)).toEqual(data);

  spyConsoleLog.mockRestore();
});

test('writeRepliesJSON', async () => {
  const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const replies = [
    {
      ok: true,
      messages: [
        {
          client_msg_id: '1dbeca20-f534-4a3c-a228-f7c22800077f',
          type: 'message',
          text:
            'Congratulations to the winners :trophy: and thanks to everyone for participating and being part of my challenge. It was a pleasure to hear all your thoughts and insights about this topic! :confetti_ball:',
          ts: '1618829243.102800',
          thread_ts: '1618829243.102800',
          latest_reply: '1618830210.103200',
        },
        {
          client_msg_id: 'd73511b5-6144-4f67-8d03-f8cc0f437cc4',
          type: 'message',
          text: 'Thank you for the challenge!',
          thread_ts: '1618829243.102800',
          parent_user_id: 'U01KAQFF75X',
        },
      ],
      has_more: false,
      response_metadata: {
        scopes: ['channels:history', 'channels:read', 'groups:history', 'users:read'],
        acceptedScopes: ['channels:history', 'groups:history', 'mpim:history', 'im:history', 'read'],
      },
    },
    {
      ok: true,
      messages: [
        {
          client_msg_id: '1dbeca20-f534-4a3c-a228-f7c22800077f',
          type: 'message',
          text:
            'Congratulations to the winners :trophy: and thanks to everyone for participating and being part of my challenge. It was a pleasure to hear all your thoughts and insights about this topic! :confetti_ball:',
          ts: '1618250497.084500',
        },
      ],
      has_more: false,
      response_metadata: {
        scopes: ['channels:history', 'channels:read', 'groups:history', 'users:read'],
        acceptedScopes: ['channels:history', 'groups:history', 'mpim:history', 'im:history', 'read'],
      },
    },
  ];

  await writeRepliesJSON(replies, TESTS_REPLIES_DIR_PATH);

  const resultRepliesFile1 = await fsPromises.readFile(
    path.resolve(`${TESTS_REPLIES_DIR_PATH}/${replies[0].messages[0].ts}.json`),
    {
      encoding: 'utf-8',
    }
  );
  const resultRepliesFile2 = await fsPromises.readFile(
    path.resolve(`${TESTS_REPLIES_DIR_PATH}/${replies[1].messages[0].ts}.json`),
    {
      encoding: 'utf-8',
    }
  );
  expect(JSON.parse(resultRepliesFile1)).toEqual(replies[0]);
  expect(JSON.parse(resultRepliesFile2)).toEqual(replies[1]);

  spyConsoleLog.mockRestore();
});
