import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function createPromise(value, isPositive, delay) {
  const promise = new Promise((res, rej) => {
    setTimeout(() => {
      if (isPositive) {
        res(value);
      } else {
        rej(value);
      }
    });
  }, delay);

  return promise;
}

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const delayInput = form.elements.delay;
  const stateInputs = form.elements.state;

  const delay = parseInt(delayInput.value);
  let state = '';

  for (const radio of stateInputs) {
    if (radio.checked) {
      state = radio.value;
      break;
    }
  }
  const isPositive = state === 'fulfilled';

  createPromise(delay, isPositive, delay)
    .then(delayValue => {
      iziToast.show({
        backgroundColor: '#9bc272ff',
        title: '✅',
        message: `Fulfilled promise in ${delayValue}ms`,
        messageColor: '#fff',
        position: 'topRight',
        timeout: 5000,
        close: false,
        position: 'topRight',
      });
    })
    .catch(delayValue => {
      iziToast.show({
        backgroundColor: '#d26161ff',
        title: '❌',
        message: `Rejected promise in ${delayValue}ms`,
        messageColor: '#fff',
        position: 'topRight',
        timeout: 5000,
        close: false,
        position: 'topRight',
      });
    });

  form.reset();
}
