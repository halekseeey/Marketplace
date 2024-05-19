import chalk from 'chalk'

export class Logger {
    info(info: string) {
        console.log(chalk.blue(info))
    }

    warn(warn: string) {
        console.log(chalk.yellow(warn))
    }

    error(error: string) {
        console.log(chalk.red(error))
    }
}