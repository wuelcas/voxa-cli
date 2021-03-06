/*
 * Copyright (c) 2018 Rain Agency <contact@rain.agency>
 * Author: Rain Agency <contact@rain.agency>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/* tslint:disable:no-submodule-imports no-console */
import bluebird from "bluebird";
import inquirer from "inquirer";
import _ from "lodash";
import os from "os";
import { Observable } from "rxjs";
import VoxaGenerator from "../VoxaGenerator";
global.Promise = bluebird;

export const name = "create";
export const alias = "";
export const description = "Create a Voxa app";

const questions = [
  {
    type: "input",
    name: "appName",
    message: "Please enter the name of your app",
    validate: (answer: any) => {
      if (!answer.length) {
        return "You must set a name for your app.";
      }

      return true;
    }
  },
  {
    type: "input",
    name: "author",
    message: "Please enter your name/company",
    default: os.userInfo().username
  },
  {
    type: "confirm",
    name: "newDir",
    message: "Do you want to create the app in a new directory?",
    default: false
  },
  {
    type: "checkbox",
    name: "platform",
    message: "Which platform will the app use?",
    choices: [
      { name: "All of them", value: "all" },
      { name: "Amazon Alexa", value: "alexa", checked: true },
      { name: "Google Assistant", value: "google" },
      { name: "Telegram", value: "telegram" },
      { name: "Facebook Messenger", value: "facebook" }
    ],
    validate: (answer: []) => {
      if (answer.length < 1) {
        return "You must choose at least a platform.";
      }

      return true;
    }
  },
  {
    type: "list",
    name: "language",
    message: "Choose a language",
    choices: [
      { name: "Javascript", value: "javascript" },
      { name: "Typescript", value: "typescript" }
    ],
    default: "Javascript"
  },
  {
    type: "confirm",
    name: "voxaCli",
    message: "Will you use Voxa-CLI to generate the interacion model and publishing information?",
    default: true
  },
  {
    type: "confirm",
    name: "canFulfill",
    message: "Will you use the CanFulfillIntentRequest interface?",
    default: false
  },
  {
    type: "confirm",
    name: "saveUserInfo",
    message: "Will you use DynamoDB to save user's info?",
    default: false
  },
  {
    type: "confirm",
    name: "accountLinking",
    message: "Will you use Account Linking?",
    default: false
  },
  {
    type: "checkbox",
    name: "analytics",
    suffix: "(Hit Enter to skip this)",
    message: "What analytics will you be using for this app?",
    choices: [
      { name: "All of them", value: "all" },
      { name: "Google Analytics", value: "ga" },
      { name: "Dashbot", value: "dashbot" },
      { name: "Chatbase", value: "chatbase" }
    ]
  }
];

export async function action() {
  async function executePrompt(): Promise<any> {
    return inquirer.prompt(observe).then(async (answers: any) => {
      try {
        if (_.isUndefined(answers.newDir)) {
          answers.newDir = true; // To not change existing tests behaviour
        }
        const voxaGenerator = new VoxaGenerator(answers);
        const success = await voxaGenerator.generateProject();
        if (success) {
          showInstructionsToGetStarted(_.kebabCase(answers.appName), answers.newDir);
        } else {
          console.log("Something went wrong, try again");
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  const observe = Observable.create((obs: any) => {
    questions.map(q => obs.next(q));
    obs.complete();
  });

  await executePrompt();
}

function showInstructionsToGetStarted(folderName: string, newDir: boolean) {
  console.log("Let's get started!");
  console.log("");
  if (newDir) {
    console.log(`cd ${folderName}`);
  }
  console.log("yarn install");
  console.log("yarn watch");
  console.log("");
  console.log("Happy coding! 😀");
}
