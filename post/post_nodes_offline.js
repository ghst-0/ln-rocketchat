import asyncAuto from 'async/auto.js';
import { returnResult } from 'asyncjs-util';

import icons from '../interface/icons.json' with { type: 'json' };

const escape = text => text.replaceAll(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\\$&');
const {isArray} = Array;
const shortId = id => id.slice(0, 8);

/**
 * Post that nodes have gone offline
 * @param {{}} bot Telegram Bot Object
 * @param {{
 *  alias: string,
 *  id: string
 * }[]} offline
 *  alias: Node Alias,
 *  id: Node Identity Public Key Hex
 * @param {function} cbk Callback function
 * @returns {Promise<unknown>} via cbk or Promise
 */
const postNodesOffline = ({ bot, offline }, cbk) => {
  return new Promise((resolve, reject) => {
    asyncAuto({
        // Check arguments
        validate: cbk => {
          if (!bot) {
            return cbk([400, 'ExpectedRocketChatBotToPostNodesOffline']);
          }

          if (!isArray(offline)) {
            return cbk([400, 'ExpectedArrayOfOfflineNodesToPostNodesOffline']);
          }

          return cbk();
        },

        // Setup the message to send notifying that nodes are offline
        message: ['validate', ({}, cbk) => {

          // Exit early when no nodes went offline
          if (offline.length === 0) {
            return cbk();
          }

          const aliases = offline.map(n => `${ n.alias } ${ shortId(n.id) }`.trim());
          const event = `${ icons.disconnected } Lost connection!`

          const details = `Cannot connect to ${ aliases }.`;

          return cbk(null, `_${ escape(event) } ${ escape(details) }_`);
        }],

        // Send the message
        send: ['message', async ({ message }) => {
          if (!message) {
            return;
          }

          return await bot.sendMessage(message);
        }]
      },
      returnResult({ reject, resolve, of: 'message' }, cbk));
  });
}

export { postNodesOffline };
