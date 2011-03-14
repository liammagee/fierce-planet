var canvas = document.getElementById('c2');
var msie = /*@cc_on!@*/0;

var links = document.querySelectorAll('li > a'), el = null;
for (var i = 0; i < links.length; i++) {
  el = links[i];

  el.setAttribute('draggable', 'true');
  el.addEventListener('dragstart', function (e) {
    e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
    e.dataTransfer.setData('Text', this.id); // required otherwise doesn't work
  }, false);
}

var world = document.querySelector('#c3');

world.addEventListener('dragstart', function (e) {
    if (e.preventDefault) e.preventDefault(); // allows us to drop
    this.className = 'over';
    e.dataTransfer.dropEffect = 'copy';
    return false;
  }, false);
world.addEventListener('dragover', function (e) {
    if (e.preventDefault) e.preventDefault(); // allows us to drop
    this.className = 'over';
    e.dataTransfer.dropEffect = 'copy';
    return false;
  }, false);
world.addEventListener('dragenter', function (e) {
    this.className = 'over';
    return false;
  }, false);
world.addEventListener('dragleave', function (e) {
    this.className = '';
  }, false);
world.addEventListener('drop', function (e) {
    if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
    this.className = '';
    dropItem(e);
  }, false);
