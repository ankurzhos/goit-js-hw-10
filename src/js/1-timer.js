import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorIcon from '../img/errorIcon.svg';

const refs = {
  enterDateTime: document.querySelector('#datetime-picker'),
  timeface: document.querySelector('.timer'),
  startBtn: document.querySelector('button[data-start]'),
  daysTitle: document.querySelector('span[data-days]'),
  hoursTitle: document.querySelector('span[data-hours]'),
  minutesTitle: document.querySelector('span[data-minutes]'),
  secondsTitle: document.querySelector('span[data-seconds]'),
};

refs.startBtn.disabled = true;
let userSelectedDate = null;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      refs.startBtn.disabled = true;
      iziToast.show({
        title: 'Hey',
        message: 'Please choose a date in the future',
        iconUrl: errorIcon,
        backgroundColor: '#ef4040',
        messageColor: '#fff',
        titleColor: '#fff',
        messageSize: '16px',
        position: 'topRight',
        close: false,
      });
    } else {
      refs.startBtn.disabled = false;
      userSelectedDate = selectedDates[0];
    }
  },
});

const timer = {
  intervalId: null,
  isActive: false,

  start() {
    if (this.isActive) return;
    this.isActive = true;

    refs.startBtn.disabled = true;
    refs.enterDateTime.disabled = true;

    this.intervalId = setInterval(() => {
      const currentTime = new Date();
      const diffMS = userSelectedDate - currentTime;

      if (diffMS < 1000) {
        this.stop();
        return;
      }

      const result = convertMs(diffMS);
      addLeadingZero(result);
    }, 1000);
  },

  stop() {
    if (!this.isActive) return;
    this.isActive = false;
    clearInterval(this.intervalId);
    addLeadingZero({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.startBtn.disabled = true;
    refs.enterDateTime.disabled = false;
  },
};

refs.startBtn.addEventListener('click', () => {
  timer.start();
});

function addLeadingZero(value) {
  const { days, hours, minutes, seconds } = value;
  refs.daysTitle.textContent = String(days).padStart(2, '0');
  refs.hoursTitle.textContent = String(hours).padStart(2, '0');
  refs.minutesTitle.textContent = String(minutes).padStart(2, '0');
  refs.secondsTitle.textContent = String(seconds).padStart(2, '0');
}

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
