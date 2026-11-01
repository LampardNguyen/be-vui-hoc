import { leave } from './ui/widgets.js';
import { stopSpeaking } from './speech.js';
import { homeScreen, tableScreen } from './screens/home.js';
import { learnScreen } from './screens/learn.js';
import { practiceScreen } from './screens/practice.js';
import { parentScreen } from './screens/parent.js';
import { gamesScreen } from './screens/games.js';
import { rewardsScreen } from './screens/rewards.js';
import { balloonScreen } from './games/balloon.js';
import { sprintScreen } from './games/sprint.js';
import { memoryScreen } from './games/memory.js';
import { bossScreen } from './games/boss.js';

// Điều hướng bằng #hash: #/table/3, #/learn/3, #/practice/mix, #/games/3, #/balloon/3, #/rewards, #/parent
const routes = {
  '': homeScreen,
  table: tableScreen,
  learn: learnScreen,
  practice: practiceScreen,
  games: gamesScreen,
  rewards: rewardsScreen,
  balloon: balloonScreen,
  sprint: sprintScreen,
  memory: memoryScreen,
  boss: bossScreen,
  parent: parentScreen,
};

function render() {
  leave();
  stopSpeaking();
  const [name = '', param] = location.hash.replace(/^#\/?/, '').split('/');
  const screen = routes[name] || homeScreen;
  document.getElementById('app').replaceChildren(screen(param));
  window.scrollTo(0, 0);
}

addEventListener('hashchange', render);
render();

// Chạy offline khi đã thêm vào màn hình chính (bỏ qua khi phát triển ở localhost để không bị cache cũ).
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
