'use strict';

module.exports = function base() {
  return `mkdir /tmp/maclev
sudo -v

# Xcode Command Line Tools
xcode-select --install

# Update git push behavior
git config --global push.default simple`;
};
