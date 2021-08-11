const evaluate = require('mathjs').evaluate;

function ConvertHandler() {

  this.getNum = function (input) {
    let result;
    let unitRegex = /gal$|L$|mi$|km$|lbs$|kg$/g;
    input = input.replace(unitRegex, '');
    let regex = /((^\d*\.?\d+$)|(^\d+\.?\d*$))|(((^\d*\.?\d+)|(^\d+\.?\d*))\/((\d*\.?\d+$)|(\d+\.?\d*$)))/g;
    let matchArr = input.match(regex);
    if (matchArr && matchArr.length > 0) {
      console.log('getNum Match Result:');
      console.log(matchArr);

      result = evaluate(matchArr[0]);
    } else {
      console.log('getNum: match failed');
      result = null;
    }
    return result;
  };

  this.getUnit = function (input) {
    let result;
    let regex = /gal$|L$|mi$|km$|lbs$|kg$/g;
    let matchArr = input.match(regex);
    if (matchArr && matchArr.length > 0) {
      console.log('getUnit Match Result:');
      console.log(matchArr);

      result = matchArr[0];
    } else {
      console.log('getUnit: match failed');
      result = null;
    }
    return result;
  };

  this.getReturnUnit = function (initUnit) {
    let result;
    switch (initUnit) {
      case 'gal':
        result = 'L';
        break;
      case 'L':
        result = 'gal';
        break;
      case 'mi':
        result = 'km';
        break;
      case 'km':
        result = 'mi';
        break;
      case 'lbs':
        result = 'kg';
        break;
      case 'kg':
        result = 'lbs';
        break;
      default:
        console.log('getReturnUnit: Unexpected initUnit!');
        break;
    }
    return result;
  };

  this.spellOutUnit = function (unit) {
    let result;
    switch(unit){
      case 'gal':
        result = 'gallons';
        break;
      case 'L':
        result = 'litres';
        break;
      case 'mi':
        result = 'miles';
        break;
      case 'km':
        result = 'kilometers';
        break;
      case 'lbs':
        result = 'pounds';
        break;
      case 'kg':
        result = 'kilograms';
        break;
      default:
        console.log('spellOutUnit: Unexpected initUnit!');
        break;
    }
    return result;
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    switch(initUnit){
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      default:
        console.log('Unexpected initUnit!');
        break;
    }
    return result;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    returnNum = returnNum.toFixed(5);
    let result = {
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string: `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`,
    }
    return result;
  };

  this.process = function(input){
    const initNum = this.getNum(input);
    const initUnit = this.getUnit(input);
    if(initNum == null || initUnit == null){
      return 'invalid unit';
    }
    const returnNum = this.convert(initNum, initUnit);
    const returnUnit = this.getReturnUnit(initUnit);
    const res = this.getString(initNum, initUnit, returnNum, returnUnit);
    return res;
  };
}

module.exports = ConvertHandler;
