import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
// import ora from 'ora';
import chalk from 'chalk';
import { rspack } from '@rspack/core';
import { RspackDevServer } from '@rspack/dev-server';
import mainConfig from './config/main';
import { rootDir } from './tools';
import rendererConfig from './config/renderer';
import { DevServer } from './setting';

let electronProcess: any = null;
let manualRestart = false;

const startRenderer = async () => {
  // const spinner = ora().start();
  // spinner.color = 'yellow';
  // spinner.text = chalk.yellow('启动renderer...');
  // await sleep(2000);
  // spinner.succeed('启动renderer成功');
  return new Promise(resolve => {
    const compiler = rspack(
      rendererConfig(true, {
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    );
    const server = new RspackDevServer(DevServer as any, compiler);

    server.startCallback(() => {
      console.log('Successfully started server on http://localhost:2333');
      resolve(1);
    });
  });
};

const compileMain = async () => {
  return new Promise(resolve => {
    const compiler = rspack(
      mainConfig(true, {
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    );
    compiler.watch(
      {
        aggregateTimeout: 300,
        poll: undefined,
      },
      async (err: any, stats) => {
        if (err && err?.details) {
          console.log(chalk.red('main error details:'), err.details);
          return;
        }
        if (stats?.hasErrors()) {
          console.log(chalk.red('main error stats:'), stats.toString());
          return;
        }
        console.log(chalk.green('main log:'), stats?.toString());
        console.log(chalk.green('编译main成功'));

        if (electronProcess && electronProcess.kill) {
          manualRestart = true;
          const processClosePromise = new Promise<void>(resolveClose => {
            electronProcess.once('close', () => {
              resolveClose();
            });
          });
          process.kill(electronProcess.pid);
          await processClosePromise;
          electronProcess = null;
          startMain();
        }
        resolve(0);
      },
    );
  });
};

const startMain = async () => {
  const mainPath = resolve(rootDir, 'dist/app/index.js');
  if (!existsSync(mainPath)) {
    console.log(chalk.red(`错误: 文件不存在: ${mainPath}`));
    process.exit(1);
  }
  electronProcess = spawn('electron', [mainPath]);
  // 有没有监听启动成功的事件？
  electronProcess.on('spawn', () => {
    console.log(chalk.green(`electron进程[${electronProcess.pid}]已启动`));
  });
  electronProcess.stdout.on('data', (data: any) => {
    console.log(data.toString());
  });
  electronProcess.stderr.on('data', (data: any) => {
    console.log(chalk.red(data.toString()));
  });
  // //   正常情况下，electron进程先exit再close
  // electronProcess.on("exit", (e) => {
  //   console.log(chalk.yellow("electron进程已退出"));
  // });
  electronProcess.on('close', (code: number) => {
    console.log(chalk.yellow(`electron进程[${electronProcess.pid}]已关闭, 退出码: ${code}`));
    if (manualRestart) {
      manualRestart = false;
    } else {
      process.exit(0);
    }
  });
  electronProcess.on('error', (err: Error) => {
    console.log(chalk.red(`electron进程启动失败: ${err}`));
    process.exit(1);
  });
};
const start = async () => {
  await startRenderer();
  await compileMain();
  await startMain();
};

start();
