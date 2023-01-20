const readline = require('readline');
const fs = require('fs').promises;

const { program } = require('commander');
require('colors');

// launch the program with: node game.js -f my_log.txt
program.option(
    '-f, --file [type]',
    'file for saving game results',
    'results.txt',
);
program.parse(process.argv);
 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let count = 0;
const logFile = program.opts().file; // file to save the result
const mind = Math.floor(Math.random() * 10) + 1;

const isValid = value => {
    if (isNaN(value)) {
        console.log('Enter the number'.red);
        return false;
    }
    if (value < 1 || value > 10) {
        console.log('The number must be between 1 and 10'.red);
        return false;
    }
    return true;
}

// async log fn is responsible for saving game results
const log = async data => {
    try {
        await fs.appendFile(logFile, `${data}\n`);
        console.log(`We save the result into the ${logFile} file`.green)
    } catch (e) {
        console.log(`Failed to save the ${logFile} file`.red);
    }
};

//  the main game fn with rl.question(query[, options])
const game = () => {
    rl.question(
        'Enter the number between 1 and 10 for quess my number: '.yellow,
        value => {
            let a = +value;
            if (!isValid(a)) {
                game();
                return;
            }
            count += 1;
            if (a === mind) {
                console.log('Congratulation! You quessed the number in %d time(s)'.green, count)
                log(
                    `${new Date().toLocaleDateString()}: Congratulation! You quessed the number in ${count} time(s)`
                ).finally(() => rl.close());
                return;
            }
            console.log('You didn not guess, one more try'.red);
            game()
        },
    );
};

game()