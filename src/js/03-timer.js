// import '../sass/common.css';
// import 'modern-normalize/modern-normalize.css';
import '../sass/main.scss';
import Swal from 'sweetalert2';
import Tick from '@pqina/flip';
import '@pqina/flip/dist/flip.min.js';
import '@pqina/flip/dist/flip.min.css';
import '../sass/timer.scss';

const refs = {
  input: document.querySelector('#date-selector'),
  startBtn: document.querySelector('button[data-start]'),
  timer: document.querySelector('.timer'),

  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

let timerId = 0;
let diffInMS = 0;
let timezoneOffsetInMS = 0;
let targetTimeInMS = 0;

refs.startBtn.setAttribute('disabled', true);

refs.startBtn.addEventListener('click', onStart);
refs.input.addEventListener('input', onInput);

function onStart(e) {
  diffInMS = updateDiff();
  updateTimerInterface(diffInMS);
  timerId = setInterval(intervalCallback, 1000);
  refs.startBtn.setAttribute('disabled', true);
}

function onInput(e) {
  timezoneOffsetInMS = e.target.valueAsDate.getTimezoneOffset() * 60 * 1000;
  const selectedDateInUtcMS = e.target.valueAsDate.getTime();

  targetTimeInMS = selectedDateInUtcMS + timezoneOffsetInMS;

  // const corr = 1000 * 1 + 16 * 60 * 1000 + 23 * 60 * 60 * 1000;
  // targetTimeInMS = selectedDateInUtcMS + timezoneOffsetInMS - corr;

  diffInMS = updateDiff();

  if (diffInMS < 0) {
    Swal.fire({
      //https://sweetalert2.github.io/#download
      title: 'Error!',
      text: 'Please choose a date in the future',
      icon: 'error',
      confirmButtonText: 'Ok',
    });

    restartTimer(0);

    return;
  }

  restartTimer(diffInMS);
}

function restartTimer(newMS) {
  refs.startBtn.removeAttribute('disabled');
  clearInterval(timerId);
  timerId = 0;
  diffInMS = newMS;
  updateTimerInterface(newMS);
}

function intervalCallback() {
  if (diffInMS < 0) {
    restartTimer(0);
    return;
  }

  updateTimerInterface(diffInMS);

  diffInMS = updateDiff();

  // Скрипт должен вычислять раз в секунду сколько времени осталось до указанной даты и обновлять интерфейс, показывая четыре цифры: дни, часы, минуты и секунды в формате xx:xx:xx:xx.
  // Количество дней может состоять из более чем двух цифр.
  // Таймер должен останавливаться когда дошел до конечной даты, то есть 00:00:00:00.
  // Для подсчета значений используй готовую функцию, где ms - разница между конечной и текущей датой в миллисекундах.
}

function updateTimerInterface(diffInMS) {
  refs.days.textContent = convertMs(diffInMS).days;
  refs.hours.textContent = convertMs(diffInMS).hours;
  refs.minutes.textContent = convertMs(diffInMS).minutes;
  refs.seconds.textContent = convertMs(diffInMS).seconds;
}

function updateDiff() {
  return targetTimeInMS - Date.now();
}

// setInterval(() => {
//   console.log(convertMs(Date.now()));
// }, 1000);

// Задание 2 - таймер обратного отсчета
// Напиши скрипт таймера, который ведёт обратный отсчет до определенной даты. Такой таймер может использоваться в блогах и интернет-магазинах, страницах регистрации событий, во время технического обслуживания и т. д.

// Preview

// В HTML есть готовая разметка таймера, поле для выбора конечной даты и кнопка, при клике по которой таймер должен запускаться. Добавь минимальное оформление элементов интерфейса.

// <input type="date" id="date-selector" />
// <button type="button" data-start>Start countdown</button>

// <div class="timer">
//   <div class="field">
//     <span class="value" data-days>11</span>
//     <span class="label">Days</span>
//   </div>
//   <div class="field">
//     <span class="value" data-hours>11</span><span class="label">Hours</span>
//   </div>
//   <div class="field">
//     <span class="value" data-minutes>11</span>
//     <span class="label">Minutes</span>
//   </div>
//   <div class="field">
//     <span class="value" data-seconds>11</span>
//     <span class="label">Seconds</span>
//   </div>
// </div>

// Если пользователь выбрал дату в прошлом, необходимо показать уведомление "Please choose a date in the future". Используй библиотеку sweetalert2. https://sweetalert2.github.io/#download

// Кнопка должа быть не активна до тех пор, пока пользователь не выбрал дату в будущем.
// Если выбрана валидная дата и пользователь нажал кнопку - начинается отсчет времени.
// Скрипт должен вычислять раз в секунду сколько времени осталось до указанной даты и обновлять интерфейс, показывая четыре цифры: дни, часы, минуты и секунды в формате xx:xx:xx:xx.

// Количество дней может состоять из более чем двух цифр.
// Таймер должен останавливаться когда дошел до конечной даты, то есть 00:00:00:00.
// Для подсчета значений используй готовую функцию, где ms - разница между конечной и текущей датой в миллисекундах.

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function setupFlip(tick) {
  Tick.helper.interval(function () {
    tick.value++;

    // The aria-label attribute is used
    // instead of the actual tick
    // content
    tick.root.setAttribute('aria-label', tick.value);
  }, 1000);
}

// function handleTickInit(tick) {
//   // uncomment to set labels to different language
//   /*
//         var locale = {
//             YEAR_PLURAL: 'Jaren',
//             YEAR_SINGULAR: 'Jaar',
//             MONTH_PLURAL: 'Maanden',
//             MONTH_SINGULAR: 'Maand',
//             WEEK_PLURAL: 'Weken',
//             WEEK_SINGULAR: 'Week',
//             DAY_PLURAL: 'Dagen',
//             DAY_SINGULAR: 'Dag',
//             HOUR_PLURAL: 'Uren',
//             HOUR_SINGULAR: 'Uur',
//             MINUTE_PLURAL: 'Minuten',
//             MINUTE_SINGULAR: 'Minuut',
//             SECOND_PLURAL: 'Seconden',
//             SECOND_SINGULAR: 'Seconde',
//             MILLISECOND_PLURAL: 'Milliseconden',
//             MILLISECOND_SINGULAR: 'Milliseconde'
//         };

//         for (var key in locale) {
//             if (!locale.hasOwnProperty(key)) { continue; }
//             tick.setConstant(key, locale[key]);
//         }
//         */

//   // format of due date is ISO8601
//   // https://en.wikipedia.org/wiki/ISO_8601

//   // '2018-01-31T12:00:00'        to count down to the 31st of January 2018 at 12 o'clock
//   // '2019'                       to count down to 2019
//   // '2018-01-15T10:00:00+01:00'  to count down to the 15th of January 2018 at 10 o'clock in timezone GMT+1

//   // create the countdown counter
//   var counter = Tick.count.down('2021-01-01T00:00:00+01:00');

//   counter.onupdate = function (value) {
//     tick.value = value;
//   };

//   counter.onended = function () {
//     // redirect, uncomment the next line
//     // window.location = 'my-location.html'
//     // hide counter, uncomment the next line
//     // tick.root.style.display = 'none';
//     // show message, uncomment the next line
//     // document.querySelector('.tick-onended-message').style.display = '';
//   };
// }

function handleTickInit(tick) {
  // get timer offset (if not found, set to today)
  var offset = new Date(localStorage.getItem('countdown-offset') || new Date());

  // store the offset (not really necessary but saves some if statements)
  localStorage.setItem('countdown-offset', offset);

  // time in hours the timer will run down
  var timeDuration = Tick.helper.duration(24, 'hours');

  // add 24 hours to get final deadline
  var deadline = new Date(offset.setMilliseconds(offset.getMilliseconds() + timeDuration));

  // create counter
  var counter = Tick.count.down(deadline, { format: ['h', 'm', 's'] });

  // update tick with the counter value
  counter.onupdate = function (value) {
    tick.value = value;
  };

  counter.onended = function () {
    // redirect, uncomment the next line
    // window.location = 'my-location.html'
    // hide counter, uncomment the next line
    // tick.root.style.display = 'none';
    // show message, uncomment the next line
    // document.querySelector('.tick-onended-message').style.display = '';
  };
}
