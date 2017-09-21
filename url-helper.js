// Helping use constants to store urls
exports.urlWithDelimiter = (url, args, delimiter = /(\$\{\S+\})/gi) => {
  args = Array.isArray(args) || typeof args === 'undefined'
    ? args
    : [args];

  const variableReg = new RegExp(delimiter);
  const matchLength = url.match(variableReg) ? url.match(variableReg).length : 0;
  const argsLength = args ? args.length : 0;

  let argumentsIndex = 0;
  let newUrl = [];

  if (matchLength > argsLength) {
    throw new Error(`Not enough arguments were send to ${url}!
     Expected ${matchLength}, get ${argsLength}. 
     Detailed: ${args && args.toString()}`
    );
  } else if (matchLength < argsLength) {
    console.warn(`Got more arguments than expected for ${url}.
     Expected ${matchLength}, get ${argsLength}. 
     Detailed: ${args && args.toString()}`
    );
  }

  let urlArray = url.split(variableReg);

  urlArray.forEach((item) => {
    newUrl.push(!item.match(variableReg)
      ? item
      : args[argumentsIndex++]);
  });

  return newUrl.join('');
};

/***
 *
 * @param params {object}
 * @param params.url {string}
 * @param params.query {object}
 * @param params.args {string|array}
 * @param params.delimiter {regexp}
 * @returns {string}
 */
exports.urlWithDelimiter2 = (params) => {
  let {url, query, args, delimiter = /(\$\{\S+\})/gi} = params;

  args = Array.isArray(args) || typeof args === 'undefined'
    ? args
    : [args];

  const variableReg = new RegExp(delimiter);
  const matchLength = url.match(variableReg) ? url.match(variableReg).length : 0;
  const argsLength = args ? args.length : 0;

  let argumentsIndex = 0;
  let newUrl = [];

  if (matchLength > argsLength) {
    throw new Error(`Not enough arguments were send to ${url}!
     Expected ${matchLength}, get ${argsLength}. 
     Detailed: ${args && args.toString()}`
    );
  } else if (matchLength < argsLength) {
    console.warn(`Got more arguments than expected for ${url}.
     Expected ${matchLength}, get ${argsLength}. 
     Detailed: ${args && args.toString()}`
    );
  }

  let urlArray = url.split(variableReg);

  urlArray.forEach((item) => {
    newUrl.push(!item.match(variableReg)
      ? item
      : args[argumentsIndex++]);
  });

  if (query) {
    const queryUrl = Object.entries(query).reduce((acc, item, index, array) =>
      acc + `${item[0]}=${item[1]}` + (index < (array.length - 1) ? '&' : '')
      , '?');

    newUrl.push(queryUrl);
  }

  return newUrl.join('');
};
