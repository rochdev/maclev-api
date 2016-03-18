'use strict';

module.exports = function(options) {
  var parts = [];
  var caskMap = {
    '6': 'java6',
    '7': 'java7',
    '8': 'java',
    '9': 'java9-beta'
  };

  parts.push(`# Java`);
  parts.push(`brew install jenv`);
  parts.push(`echo 'eval "$(jenv init -)"' >> ~/.bash_profile`);
  parts.push(`echo 'export JAVA_HOME=$(jenv javahome)' >> ~/.bash_profile`);
  parts.push(`source ~/.bash_profile`);

  options.javaVersions.forEach(function(version) {
    if (caskMap[version]) {
      parts.push(`brew cask install ${caskMap[version]}`);
      parts.push(`jenv add $(/usr/libexec/java_home -v 1.${version})`);
    }
  });

  if (options.javaVersions.length) {
    let version = options.javaDefault || options.javaVersions[0];

    parts.push(`jenv global 1.${version}`);
    parts.push(`jenv shell 1.${version}`);
  }

  return parts.join('\n');
};