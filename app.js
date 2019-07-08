const shell = require("shelljs");
const fs = require("fs");

const utf8 = "utf8";
const gardenName = "./garden.md";
let DATE = new Date();

// Git Auto Commit
const autoCommit = () => {
  if (shell.exec(`git commit -am "${DATE} Auto-commit"`).code !== 0) {
    shell.echo("Error: Git commit failed");
    shell.exit(1);
  }else{
    shell.exec('git push origin2 master')
  }
};

const giveWater = () => {
  return new Promise((resolve, reject) => {
    console.log("Write File ===>", `${DATE} 무럭 무럭 자라라`);
    fs.readFile(gardenName, utf8, (err, data) => {
      if (err) {
        console.warn(err);
        reject()
      }

      console.log("기존 내용 ===>", data);
      const newText = data + `${DATE} 무럭 무럭 자라라<br/>`;

      fs.writeFile(gardenName, newText, utf8, () => {
        if (err) {
          console.warn(err);
          reject()
        }else{
          resolve()
        }
      });
    });
  });
};

giveWater().then(autoCommit);

//21600000
setInterval(()=>{
  giveWater().then(autoCommit);
}, 21600000)
