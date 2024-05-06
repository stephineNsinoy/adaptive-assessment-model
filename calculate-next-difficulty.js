const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const Papa = require('papaparse');

const submissionsFile = '../csv/no_next_difficulty_submissions.csv';

let CALIBRATION_VALUES = {B: 0, E: 0.25, M: 0.5, H: 0.75, V: 1};

async function processFiles() {
  try {
    const submissionsData = await readFile(submissionsFile, 'utf8');

    const submissions = Papa.parse(submissionsData, { header: true }).data;

    const newRows = [];

    submissions.forEach(submission => {
      const studentId = parseInt(submission['Student ID']);
      const problemId = parseInt(submission['Problem ID']);
      const problemDifficulty = submission['Difficulty'];
      const timeSpent = parseInt(submission['Time Spent']);
      const numberOfExecutions = parseInt(submission['Number of Executions']);
      const isPerfect = parseInt(submission['Is Perfect']);

      const nextDifficulty = calculateNextDifficulty(problemDifficulty, timeSpent, numberOfExecutions, isPerfect);

      newRows.push({
        'Student ID': studentId,
        'Problem ID': problemId,
        'Difficulty': problemDifficulty,
        'Time Spent': timeSpent,
        'Number of Executions': numberOfExecutions,
        'Is Perfect': isPerfect,
        'Next Difficulty': nextDifficulty
      });
    });

    const newCsv = Papa.unparse(newRows);
    await writeFile('../csv/with_next_difficulty_submissions.csv', newCsv);
    console.log('with_next_difficulty_submissions.csv file created.');

  } catch (err) {
    console.error('Error reading the files:', err);
  }
}

function calculateNextDifficulty(problemDifficulty, timeSpent, numberOfExecutions, isPerfect) {
  const difficultyValue = CALIBRATION_VALUES[problemDifficulty];

  // Define thresholds
  let timeSpentThreshold = 0;
  let numberOfExecutionsThreshold = 0;

  // 0 - 300 -> B
  // 301 - 600 -> E
  // 601 - 1200 -> M
  // 1201 - 1800 -> H
  // 1801 - 2400 -> V 

  // Input/Output

  // Problem 1
  // Average time spent = 200
  // Average executions = 3

  // Problem 2
  // Average time spent = 250
  // Average executions = 3

  // Problem 3
  // Average time spent = 280
  // Average executions = 5

  // Problem 4
  // Average time spent = 290
  // Average executions = 6

  // Problem 5
  // Average time spent = 300
  // Average executions = 7

  // Average the submissions of each problem

  if (problemDifficulty === 'B') {
    timeSpentThreshold = 300; // 5mins; originally 12mins
    numberOfExecutionsThreshold = 3; // originally 9
  } else if (problemDifficulty === 'E') {
    timeSpentThreshold = 600; // 10mins; originally 18mins
    numberOfExecutionsThreshold = 6; // originally 5
  } else if (problemDifficulty === 'M') {
    timeSpentThreshold = 1200; // 20mins; originally 28mins
    numberOfExecutionsThreshold = 9; // originally 134
  } else if (problemDifficulty === 'H') {
    timeSpentThreshold = 1800; // 30mins; originally 34mins
    numberOfExecutionsThreshold = 12; // originally 16
  } else if (problemDifficulty === 'V') {
    timeSpentThreshold = 2400; // 40mins; originally 35mins
    numberOfExecutionsThreshold = 15; // originally 18
  }

  // Calculate adjustments based on thresholds
  const timeSpentAdjustment = timeSpent > timeSpentThreshold ? -0.25 : 0;
  const numberOfExecutionsAdjustment = numberOfExecutions > numberOfExecutionsThreshold ? -0.25 : 0;
  const isPerfectAdjustment = isPerfect ? 0.25 : 0;

  // Calculate the new difficulty value
  let newDifficultyValue = difficultyValue + timeSpentAdjustment + numberOfExecutionsAdjustment + isPerfectAdjustment;

  // Ensure the new difficulty value is within the valid range
  newDifficultyValue = Math.max(0, Math.min(newDifficultyValue, 1));

  // Map the new difficulty value back to a difficulty category
  const valueToDifficulty = {
    B: [0, 0.24],
    E: [0.25, 0.49],
    M: [0.50, 0.74],
    H: [0.75, 0.99],
    V: [1.00, 1.00],
  };

  for (const [key, value] of Object.entries(valueToDifficulty)) {
    if (newDifficultyValue >= value[0] && newDifficultyValue <= value[1]) {
      return key;
    }
  }

  return 'B'; // Default value, should never be reached
}

processFiles();