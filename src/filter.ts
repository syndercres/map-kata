/*
  function filter
  parameters: inputArr (any), predicateFn (function)
  returns returnArr (any)

  returnArr (empty array)
  
  for each element of inputArr
    if predicate function returns true
      push element to empty array
    end if
  end for

  EXAMPLE:
  filter([10, 50, -20, -10, 100], v => v < 11)
  expect [10, -20, -10]


 * Adds together two numbers
 * @param inputArr - an any array
 * @param predicateFn - a function returning true or false
 * @returns an any array
 */

function ourFilter(inputArr: any[], predicateFn: Function): any[] {
  const resultArr: any[] = [];
  for (let element of inputArr) {
    if (predicateFn(element)) {
      resultArr.push(element);
    }
  }
  return resultArr;
}

export default ourFilter;
