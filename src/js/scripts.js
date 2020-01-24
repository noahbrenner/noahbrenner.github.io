// Make spam bots work slightly harder
(function () {
  'use strict';
  var element = document.querySelector('.email');
  var first = '\x6e\x6f\x61\x68';
  var last = '\x62\x72\x65\x6e\x6e\x65\x72';
  var email = first + '\x40' + first + last + '.com';
  element.href = 'mailto:' + email;
  element.textContent = email;
})();
