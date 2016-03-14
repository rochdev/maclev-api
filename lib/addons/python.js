'use strict';

module.exports = function(options) {
  var parts = [];

  parts.push(`# Python`);
  parts.push(`brew install readline`);
  parts.push(`brew install pyenv`);
  parts.push(`echo 'eval "$(pyenv init -)"' >> ~/.bash_profile`);
  parts.push(`source ~/.bash_profile`);

  options.pythonVersions.forEach(function(version) {
    parts.push(`pyenv install ${version}`);
  });

  if (options.pythonVersions.length) {
    let version = options.pythonDefault || options.pythonVersions[0];

    parts.push(`pyenv global ${version}`);
    parts.push(`pyenv shell ${version}`);
  }

  options.pythonPackages.forEach(function(pkg) {
    parts.push(`pip install ${pkg}`);
  });

  return parts.join('\n');
};
