const getMethod = (prefix, units) => {
  const methodsTime = {
    years: 'FullYear',
    months: 'Month',
    days: 'Date',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    milliseconds: 'Milliseconds',
  };

  return prefix + methodsTime[units];
};

const shmoment = (date) => {
  let result = new Date(date);

  const calculator = {
    add(units, value) {
      const currentUnitValue = result[getMethod('get', units)]();
      result = new Date(result[getMethod('set', units)](currentUnitValue + value));

      return this;
    },

    subtract(units, value) {
      this.add(units, -value);

      return this;
    },

    result() {
      return result;
    },
  };

  return calculator;
};

const result = shmoment(new Date(2020, 0, 7, 17, 17, 17))
  .add('minutes', 2)
  .add('days', 8)
  .subtract('years', 1)
  .subtract('minutes', 78)
  .result(); // ... Jan 15 2019 17:19:17 ...

console.log(result);
