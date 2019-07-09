// .env
require('dotenv').config()

const shell = require('shelljs')
const fs = require('fs')
const Slack = require('slack-node');
const schedule = require('node-schedule')
const dayjs = require('dayjs')

// Format
const utf8 = 'utf8'
// Garden File Name
const gardenName = 'garden.md'
let DATE

// Slack
const webhookUri = process.env.WEB_HOOK_API
const tokenApi = process.env.TOKEN_API
const slack = new Slack(tokenApi)
slack.setWebhook(webhookUri)

// Water Water
const giveWater = () => {
  return new Promise((resolve, reject) => {
    console.log('Write File ===>', `${DATE} 무럭 무럭 자라라`);
    fs.readFile(gardenName, utf8, (err, data) => {
      if (err) {
        console.warn(err)
        reject()
      }

      console.log("기존 내용 ===>", data);
      const newText = data + `${DATE} 무럭 무럭 자라라<br/> \n`

      fs.writeFile(gardenName, newText, utf8, () => {
        if (err) {
          console.warn(err)
          reject()
        } else {
          resolve()
        }
      });
    });
  });
};

// Git Auto Commit
const autoCommit = () => {
  return new Promise((resolve, reject) => {
    if (shell.exec(shell.exec(`git commit -am "${DATE} Auto-commit"`).code !== 0) {
      shell.echo("Error: Git commit failed");
      shell.exit(1)

      reject()
    } else {
      shell.exec("git push origin2 master")
      resolve()
    }
  });
};

// Send Message to Slack
const sendMessage = async () => {
  slack.webhook(
    {
      text: 'Gardener-Noti',
      attachments: [
        {
          fallback:
            'GitHub으로 확인하기: <https://github.com/SeonHyungJo/gardener>',
          pretext:
            'GitHub으로 확인하기: <https://github.com/SeonHyungJo/gardener>',
          color: '#00FFFF',
          fields: [
            {
              title: `알림`,
              value: `${DATE} 정원에 물을 주었습니다.`,
              short: false
            }
          ]
        }
      ]
    },
    function(err, response) {
      err ? console.log(err) : console.log(response);
    }
  );
};



schedule.scheduleJob('* */6 * * *', function() {
  DATE = dayjs(new Date).format(`YYYY년 MM월 DD일 HH:mm:ss`)

  console.log(DATE, '=====물주기를 시작합니다.=====')

  giveWater()
    .then(autoCommit)
    .then(sendMessage)
    .catch((err) => {
      console.log(err)
    });
});
