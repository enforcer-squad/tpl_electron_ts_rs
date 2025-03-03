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
      async (err: any, stats) => {
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
        console.log(stats?.toString());
        // spinner.succeed("编译main成功");

        if (electronProcess && electronProcess.kill) {
          manualRestart = true;
          const processClosePromise = new Promise<void>((resolveClose) => {
            electronProcess.once("close", () => {
              resolveClose();
            });
          });
          process.kill(electronProcess.pid);
          await processClosePromise;
          electronProcess = null;
          startElectron();
        }
        resolve(0);
      }
    );
  });
};

const startElectron = async () => {
  const mainPath = resolve(rootDir, "dist/app/index.js");
  if (!existsSync(mainPath)) {
    console.log(chalk.red(`错误: 文件不存在: ${mainPath}`));
    process.exit(1);
  }
  electronProcess = spawn("electron", [mainPath]);
  // 有没有监听启动成功的事件？
  electronProcess.on("spawn", () => {
    console.log(chalk.green(`electron进程[${electronProcess.pid}]已启动`));
  });
  electronProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  electronProcess.stderr.on("data", (data) => {
    console.log(chalk.red(data.toString()));
  });
  // //   正常情况下，electron进程先exit再close
  // electronProcess.on("exit", (e) => {
  //   console.log(chalk.yellow("electron进程已退出"));
  // });
  electronProcess.on("close", (code) => {
    console.log(chalk.yellow(`electron进程[${electronProcess.pid}]已关闭, 退出码: ${code}`));
    if (manualRestart) {
      manualRestart = false;
    } else {
      process.exit(0);
    }
  });
  electronProcess.on("error", (err) => {
    console.log(chalk.red(`electron进程启动失败: ${err}`));
    process.exit(1);
  });
};
const start = async () => {
  //   console.time('dev');
  //   await startRenderer();
  //   await startMain();
  //   console.timeEnd('dev');
  await compileMain();
  await startElectron();
  //   await startElectron();
};

start();
