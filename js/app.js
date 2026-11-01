import { leave } from './ui/widgets.js';
import { stopSpeaking } from './speech.js';
import { homeScreen, tableScreen } from './screens/home.js';
import { learnScreen } from './screens/learn.js';
import { practiceScreen } from './screens/practice.js';
import { parentScreen } from './screens/parent.js';
import { balloonScreen } from './games/balloon.js';

// Điều hướng bằng #hash: #/table/3, #/learn/3, #/practice/mix, #/balloon/3m, #/parent
const routes = {
  '': homeScreen,
  table: tableScreen,
  learn: learnScreen,
  practice: practiceScreen,
  balloon: balloonScreen,
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
