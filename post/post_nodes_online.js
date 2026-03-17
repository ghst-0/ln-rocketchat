import asyncAuto from 'async/auto.js';
import { returnResult } from 'asyncjs-util';

import icons from '../interface/icons.json' with { type: 'json' };

const commaJoin = arr => arr.join(', ');
const escape = text => text.replaceAll(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\\$&');
const {isArray} = Array;

/**
 * Post that nodes are now online
 * @param {{alias: {}, public_key: string}[]} nodes List of nodes {
 *   alias: Node Alias,
 *   public_key: Public Key Hex
 * }
 * @param {function} send Send Message to Telegram User Function
 * @param {function} cbk Callback function
 * @returns {Promise<unknown>} via cbk or Promise
 */
const postNodesOnline = ({ nodes, send }, cbk)  => {
  return new Promise((resolve, reject) => {
    asyncAuto({
        // Check arguments
        validate: cbk => {
          if (!isArray(nodes)) {
            return cbk([400, 'ExpectedNodesToPostOnlineNotification']);
          }

          if (!send) {
            return cbk([400, 'ExpectedSendFunctionToPostOnlineNotification']);
          }

          return cbk();
        },

        // Message to send
        message: ['validate', ({}, cbk) => {
          const names = nodes.map(node => (node.alias || node.id).trim());

          const text = `${ icons.bot } Connected to ${ commaJoin(names) }`;

          return cbk(null, `_${ escape(text) }_`);
        }],

        // Send the connected message
        send: ['message', async ({ message }) => await send(message)]
      },
      returnResult({ reject, resolve, of: 'message' }, cbk));
  });
}

export { postNodesOnline };
