'use strict';

var cache = require('../cache');
var find = require('../util/find');

module.exports = {
  run() {
    return Promise
      .all([
        find.json(`https://api.github.com/repos/caskroom/homebrew-cask/git/trees/master`)
          .then((repo) => find.json(repo.tree.find((entry) => entry.path === 'Casks').url))
          .then((casks) => {
            return casks.tree
              .filter((file) => /\.rb$/.test(file.path))
              .map((file) => file.path.replace(/\.rb$/, ''));
          }),
        find.json(`https://api.github.com/repos/caskroom/homebrew-versions/git/trees/master`)
          .then((repo) => find.json(repo.tree.find((entry) => entry.path === 'Casks').url))
          .then((casks) => {
            return casks.tree
              .filter((file) => /\.rb$/.test(file.path))
              .map((file) => 'caskroom/versions/' + file.path.replace(/\.rb$/, ''));
          })
      ])
      .then((casks) => cache.add('brew_casks', casks));
  }
};
