/**
 * This object takes an object and returns a cleaned object.
 * Removes extra key being getting added to an object and adds a key if it gets missed.
 * @param {object} object
 * @returns {_object}
 */
export const sanitizeObject = (object) =>
  Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      return [`_${key}`, value ?? ""];
    })
  );
