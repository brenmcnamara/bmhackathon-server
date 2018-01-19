const chalk = require('chalk');
const promptly = require('promptly');

let gameID = null;
let question = null;
let numberOfOptions = null;
const options = [];
let timeLimitInSeconds = null;
let delayInSeconds = null;

promptly
  .prompt('Game ID: ')
  .then(_gameID => {
    gameID = _gameID;
    return promptly.prompt('Question: ');
  })
  .then(_question => {
    questions = _question;
    return promptly.prompt('How many options? ');
  })
  .then(_numOfOptions => {
    numOfOptions = parseInt(_numOfOptions, 10);
    if (Number.isNaN(numOfOptions)) {
      throw Error('Expected number, got ' + _numOfOptions);
    }
    return getAllOptions();
  })
  .then(() => {
    return promptly.prompt('Time limit (in seconds): ');
  })
  .then(_timeLimitInSeconds => {
    timeLimitInSeconds = parseInt(_timeLimitInSeconds, 10);
    if (Number.isNaN(timeLimitInSeconds) || timeLimitInSeconds <= 0) {
      throw Error('Invalid time limit. Must be a number > 0. Got ' + _timeLimitInSeconds);
    }
    timeLimitInSeconds = _timeLimitInSeconds;
  })
  .then(() => {
    return promptly.prompt('Delay (in seconds): ');
  })
  .then(_delayInSeconds => {
    delayInSeconds = parseInt(_delayInSeconds, 10);
    if (Number.isNaN(timeLimitInSeconds) || timeLimitInSeconds <= 0) {
      throw Error('Invalid delay. Must be a number > 0. Got ' + _delayInSeconds);
    }
  })
  .then(() => {
    console.log(chalk.green('All done!'));
    process.exit(0);
  })
  .catch(error => {
    console.log(chalk.red(error.toString()));
    process.exit(1);
  });

function getAllOptions() {
  if (options.length >= numOfOptions) {
    return Promise.resolve();
  }
  return promptly.prompt(`Option ${options.length + 1}: `).then(option => {
    options.push(option);
    return getAllOptions();
  });

}
