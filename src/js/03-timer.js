// import '../sass/common.css';
// import 'modern-normalize/modern-normalize.css';
import '../sass/main.scss';
import Swal from 'sweetalert2';
import Tick from '@pqina/flip';
import '@pqina/flip/dist/flip.min.js';
import '@pqina/flip/dist/flip.min.css';

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

// function setupFlip(tick) {
//   Tick.helper.interval(function () {
//     tick.value++;

//     // The aria-label attribute is used
//     // instead of the actual tick
//     // content
//     tick.root.setAttribute('aria-label', tick.value);
//   }, 1000);
// }
