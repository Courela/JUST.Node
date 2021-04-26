import functions from "./functions.js";

function groupArray(arr, groupingElement, groupedElement) {
  let groupedPair = {};

  if (arr)
  {
    arr.forEach(eachObj => {
        let groupToken = functions.execute('valueof', [ '$.' + groupingElement ], eachObj, null);

        if (groupToken)
        {
            let valueOfToken = groupToken.value;

            if (Object.keys(groupedPair).includes(valueOfToken))
            {
                let oldArr = groupedPair[valueOfToken];
                let clonedObj = Object.assign({}, eachObj);
                delete clonedObj[groupingElement];

                oldArr.push(clonedObj);

                groupedPair[valueOfToken] = oldArr;
            }
            else
            {
                let clonedObj = Object.assign({}, eachObj);
                delete clonedObj[groupingElement];
                let newArr = [ clonedObj ];

                groupedPair[valueOfToken] = newArr;
            }
        }
    });
  }

  let resultObj = [];
  Object.keys(groupedPair).forEach(pair => {
      let groupObj = { };
      groupObj[groupingElement] = pair;
      groupObj[groupedElement] = groupedPair[pair];

      resultObj.push(groupObj);
  });

  return resultObj;
}

function groupArrayMultipleProperties(array, groupingPropertyNames, groupedPropertyName) {
  let groupedPair = {};

  if (array)
  {
    array.forEach(eachObj => {
          let groupTokens = [];

          groupingPropertyNames.forEach(groupPropertyName => {
              groupTokens.push(functions.execute('valueof', [ '$.' + groupPropertyName ], eachObj, null).value);
          });

          if (groupTokens.length > 0)
          {
              let key = '';

              groupTokens.forEach(groupToken => {
                  let valueOfToken = groupToken;
                  if (key === '')
                      key += valueOfToken;
                  else
                      key += ':' + valueOfToken;
              });


              if (Object.keys(groupedPair).includes(key))
              {
                  let oldArr = groupedPair[key];
                  let clonedObj = Object.assign({}, eachObj);

                  groupingPropertyNames.forEach(groupPropertyName => {
                      delete clonedObj[groupPropertyName];
                  });

                  oldArr.push(clonedObj);

                  groupedPair[key] = oldArr;
              }
              else
              {
                  let clonedObj = Object.assign({}, eachObj);

                  let newArr = [];

                  groupingPropertyNames.forEach(groupPropertyName => {
                      delete clonedObj[groupPropertyName];
                  });
                  newArr.push(clonedObj);

                  groupedPair[key] = newArr;
              }
          }
      });
  }

  let resultObj = [];
  Object.keys(groupedPair).forEach(pair => {
      let groupObj = {};

      let keys = pair.split(':');

      groupingPropertyNames.forEach((groupPropertyName, i) => {
          groupObj[groupPropertyName] = keys[i];
      });

      groupObj[groupedPropertyName] = groupedPair[pair];

      resultObj.push(groupObj);

  });
  return resultObj;
}

export default {
  groupArray,
  groupArrayMultipleProperties
}