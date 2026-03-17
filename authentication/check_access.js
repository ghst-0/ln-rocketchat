import asyncAuto from 'async/auto.js';
import { returnResult } from 'asyncjs-util';

/**
 * Check access to private commands
 * @param {number} from Source User Id
 * @param {function} cbk Callback function
 * @returns {Promise<unknown>} via cbk or Promise
 */
const checkAccess = ({ from }, cbk) => {
  return new Promise((resolve, reject) => {
    asyncAuto({
        // Check arguments
        validate: cbk => {
          if (!from) {
            return cbk([400, 'ExpectedFromUserIdToCheckAccess']);
          }

          return cbk();
        },

        // Check access
        checkAccess: ['validate', ({}, cbk) => {
          return cbk();
        }]
      },
      returnResult({ reject, resolve }, cbk));
  });
}

export { checkAccess };
