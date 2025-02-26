import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import ora from "ora";
import chalk from "chalk";
import { rspack } from "@rspack/core";
import mainConfig from "./config/main";
import { rootDir } from "./tools";

let electronProcess: any = null;
let manualRestart = false;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const startRenderer = async () => {
  const spinner = ora().start();
  spinner.color = "yellow";
  spinner.text = chalk.yellow("启动renderer...");
  await sleep(2000);
  spinner.succeed("启动renderer成功");
};

const compileMain = async () => {
//   const spinner = ora().start();
//   spinner.color = "yellow";
//   spinner.text = chalk.yellow("编译main...");
  //   await sleep(2000);

  return new Promise((resolve, reject) => {
    const compiler = rspack(
      mainConfig(true, {
        "process.env.NODE_ENV": JSON.stringify("development"),
      })
    );
    compiler.watch(
      {
        aggregateTimeout: 300,
        poll: undefined,
      },
      (err: any, stats) => {
        if (err || (stats && stats.hasErrors())) {
          console.log(chalk.red("error:"), err?.stack || err);
          if (err?.details) {
            console.log(chalk.red("error details:"), err.details);
          } else if (stats) {
            console.log(chalk.red("error stats:"), stats.toString());
          }
          //   throw new Error("Error occured in main process");
          return;
        }
        // console.log(2323232,stats?.toString());
        // spinner.succeed("编译main成功");
        // if (electronProcess && electronProcess.kill) {
        //     manualRestart = true;
        //     process.kill(electronProcess.pid);
        //     electronProcess = null;
        //     startElectron();
        //     setTimeout(() => {
        //       manualRestart = false;
        //     }, 5000);
        //   }
        resolve(0);
      }
    );
  });
};

const startElectron = async () => {
  const mainPath = resolve(rootDir, "dist/main/index.js");
  if (!existsSync(mainPath)) {
    console.log(chalk.red(`错误: 文件不存在: ${mainPath}`));
    process.exit(1);
  }
  
  // 确保使用字符串，而不是变量
  const electronProcess = spawn('electron', [mainPath]);
  
  electronProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  electronProcess.stderr.on("data", (data) => {
    console.log(chalk.red(data.toString()));
  });
  electronProcess.on("exit", (e) => {
    console.log("[main exit]");
  });
  electronProcess.on("close", (code) => {
    console.log(chalk.green(`electron进程已关闭, 退出码: ${code}`));
  });
  electronProcess.on("error", (err) => {
    console.log(chalk.red(`electron进程启动失败: ${err}`));
  });
  //   const spinner = ora().start();
  //   spinner.color = "yellow";
  //   spinner.text = chalk.yellow("启动electron...");
  //   await sleep(2000);
  //   spinner.succeed("启动electron成功");
};
const start = async () => {
  //   console.time('dev');
  //   await startRenderer();
  //   await startMain();
  //   console.timeEnd('dev');
  await compileMain();
//   await startElectron();
  //   await startElectron();
};

start();
