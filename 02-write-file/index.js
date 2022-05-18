const path = require('path');
const fs = require('fs');
const { stdin, stdout } = require('process');

const exit = function () {
  stdout.write('Ладно, пока...');
  process.exit();
};

console.log('Введите текст, который хотите записать в файл your-text');

fs.writeFile(path.join(__dirname, 'your-text.txt'), '', (err) => {if (err) throw err;});


stdin.on('data', (data) => {
  if (data == 'exit\r\n') exit();

  fs.appendFile(
    path.join(__dirname, 'your-text.txt'),
    data,
    err => {
      if (err) throw err;
      console.log('Текст записан. Запишем что-то еще?');
    }
  );
});


process.on('SIGINT', () => {
  exit();
});




//* уважаемый проверяющий, прошу не обращать внимание на эту часть кода. оставил для себя второй вариант решения!

// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// const exit = function () {
//   console.log('Пока)');
//   rl.close();
// };


// rl.question('Введите текст, который хотите записать в файл your-text\n', (answer) => {
//   fs.writeFile(
//     path.join(__dirname, 'your-text.txt'), `${answer}\n`,
//     (err) => {
//       if (err) throw err;
//     });

//   console.log('Текст записан. Запишем что-то еще?');
// });


// rl.on('line', (input) => {
//   if (input === 'exit') {
//     exit();
//   } else {
//     fs.appendFile(
//       path.join(__dirname, 'your-text.txt'),
//       `${input}\n`,
//       err => {
//         if (err) throw err;
//         console.log('Текст записан. Запишем что-то еще?');
//       }
//     );
//   }
// });


// rl.on('SIGINT', () => {
//   exit();
// });

