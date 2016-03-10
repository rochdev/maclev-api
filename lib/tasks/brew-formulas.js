'use strict';

var async = require('async');
var cache = require('../cache');
var find = require('../util/find');

module.exports = {
  run() {
    return Promise
      .all([
        find.json(`https://api.github.com/repos/homebrew/homebrew/git/trees/master`)
          .then((repo) => find.json(repo.tree.find((entry) => entry.path === 'Library').url))
          .then((library) => find.json(library.tree.find((entry) => entry.path === 'Formula').url))
          .then((formula) => formula.tree.map((file) => file.path.replace(/\.rb$/, ''))),
        find.json(`https://api.github.com/repos/homebrew/homebrew-science/git/trees/master`)
          .then(handleTap('homebrew/science')),
        find.json(`https://api.github.com/repos/homebrew/homebrew-versions/git/trees/master`)
          .then(handleTap('homebrew/versions'))
      ])
      .then((results) => Array.prototype.concat.apply([], results))
      .then((formulas) => cache.add('brew_formulas', formulas));
  }
};

function handleTap(base) {
  return (repo) => {
    return repo.tree
      .filter((file) => /\.rb$/.test(file.path))
      .map((file) => base + '/' + file.path.replace(/\.rb$/, ''));
  }
}
