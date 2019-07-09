# Gardener

**미니 정원사 고용!!** 😁
<br/>

## 정원관리 시작하기

```shell
# start Gardener
npm start 

# start Gardener dev
npm run dev
```

## 파일 구성

- `app.js` : 모든 정원관리에 대한 로직이 있는 파일(**write file**, **auto commit**, **send message_slack**)
- `garden.md` : 정원관리 일지 & 실질적으로 커밋을 하는 파일
- `.env` : 슬랙에 대한 WEB_HOOK_API와 TOKEN_API를 저장한 환경변수 파일

## 사용한 라이브러리

#### package.json

```json
"dayjs": "^1.8.15",
"dotenv": "^8.0.0",
"node-schedule": "^1.3.2",
"nodemon": "^1.19.1",
"shelljs": "^0.8.3",
"slack-node": "^0.1.8"
```

### dayjs

날짜에 대한 포맷팅을 도와주는 라이브러리로 사람들이 많이 사용하는 [moment.js](https://momentjs.com/)가 있지만 현재 진행하는 프로젝트는 미니 프로젝트로 큰 용량을 요구하는 라이브러리 대신 상대적으로 용량이 적은 day.js를 사용하였다.

```js
dayjs(new Date).format(`YYYY년 MM월 DD일 HH:mm:ss`)
```

### dotenv

슬랙에 메시지를 보내는 기능을 만들면서 생성한 **WEB_HOOK_API**, **TOKEN_API**를 레퍼지토리에 올려서 공개할 수 없으므로 .env 숨김 파일을 만들어서 작성한 뒤 불러와서 사용할 수 있도록 도와주는 dotenv 라이브러리를 사용했다.

```js
const webhookUri = process.env.WEB_HOOK_API
const tokenApi = process.env.TOKEN_API
```

### node-schedule

주기적으로 커밋을 찍기 위해서는 반복적으로 일을 해줄 수 있는 타이머가 필요하다.

기본적으로 사용하는 `setInterval()`을 사용해서 맨 처음에 작성을 하였으나, 이쁘게 작성할 수 있는 포맷팅을 지원하여 사용하게 되었다. 

```js
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
```

`node-schedule` 라이브러리 내부적으로는 `setTimeOut()`으로 작성을 하고 있는 듯하다.

> [setTimeOut() 살펴보기](https://github.com/node-schedule/node-schedule/blob/cb5a08d4329f5f328cd094ca072ad7711811ece1/lib/schedule.js#L506

### nodemon

관련 파일의 변경사항이 있으면 서버를 재시작해주는 라이브러리인 `nodemon`을 사용하여 개발하는 시간을 줄였다.

```js
"dev": "nodemon app.js"
```

확실히 관련 라이브러리를 사용하게 되면 테스트에도 유용하다.

### shell.js

> ShellJS is a portable (Windows/Linux/OS X) implementation of Unix shell commands on top of the Node.js API. You can use it to eliminate your shell script's dependency on Unix while still keeping its familiar and powerful commands. You can also install it globally so you can run it from outside Node projects - say goodbye to those gnarly Bash scripts!

간단하게 말하자면 nodejs에서 shell script를 간편하게 사용하도록 도와주는 라이브러리이다.

git을 사용하는 데 있어서 script를 작성하는 데 도움을 주었다.

```js
shell.exec(`git add ${gardenName}`)
shell.exec(`git commit -m "${DATE} Auto-commit"`)
shell.exec("git push origin2 master")
```

### slack-node

정원을 관리하는 데 있어 언제 물을 주는지를 알고 싶었다.

현재 사용하고 있는 개인 슬랙 채널에 알림이 오게 하는 것을 도와주는 라이브러리를 추가하였다.

```js
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
```

---

#### Reference

- [NPM - dayjs](https://www.npmjs.com/package/dayjs)
- [NPM - dotenv](https://www.npmjs.com/package/dotenv)
- [NPM - node-schedule](https://www.npmjs.com/package/node-schedule)
- [NPM - shelljs](https://www.npmjs.com/package/shelljs)
- [NPM - slack-node](https://www.npmjs.com/package/slack-node)
- [NODEJS Download - nodejs](https://nodejs.org/ko/download/)