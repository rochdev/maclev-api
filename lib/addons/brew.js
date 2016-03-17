'use strict';

module.exports = function brew(options) {
  var parts = [];

  parts.push('# Homebrew');
  parts.push('ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"');
  parts.push('brew cask');
  parts.push('brew tap homebrew/versions');
  parts.push('brew tap homebrew/science');
  parts.push('brew tap caskroom/versions');

  options.brewFormulas.forEach(function(formula) {
    parts.push(`brew install ${formula}`);
  });

  options.brewCasks.forEach(function(cask) {
    parts.push(`brew cask install ${cask}`);
  });

  return parts.join('\n');
};
