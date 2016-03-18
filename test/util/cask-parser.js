'use strict';

var sinon = require('sinon');
var chaiAsPromised = require('chai-as-promised');
var expect = require('chai').use(chaiAsPromised).expect;
var mockery = require('mockery');

describe('Cask Parser', function() {
  var parser;
  var request;
  var url;

  before(function() {
    request = {
      get: sinon.stub(),
      end: sinon.stub()
    };

    url = 'https://raw.githubusercontent.com/caskroom/homebrew-cask/master/Casks/foo-bar.rb';

    mockery.enable({useCleanCache: true});
    mockery.registerMock('../request', request);
    mockery.registerAllowable('../../lib/util/cask-parser');
  });

  beforeEach(function() {
    request.get.withArgs(url).returns(request);

    parser = require('../../lib/util/cask-parser');
  });

  afterEach(function() {
    request.get.reset();
    request.end.reset();
  });

  after(function() {
    mockery.disable();
  });

  it('should return the correct result', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3'
  url 'http://foo-bar.com/download'
  name 'Foo Bar'
  pkg 'Foo Bar.pkg'
  app 'Foo Bar.app'
end`
    }));

    return expect(parser.parse(url)).to.eventually.deep.equal({
      version: '1.2.3',
      url: 'http://foo-bar.com/download',
      name: 'Foo Bar',
      pkg: 'Foo Bar.pkg',
      app: 'Foo Bar.app'
    });
  });

  it('should always return the last found value for a key', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3'
  url 'http://foo-bar.com/download'
  name 'Foo'
  name 'Bar'
  name 'Foo Bar'
end`
    }));

    return expect(parser.parse(url)).to.eventually.deep.equal({
      version: '1.2.3',
      url: 'http://foo-bar.com/download',
      name: 'Foo Bar'
    });
  });

  it('should extract binaries', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3'
  url 'http://foo-bar.com/download'
  binary 'Foo Bar.app/Contents/Resources/app/foo.sh', target: 'foo'
  binary 'Foo Bar.app/Contents/Resources/app/bar.sh', target: 'bar'
end`
    }));

    return parser.parse(url).then((result) => {
      expect(result).to.have.property('binary');
      expect(result.binary).to.have.property('Foo Bar.app/Contents/Resources/app/foo.sh', 'foo');
      expect(result.binary).to.have.property('Foo Bar.app/Contents/Resources/app/bar.sh', 'bar');
    });
  });

  it('should handle version variable replacement in URL', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3'
  url 'http://foo-bar.com/#{version}/download'
end`
    }));

    return expect(parser.parse(url)).to.eventually.have.property('url', 'http://foo-bar.com/1.2.3/download');
  });

  it('should handle version variable replacement in URL (after comma only)', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3,456'
  url 'http://foo-bar.com/#{version.after_comma}/download'
end`
    }));

    return expect(parser.parse(url)).to.eventually.have.property('url', 'http://foo-bar.com/456/download');
  });

  it('should handle version variable replacement in URL (major minor only)', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3'
  url 'http://foo-bar.com/#{version.major_minor}/download'
end`
    }));

    return expect(parser.parse(url)).to.eventually.have.property('url', 'http://foo-bar.com/1.2/download');
  });

  it('should handle version variable replacement in URL (before dash only)', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3-456'
  url "http://foo-bar.com/#{version.sub(%r{-.*}, '')}/download"
end`
    }));

    return expect(parser.parse(url)).to.eventually.have.property('url', 'http://foo-bar.com/1.2.3/download');
  });

  it('should handle version variable replacement in URL (first word only)', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3'
  url 'http://foo-bar.com/#{version[%r{^\\w+}]}/download'
end`
    }));

    return expect(parser.parse(url)).to.eventually.have.property('url', 'http://foo-bar.com/1/download');
  });

  it('should handle version variable replacement in URL (replacing dots with underscores)', function() {
    request.end.returns(Promise.resolve({
      text: `cask 'foo-bar' do
  version '1.2.3'
  url "http://foo-bar.com/#{version.gsub('.', '_')}/download"
end`
    }));

    return expect(parser.parse(url)).to.eventually.have.property('url', 'http://foo-bar.com/1_2_3/download');
  });
});

