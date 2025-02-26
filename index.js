const {spawn} = require('child_process');

try {
    const electron = spawn('electron', ['dist/main/index.js']);

electron.stdout.on('data', (data) => {
  console.log(data.toString());
});
electron.stderr.on('data', (data) => {
  console.error(data.toString());
});

electron.on('exit', (code) => {
  console.log(`electron进程已退出，退出码：${code}`);
});
} catch (error) {
    console.log(333333,error);
    
}