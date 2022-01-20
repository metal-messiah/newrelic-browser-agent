var FRAMEWORKS = {
  REACT: 'React',
  ANGULAR: 'Angular',
  ANGULARJS: 'AngularJS',
  BACKBONE: 'Backbone',
  EMBER: 'Ember',
  VUE: 'Vue',
  METEOR: 'Meteor',
  ZEPTO: 'Zepto',
  JQUERY: 'Jquery'
}

function getFrameworks() {
  var frameworks = []
  try {
    if (detectReact()) frameworks.push(FRAMEWORKS.REACT)
    if (detectAngularJs()) frameworks.push(FRAMEWORKS.ANGULARJS)
    if (detectAngular()) frameworks.push(FRAMEWORKS.ANGULAR)
    if (window.Backbone) frameworks.push(FRAMEWORKS.BACKBONE)
    if (window.Ember) frameworks.push(FRAMEWORKS.EMBER)
    if (window.Vue) frameworks.push(FRAMEWORKS.VUE)
    if (window.Meteor) frameworks.push(FRAMEWORKS.METEOR)
    if (window.Zepto) frameworks.push(FRAMEWORKS.ZEPTO)
    if (window.jQuery) frameworks.push(FRAMEWORKS.JQUERY)
    return frameworks
  } catch (err) {
    // not supported?
  }
}

function detectReact() {
  if (!!window.React || !!window.ReactDOM || !!window.ReactRedux) return true
  if (document.querySelector('[data-reactroot], [data-reactid]')) return true
  var divs = document.querySelectorAll('body > div')
  for (var i = 0; i < divs.length; i++) {
    if (Object.keys(divs[i]).indexOf('_reactRootContainer') >= 0) return true
  }
  return false
}

function detectAngularJs() {
  if (window.angular) return true
  if (document.querySelector('.ng-binding, [ng-app], [data-ng-app], [ng-controller], [data-ng-controller], [ng-repeat], [data-ng-repeat]')) return true
  if (document.querySelector('script[src*="angular.js"], script[src*="angular.min.js"]')) return true
  return false
}

function detectAngular() {
  if (window.hasOwnProperty('ng') && window.ng.hasOwnProperty('coreTokens') && window.ng.coreTokens.hasOwnProperty('NgZone')) return true
  return !!document.querySelectorAll('[ng-version]').length
}

module.exports = getFrameworks()
