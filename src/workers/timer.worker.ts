let timer: NodeJS.Timeout | null = null;
let timeLeft: number = 25 * 60;
let isRunning: boolean = false;

self.onmessage = (e) => {
  const { type, data } = e.data;
  
  switch (type) {
    case 'START':
      isRunning = true;
      timeLeft = data.timeLeft;
      startTimer();
      break;
    case 'PAUSE':
      isRunning = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      break;
    case 'RESET':
      isRunning = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      timeLeft = data.timeLeft;
      self.postMessage({ type: 'TICK', timeLeft });
      break;
    case 'UPDATE_TIME':
      timeLeft = data.timeLeft;
      break;
  }
};

function startTimer() {
  if (timer) clearInterval(timer);
  
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      self.postMessage({ type: 'TICK', timeLeft });
    } else {
      isRunning = false;
      clearInterval(timer!);
      timer = null;
      self.postMessage({ type: 'COMPLETE' });
    }
  }, 1000);
} 