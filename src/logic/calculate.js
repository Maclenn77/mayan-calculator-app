import operate from './operate';

const isNumber = (item) => {
  return !!item.match(/[0-9a-j]+/);
}

/**
 * Given a button name and a calculator data object, return an updated
 * calculator data object.
 *
 * Calculator data object contains:
 *   total:s      the running total
 *   next:String       the next number to be operated on with the total
 *   nextMayan:String the Mayan glyph for the number
 *   operation:String  +, -, etc.
 */

export const Calculate = (obj, buttonName) => {
  if (buttonName === 'AC') {
    return {
      total: '0',
      next: null,
      operation: null,
      mayan: '\u{1d2e0}',
    };
  }

  if (isNumber(buttonName)) {
    if (buttonName === '0' && obj.next === '0') {
      return { 
          total: '0',
          nextMayan:'\u{1d2e0}'};
    }
    // If there is an operation, update next
    if (obj.operation) {
      if (obj.next) {
        return {
          ...obj,
          next: obj.next + buttonName,
          nextMayan: obj.nextMayan + convertToUnicode(buttonName),
        };
      }
      return { ...obj, next: buttonName, nextMayan: convertToUnicode(buttonName) };
    }
    // If there is no operation, update next and clear the value
    if (obj.next) {
      return {
        next: obj.next + buttonName,
        nextMayan: obj.nextMayan + convertToUnicode(buttonName),
        total: null,
      };
    }
    return {
      next: buttonName,
      nextMayan: convertToUnicode(buttonName),
      total: null,
    };
  }

  if (buttonName === '=') {
    if (obj.next && obj.operation) {
      const result = operate(obj.total, obj.next, obj.operation);
      const resultInMayan = convertToMayan(result).join('');
      return {
        total: result,
        next: null,
        operation: null,
        mayan: resultInMayan,
      };
    }
    // '=' with no operation, nothing to do
    return {};
  }

  // if (buttonName === '+/-') {
  //   if (obj.next) {
  //     return { ...obj, next: (-1 * parseFloat(obj.next)).toString() };
  //   }
  //   if (obj.total) {
  //     return { ...obj, total: (-1 * parseFloat(obj.total)).toString() };
  //   }
  //   return {};
  // }

  // Button must be an operation

  // When the user presses an operation button without having entered
  // a number first, do nothing.
  // if (!obj.next && !obj.total) {
  //   return {};
  // }

  // User pressed an operation after pressing '='
  if (!obj.next && obj.total && !obj.operation) {
    return { ...obj, operation: buttonName };
  }

  // User pressed an operation button and there is an existing operation
  if (obj.operation) {
    if (obj.total && !obj.next) {
      return { ...obj, operation: buttonName };
    }

    return {
      total: operate(obj.total, obj.next, obj.operation),
      next: null,
      nextMayan: null,
      operation: buttonName,
    };
  }

  // no operation yet, but the user typed one

  // The user hasn't typed a number yet, just save the operation
  if (!obj.next) {
    return { operation: buttonName };
  }

  // save the operation and shift 'next' into 'total'
  return {
    total: obj.next,
    next: null,
    operation: buttonName,
  };
}
