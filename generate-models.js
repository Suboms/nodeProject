// scripts/generate-models.js

const { exec } = require("child_process");

// Define Sequelize model generation commands
const commands = [
  `npx sequelize-cli model:generate --name User --attributes email:string,firstName:string,lastName:string,userName:string,password:string`,

  `npx sequelize-cli model:generate --name AccountDetails --attributes userId:integer,accountNum:bigint,accountBalance:decimal`,

  `npx sequelize-cli model:generate --name Transaction --attributes accountId:integer,transactionType:enum,transactionAmount:decimal,transactionDestination:bigint,destinationBank:string,description:text,transactionDate:date`,

  `npx sequelize-cli model:generate --name Statement --attributes accountId:integer,generatedAt:date,statementData:json`,
];

// Function to execute commands sequentially
const executeCommands = async () => {
  for (let command of commands) {
    await executeCommand(command);
  }
};

// Function to execute a single command
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
};

// Execute the commands sequentially
executeCommands()
  .then(() => {
    console.log("All model generation commands executed successfully");
  })
  .catch((error) => {
    console.error("Error executing model generation commands:", error);
    process.exit(1); // Exit with a non-zero code to indicate failure
  });
