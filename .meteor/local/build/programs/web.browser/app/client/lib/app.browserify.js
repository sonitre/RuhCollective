(function(){(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
ReactRouter = require("react-router");

ReactRouter.lib = {
    BrowserHistory: require("react-router/lib/BrowserHistory")
};
},{"react-router":24,"react-router/lib/BrowserHistory":4}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.loopAsync = loopAsync;
exports.mapAsync = mapAsync;
exports.hashAsync = hashAsync;

function loopAsync(turns, work, callback) {
  var currentTurn = 0;
  var isDone = false;

  function done() {
    isDone = true;
    callback.apply(this, arguments);
  }

  function next() {
    if (isDone) return;

    if (currentTurn < turns) {
      currentTurn += 1;
      work.call(this, currentTurn - 1, next, done);
    } else {
      done.apply(this, arguments);
    }
  }

  next();
}

function mapAsync(array, work, callback) {
  var length = array.length;
  var values = [];

  if (length === 0) return callback(null, values);

  var isDone = false;
  var doneCount = 0;

  function done(index, error, value) {
    if (isDone) return;

    if (error) {
      isDone = true;
      callback(error);
    } else {
      values[index] = value;

      isDone = ++doneCount === length;

      if (isDone) callback(null, values);
    }
  }

  array.forEach(function (item, index) {
    work(item, index, function (error, value) {
      done(index, error, value);
    });
  });
}

function hashAsync(object, work, callback) {
  var keys = Object.keys(object);

  mapAsync(keys, function (key, index, callback) {
    work(object[key], callback);
  }, function (error, valuesArray) {
    if (error) {
      callback(error);
    } else {
      var values = valuesArray.reduce(function (memo, results, index) {
        memo[keys[index]] = results;
        return memo;
      }, {});

      callback(null, values);
    }
  });
}
},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _DOMHistory2 = require('./DOMHistory');

var _DOMHistory3 = _interopRequireDefault(_DOMHistory2);

var _DOMUtils = require('./DOMUtils');

var _NavigationTypes = require('./NavigationTypes');

var _NavigationTypes2 = _interopRequireDefault(_NavigationTypes);

function updateCurrentState(extraState) {
  var state = window.history.state;

  if (state) window.history.replaceState(_extends(state, extraState), '');
}

/**
 * A history implementation for DOM environments that support the
 * HTML5 history API (pushState, replaceState, and the popstate event).
 * Provides the cleanest URLs and should always be used in browser
 * environments if possible.
 *
 * Note: BrowserHistory automatically falls back to using full page
 * refreshes if HTML5 history is not available, so URLs are always
 * the same across browsers.
 */

var BrowserHistory = (function (_DOMHistory) {
  function BrowserHistory(options) {
    _classCallCheck(this, BrowserHistory);

    _DOMHistory.call(this, options);
    this.handlePopState = this.handlePopState.bind(this);
    this.isSupported = (0, _DOMUtils.supportsHistory)();
  }

  _inherits(BrowserHistory, _DOMHistory);

  BrowserHistory.prototype._updateLocation = function _updateLocation(navigationType) {
    var state = null;

    if (this.isSupported) {
      var historyState = window.history.state;
      state = this._createState(historyState);

      if (!historyState || !historyState.key) window.history.replaceState(state, '');
    }

    this.location = this.createLocation((0, _DOMUtils.getWindowPath)(), state, navigationType);
  };

  BrowserHistory.prototype.setup = function setup() {
    if (this.location == null) this._updateLocation();
  };

  BrowserHistory.prototype.handlePopState = function handlePopState(event) {
    if (event.state === undefined) return; // Ignore extraneous popstate events in WebKit.

    this._updateLocation(_NavigationTypes2['default'].POP);
    this._notifyChange();
  };

  BrowserHistory.prototype.addChangeListener = function addChangeListener(listener) {
    _DOMHistory.prototype.addChangeListener.call(this, listener);

    if (this.changeListeners.length === 1) {
      if (window.addEventListener) {
        window.addEventListener('popstate', this.handlePopState, false);
      } else {
        window.attachEvent('onpopstate', this.handlePopState);
      }
    }
  };

  BrowserHistory.prototype.removeChangeListener = function removeChangeListener(listener) {
    _DOMHistory.prototype.removeChangeListener.call(this, listener);

    if (this.changeListeners.length === 0) {
      if (window.removeEventListener) {
        window.removeEventListener('popstate', this.handlePopState, false);
      } else {
        window.detachEvent('onpopstate', this.handlePopState);
      }
    }
  };

  // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-pushstate

  BrowserHistory.prototype.pushState = function pushState(state, path) {
    if (this.isSupported) {
      updateCurrentState(this.getScrollPosition());

      state = this._createState(state);

      window.history.pushState(state, '', path);
      this.location = this.createLocation(path, state, _NavigationTypes2['default'].PUSH);
      this._notifyChange();
    } else {
      window.location = path;
    }
  };

  // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-replacestate

  BrowserHistory.prototype.replaceState = function replaceState(state, path) {
    if (this.isSupported) {
      state = this._createState(state);

      window.history.replaceState(state, '', path);
      this.location = this.createLocation(path, state, _NavigationTypes2['default'].REPLACE);
      this._notifyChange();
    } else {
      window.location.replace(path);
    }
  };

  return BrowserHistory;
})(_DOMHistory3['default']);

var history = new BrowserHistory();
exports.history = history;
exports['default'] = BrowserHistory;
},{"./DOMHistory":5,"./DOMUtils":6,"./NavigationTypes":11}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _History2 = require('./History');

var _History3 = _interopRequireDefault(_History2);

var _DOMUtils = require('./DOMUtils');

/**
 * A history interface that assumes a DOM environment.
 */

var DOMHistory = (function (_History) {
  function DOMHistory() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, DOMHistory);

    _History.call(this, options);
    this.getScrollPosition = options.getScrollPosition || _DOMUtils.getWindowScrollPosition;
  }

  _inherits(DOMHistory, _History);

  DOMHistory.prototype.go = function go(n) {
    if (n === 0) return;

    window.history.go(n);
  };

  return DOMHistory;
})(_History3['default']);

exports['default'] = DOMHistory;
module.exports = exports['default'];
},{"./DOMUtils":6,"./History":7}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.getHashPath = getHashPath;
exports.replaceHashPath = replaceHashPath;
exports.getWindowPath = getWindowPath;
exports.getWindowScrollPosition = getWindowScrollPosition;
exports.setWindowScrollPosition = setWindowScrollPosition;
exports.supportsHistory = supportsHistory;
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

exports.canUseDOM = canUseDOM;

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  return window.location.href.split('#')[1] || '';
}

function replaceHashPath(path) {
  window.location.replace(window.location.pathname + window.location.search + '#' + path);
}

function getWindowPath() {
  return window.location.pathname + window.location.search;
}

function getWindowScrollPosition() {
  return {
    scrollX: window.pageXOffset || document.documentElement.scrollLeft,
    scrollY: window.pageYOffset || document.documentElement.scrollTop
  };
}

function setWindowScrollPosition(scrollX, scrollY) {
  window.scrollTo(scrollX, scrollY);
}

/**
 * taken from modernizr
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/rackt/react-router/issues/586
 */

function supportsHistory() {
  var ua = navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }
  return window.history && 'pushState' in window.history;
}
},{}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _URLUtils = require('./URLUtils');

var _Location = require('./Location');

var _Location2 = _interopRequireDefault(_Location);

var RequiredHistorySubclassMethods = ['pushState', 'replaceState', 'go'];

function createRandomKey() {
  return Math.random().toString(36).substr(2);
}

/**
 * A history interface that normalizes the differences across
 * various environments and implementations. Requires concrete
 * subclasses to implement the following methods:
 *
 * - pushState(state, path)
 * - replaceState(state, path)
 * - go(n)
 */

var History = (function () {
  function History() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, History);

    RequiredHistorySubclassMethods.forEach(function (method) {
      (0, _invariant2['default'])(typeof this[method] === 'function', '%s needs a "%s" method', this.constructor.name, method);
    }, this);

    this.parseQueryString = options.parseQueryString || _URLUtils.parseQueryString;
    this.changeListeners = [];
    this.location = null;
  }

  History.prototype._notifyChange = function _notifyChange() {
    for (var i = 0, len = this.changeListeners.length; i < len; ++i) this.changeListeners[i].call(this);
  };

  History.prototype.addChangeListener = function addChangeListener(listener) {
    this.changeListeners.push(listener);
  };

  History.prototype.removeChangeListener = function removeChangeListener(listener) {
    this.changeListeners = this.changeListeners.filter(function (li) {
      return li !== listener;
    });
  };

  History.prototype.back = function back() {
    this.go(-1);
  };

  History.prototype.forward = function forward() {
    this.go(1);
  };

  History.prototype._createState = function _createState(state) {
    state = state || {};

    if (!state.key) state.key = createRandomKey();

    return state;
  };

  History.prototype.createLocation = function createLocation(path, state, navigationType) {
    var pathname = (0, _URLUtils.getPathname)(path);
    var queryString = (0, _URLUtils.getQueryString)(path);
    var query = queryString ? this.parseQueryString(queryString) : null;
    return new _Location2['default'](pathname, query, state, navigationType);
  };

  return History;
})();

exports['default'] = History;
module.exports = exports['default'];
},{"./Location":9,"./URLUtils":23,"invariant":25}],8:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _React$PropTypes = _react2['default'].PropTypes;
var object = _React$PropTypes.object;
var string = _React$PropTypes.string;
var func = _React$PropTypes.func;

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * <Link> components are used to create an <a> element that links to a route.
 * When that route is active, the link gets an "active" class name (or the
 * value of its `activeClassName` prop).
 *
 * For example, assuming you have the following route:
 *
 *   <Route name="showPost" path="/posts/:postID" handler={Post}/>
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along query string parameters
 * using the `query` prop.
 *
 *   <Link to="/posts/123" query={{ show:true }}/>
 */
var Link = _react2['default'].createClass({
  displayName: 'Link',

  contextTypes: {
    router: object
  },

  propTypes: {
    activeStyle: object,
    activeClassName: string,
    to: string.isRequired,
    query: object,
    state: object,
    onClick: func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      activeClassName: 'active',
      style: {}
    };
  },

  handleClick: function handleClick(event) {
    var allowTransition = true;
    var clickResult;

    if (this.props.onClick) clickResult = this.props.onClick(event);

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

    if (clickResult === false || event.defaultPrevented === true) allowTransition = false;

    event.preventDefault();

    if (allowTransition) this.context.router.transitionTo(this.props.to, this.props.query, this.props.state);
  },

  render: function render() {
    var router = this.context.router;
    var _props = this.props;
    var to = _props.to;
    var query = _props.query;

    var props = _extends({}, this.props, {
      href: router.makeHref(to, query),
      onClick: this.handleClick
    });

    // ignore if rendered outside of the context of a router, simplifies unit testing
    if (router && router.isActive(to, query)) {
      if (props.activeClassName) props.className += props.className !== '' ? ' ' + props.activeClassName : props.activeClassName;

      if (props.activeStyle) props.style = _extends({}, props.style, props.activeStyle);
    }

    return _react2['default'].createElement('a', props);
  }

});

exports.Link = Link;
exports['default'] = Link;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _NavigationTypes = require('./NavigationTypes');

var _NavigationTypes2 = _interopRequireDefault(_NavigationTypes);

/**
 * A Location answers two important questions:
 *
 * 1. Where am I?
 * 2. How did I get here?
 */

var Location = (function () {
  function Location() {
    var pathname = arguments[0] === undefined ? '/' : arguments[0];
    var query = arguments[1] === undefined ? null : arguments[1];
    var state = arguments[2] === undefined ? null : arguments[2];
    var navigationType = arguments[3] === undefined ? _NavigationTypes2['default'].POP : arguments[3];

    _classCallCheck(this, Location);

    this.pathname = pathname;
    this.query = query;
    this.state = state;
    this.navigationType = navigationType;
  }

  Location.isLocation = function isLocation(object) {
    return object instanceof Location;
  };

  return Location;
})();

exports['default'] = Location;
module.exports = exports['default'];
},{"./NavigationTypes":11}],10:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var object = _react2['default'].PropTypes.object;

/**
 * A mixin for components that modify the URL.
 *
 * Example:
 *
 *   import { Navigation } from 'react-router';
 *
 *   var MyLink = React.createClass({
 *     mixins: [ Navigation ],
 *     handleClick(event) {
 *       event.preventDefault();
 *       this.transitionTo('aRoute', { the: 'params' }, { the: 'query' });
 *     },
 *     render() {
 *       return (
 *         <a onClick={this.handleClick}>Click me!</a>
 *       );
 *     }
 *   });
 */
var Navigation = {

  contextTypes: {
    router: object.isRequired
  }

};

var RouterNavigationMethods = ['makePath', 'makeHref', 'transitionTo', 'replaceWith', 'go', 'goBack', 'goForward'];

RouterNavigationMethods.forEach(function (method) {
  Navigation[method] = function () {
    var router = this.context.router;
    return router[method].apply(router, arguments);
  };
});

exports['default'] = Navigation;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var NavigationTypes = (0, _keymirror2['default'])({

  /**
   * Indicates that navigation was caused by a call to history.push.
   */
  PUSH: null,

  /**
   * Indicates that navigation was caused by a call to history.replace.
   */
  REPLACE: null,

  /**
   * Indicates that navigation was caused by some other action such
   * as using a browser's back/forward buttons and/or manually manipulating
   * the URL in a browser's location bar. This is the default.
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
   * for more information.
   */
  POP: null

});

exports['default'] = NavigationTypes;
module.exports = exports['default'];
},{"keymirror":26}],12:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _Location = require('./Location');

var _Location2 = _interopRequireDefault(_Location);

var _History = require('./History');

var _History2 = _interopRequireDefault(_History);

var _React$PropTypes = _react2['default'].PropTypes;
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;
var arrayOf = _React$PropTypes.arrayOf;
var instanceOf = _React$PropTypes.instanceOf;
var oneOfType = _React$PropTypes.oneOfType;
var element = _React$PropTypes.element;

function falsy(props, propName, componentName) {
  if (props[propName]) return new Error('<' + componentName + '> should not have a "' + propName + '" prop');
}

var component = func;
var components = oneOfType([component, object]);
var history = instanceOf(_History2['default']);
var location = instanceOf(_Location2['default']);
var route = oneOfType([object, element]);
var routes = oneOfType([route, arrayOf(route)]);

module.exports = {
  falsy: falsy,
  component: component,
  components: components,
  history: history,
  location: location,
  route: route,
  routes: routes
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./History":7,"./Location":9}],13:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _URLUtils = require('./URLUtils');

var _PropTypes = require('./PropTypes');

var _React$PropTypes = _react2['default'].PropTypes;
var string = _React$PropTypes.string;
var object = _React$PropTypes.object;
var Redirect = _react2['default'].createClass({
  displayName: 'Redirect',

  statics: {

    createRouteFromReactElement: function createRouteFromReactElement(element) {
      var route = (0, _RouteUtils.createRouteFromReactElement)(element);

      if (route.from) route.path = route.from;

      route.onEnter = function (nextState, transition) {
        var location = nextState.location;
        var params = nextState.params;

        var pathname = route.to ? (0, _URLUtils.formatPattern)(route.to, params) : location.pathname;

        transition.to(pathname, route.query || location.query, route.state || location.state);
      };

      return route;
    }

  },

  propTypes: {
    path: string,
    from: string, // Alias for path
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _PropTypes.falsy,
    children: _PropTypes.falsy
  },

  render: function render() {
    (0, _invariant2['default'])(false, '<Redirect> elements are for router configuration only and should not be rendered');
  }

});

exports.Redirect = Redirect;
exports['default'] = Redirect;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./PropTypes":12,"./RouteUtils":15,"./URLUtils":23,"invariant":25}],14:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _PropTypes = require('./PropTypes');

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _React$PropTypes = _react2['default'].PropTypes;
var string = _React$PropTypes.string;
var bool = _React$PropTypes.bool;
var func = _React$PropTypes.func;

/**
 * A <Route> is used to declare which components are rendered to the page when
 * the URL matches a given pattern.
 *
 * Routes are arranged in a nested tree structure. When a new URL is requested,
 * the tree is searched depth-first to find a route whose path matches the URL.
 * When one is found, all routes in the tree that lead to it are considered
 * "active" and their components are rendered into the DOM, nested in the same
 * order as they are in the tree.
 */
var Route = _react2['default'].createClass({
  displayName: 'Route',

  statics: {

    createRouteFromReactElement: function createRouteFromReactElement(element) {
      var route = (0, _RouteUtils.createRouteFromReactElement)(element);

      if (route.handler) {
        (0, _warning2['default'])(false, '<Route handler> is deprecated, use <Route component> instead');
        route.component = route.handler;
        delete route.handler;
      }

      return route;
    }

  },

  propTypes: {
    path: string,
    ignoreScrollBehavior: bool,
    handler: _PropTypes.component,
    component: _PropTypes.component,
    components: _PropTypes.components,
    getComponents: func
  },

  render: function render() {
    (0, _invariant2['default'])(false, '<Route> elements are for router configuration only and should not be rendered');
  }

});

exports.Route = Route;
exports['default'] = Route;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./PropTypes":12,"./RouteUtils":15,"invariant":25,"warning":32}],15:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.isReactChildren = isReactChildren;
exports.createRouteFromReactElement = createRouteFromReactElement;
exports.createRoutesFromReactChildren = createRoutesFromReactChildren;
exports.createRoutes = createRoutes;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function isValidChild(object) {
  return object == null || (0, _react.isValidElement)(object);
}

function isReactChildren(object) {
  return isValidChild(object) || Array.isArray(object) && object.every(isValidChild);
}

function checkPropTypes(componentName, propTypes, props) {
  componentName = componentName || 'UnknownComponent';

  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      var error = propTypes[propName](props, propName, componentName);

      if (error instanceof Error) (0, _warning2['default'])(false, error.message);
    }
  }
}

function createRouteFromReactElement(element) {
  var type = element.type;
  var route = _extends({}, type.defaultProps, element.props);

  if (type.propTypes) checkPropTypes(type.displayName || type.name, type.propTypes, route);

  if (route.children) {
    route.childRoutes = createRoutesFromReactChildren(route.children);
    delete route.children;
  }

  return route;
}

/**
 * Creates and returns a routes object from the given ReactChildren. JSX
 * provides a convenient way to visualize how routes in the hierarchy are
 * nested.
 *
 *   import { Route, createRoutesFromReactChildren } from 'react-router';
 *   
 *   var routes = createRoutesFromReactChildren(
 *     <Route component={App}>
 *       <Route path="home" component={Dashboard}/>
 *       <Route path="news" component={NewsFeed}/>
 *     </Route>
 *   );
 *
 * Note: This method is automatically used when you provide <Route> children
 * to a <Router> component.
 */

function createRoutesFromReactChildren(children) {
  var routes = [];

  _react2['default'].Children.forEach(children, function (element) {
    if ((0, _react.isValidElement)(element)) {
      // Component classes may have a static create* method.
      if (element.type.createRouteFromReactElement) {
        routes.push(element.type.createRouteFromReactElement(element));
      } else {
        routes.push(createRouteFromReactElement(element));
      }
    }
  });

  return routes;
}

/**
 * Creates and returns an array of routes from the given object which
 * may be a JSX route, a plain object route, or an array of either.
 */

function createRoutes(routes) {
  if (isReactChildren(routes)) {
    routes = createRoutesFromReactChildren(routes);
  } else if (!Array.isArray(routes)) {
    routes = [routes];
  }

  return routes;
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"warning":32}],16:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _AsyncUtils = require('./AsyncUtils');

var _RouteUtils = require('./RouteUtils');

var _RoutingUtils = require('./RoutingUtils');

var _PropTypes = require('./PropTypes');

var _RouterContextMixin = require('./RouterContextMixin');

var _RouterContextMixin2 = _interopRequireDefault(_RouterContextMixin);

var _ScrollManagementMixin = require('./ScrollManagementMixin');

var _ScrollManagementMixin2 = _interopRequireDefault(_ScrollManagementMixin);

var _Location = require('./Location');

var _Transition = require('./Transition');

var _Transition2 = _interopRequireDefault(_Transition);

var _React$PropTypes = _react2['default'].PropTypes;
var arrayOf = _React$PropTypes.arrayOf;
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;

function runTransition(prevState, routes, location, hooks, callback) {
  var transition = new _Transition2['default']();

  (0, _RoutingUtils.getState)(routes, location, function (error, nextState) {
    if (error || nextState == null || transition.isCancelled) {
      callback(error, null, transition);
    } else {
      nextState.location = location;

      var transitionHooks = (0, _RoutingUtils.getTransitionHooks)(prevState, nextState);
      if (Array.isArray(hooks)) transitionHooks.unshift.apply(transitionHooks, hooks);

      (0, _AsyncUtils.loopAsync)(transitionHooks.length, function (index, next, done) {
        transitionHooks[index](nextState, transition, function (error) {
          if (error || transition.isCancelled) {
            done(error); // No need to continue.
          } else {
            next();
          }
        });
      }, function (error) {
        if (error || transition.isCancelled) {
          callback(error, null, transition);
        } else {
          (0, _RoutingUtils.getComponents)(nextState.branch, function (error, components) {
            if (error || transition.isCancelled) {
              callback(error, null, transition);
            } else {
              nextState.components = components;
              callback(null, nextState, transition);
            }
          });
        }
      });
    }
  });
}

var Router = _react2['default'].createClass({
  displayName: 'Router',

  mixins: [_RouterContextMixin2['default'], _ScrollManagementMixin2['default']],

  statics: {

    /**
     * Runs a transition to the given location using the given routes and
     * transition hooks (optional) and calls callback(error, state, transition)
     * when finished. This is primarily useful for server-side rendering.
     */
    run: function run(routes, location, transitionHooks, callback) {
      if (typeof transitionHooks === 'function') {
        callback = transitionHooks;
        transitionHooks = null;
      }

      (0, _invariant2['default'])(typeof callback === 'function', 'Router.run needs a callback');

      runTransition(null, routes, location, transitionHooks, callback);
    }

  },

  propTypes: {
    createElement: func.isRequired,
    onAbort: func,
    onError: func,
    onUpdate: func,

    // Client-side
    history: _PropTypes.history,
    routes: _PropTypes.routes,
    // Routes may also be given as children (JSX)
    children: _PropTypes.routes,

    // Server-side
    location: _PropTypes.location,
    branch: _PropTypes.routes,
    params: object,
    components: arrayOf(_PropTypes.components)
  },

  getDefaultProps: function getDefaultProps() {
    return {
      createElement: _react.createElement
    };
  },

  getInitialState: function getInitialState() {
    return {
      isTransitioning: false,
      location: null,
      branch: null,
      params: null,
      components: null
    };
  },

  _updateState: function _updateState(location) {
    var _this = this;

    (0, _invariant2['default'])((0, _Location.isLocation)(location), 'A <Router> needs a valid Location');

    var hooks = this.transitionHooks;
    if (hooks) hooks = hooks.map(function (hook) {
      return (0, _RoutingUtils.createTransitionHook)(hook, _this);
    });

    this.setState({ isTransitioning: true });

    runTransition(this.state, this.routes, location, hooks, function (error, state, transition) {
      if (error) {
        _this.handleError(error);
      } else if (transition.isCancelled) {
        if (transition.redirectInfo) {
          var _transition$redirectInfo = transition.redirectInfo;
          var pathname = _transition$redirectInfo.pathname;
          var query = _transition$redirectInfo.query;
          var state = _transition$redirectInfo.state;

          _this.replaceWith(pathname, query, state);
        } else {
          (0, _invariant2['default'])(_this.state.location, 'You may not abort the initial transition');

          _this.handleAbort(transition.abortReason);
        }
      } else if (state == null) {
        (0, _warning2['default'])(false, 'Location "%s" did not match any routes', location.pathname);
      } else {
        _this.setState(state, _this.props.onUpdate);
      }

      _this.setState({ isTransitioning: false });
    });
  },

  /**
   * Adds a transition hook that runs before all route hooks in a
   * transition. The signature is the same as route transition hooks.
   */
  addTransitionHook: function addTransitionHook(hook) {
    if (!this.transitionHooks) this.transitionHooks = [];

    this.transitionHooks.push(hook);
  },

  /**
   * Removes the given transition hook.
   */
  removeTransitionHook: function removeTransitionHook(hook) {
    if (this.transitionHooks) this.transitionHooks = this.transitionHooks.filter(function (h) {
      return h !== hook;
    });
  },

  handleAbort: function handleAbort(reason) {
    if (this.props.onAbort) {
      this.props.onAbort.call(this, reason);
    } else {
      // The best we can do here is goBack so the location state reverts
      // to what it was. However, we also set a flag so that we know not
      // to run through _updateState again since state did not change.
      this._ignoreNextHistoryChange = true;
      this.goBack();
    }
  },

  handleError: function handleError(error) {
    if (this.props.onError) {
      this.props.onError.call(this, error);
    } else {
      // Throw errors by default so we don't silently swallow them!
      throw error; // This error probably originated in getChildRoutes or getComponents.
    }
  },

  handleHistoryChange: function handleHistoryChange() {
    if (this._ignoreNextHistoryChange) {
      this._ignoreNextHistoryChange = false;
    } else {
      this._updateState(this.props.history.location);
    }
  },

  componentWillMount: function componentWillMount() {
    var _props = this.props;
    var history = _props.history;
    var routes = _props.routes;
    var children = _props.children;
    var location = _props.location;
    var branch = _props.branch;
    var params = _props.params;
    var components = _props.components;

    if (history) {
      (0, _invariant2['default'])(routes || children, 'Client-side <Router>s need routes. Try using <Router routes> or ' + 'passing your routes as nested <Route> children');

      this.routes = (0, _RouteUtils.createRoutes)(routes || children);

      if (typeof history.setup === 'function') history.setup();

      // We need to listen first in case we redirect immediately.
      if (history.addChangeListener) history.addChangeListener(this.handleHistoryChange);

      this._updateState(history.location);
    } else {
      (0, _invariant2['default'])(location && branch && params && components, 'Server-side <Router>s need location, branch, params, and components ' + 'props. Try using Router.run to get all the props you need');

      this.setState({ location: location, branch: branch, params: params, components: components });
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    (0, _invariant2['default'])(this.props.history === nextProps.history, '<Router history> may not be changed');

    if (nextProps.history) {
      var currentRoutes = this.props.routes || this.props.children;
      var nextRoutes = nextProps.routes || nextProps.children;

      if (currentRoutes !== nextRoutes) {
        this.routes = (0, _RouteUtils.createRoutes)(nextRoutes);

        // Call this here because _updateState
        // uses this.routes to determine state.
        if (nextProps.history.location) this._updateState(nextProps.history.location);
      }
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    var history = this.props.history;

    if (history && history.removeChangeListener) history.removeChangeListener(this.handleHistoryChange);
  },

  _createElement: function _createElement(component, props) {
    return typeof component === 'function' ? this.props.createElement(component, props) : null;
  },

  render: function render() {
    var _this2 = this;

    var _state = this.state;
    var branch = _state.branch;
    var params = _state.params;
    var components = _state.components;

    var element = null;

    if (components) {
      element = components.reduceRight(function (element, components, index) {
        if (components == null) return element; // Don't create new children; use the grandchildren.

        var route = branch[index];
        var routeParams = (0, _RoutingUtils.getRouteParams)(route, params);
        var props = _extends({}, _this2.state, { route: route, routeParams: routeParams });

        if ((0, _react.isValidElement)(element)) {
          props.children = element;
        } else if (element) {
          // In render, do var { header, sidebar } = this.props;
          _extends(props, element);
        }

        if (typeof components === 'object') {
          var elements = {};

          for (var key in components) if (components.hasOwnProperty(key)) elements[key] = _this2._createElement(components[key], props);

          return elements;
        }

        return _this2._createElement(components, props);
      }, element);
    }

    (0, _invariant2['default'])(element === null || element === false || (0, _react.isValidElement)(element), 'The root route must render a single element');

    return element;
  }

});

exports['default'] = Router;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./AsyncUtils":3,"./Location":9,"./PropTypes":12,"./RouteUtils":15,"./RouterContextMixin":17,"./RoutingUtils":18,"./ScrollManagementMixin":19,"./Transition":21,"invariant":25,"warning":32}],17:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _URLUtils = require('./URLUtils');

var _React$PropTypes = _react2['default'].PropTypes;
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;

function pathnameIsActive(pathname, activePathname) {
  if ((0, _URLUtils.stripLeadingSlashes)(activePathname).indexOf((0, _URLUtils.stripLeadingSlashes)(pathname)) === 0) return true; // This quick comparison satisfies most use cases.

  // TODO: Implement a more stringent comparison that checks
  // to see if the pathname matches any routes (and params)
  // in the currently active branch.

  return false;
}

function queryIsActive(query, activeQuery) {
  if (activeQuery == null) return query == null;

  if (query == null) return true;

  for (var p in query) if (query.hasOwnProperty(p) && String(query[p]) !== String(activeQuery[p])) return false;

  return true;
}

var RouterContextMixin = {

  propTypes: {
    stringifyQuery: func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      stringifyQuery: _URLUtils.stringifyQuery
    };
  },

  childContextTypes: {
    router: object.isRequired
  },

  getChildContext: function getChildContext() {
    return {
      router: this
    };
  },

  /**
   * Returns a full URL path from the given pathname and query.
   */
  makePath: function makePath(pathname, query) {
    if (query) {
      if (typeof query !== 'string') query = this.props.stringifyQuery(query);

      if (query !== '') return pathname + '?' + query;
    }

    return pathname;
  },

  /**
   * Returns a string that may safely be used to link to the given
   * pathname and query.
   */
  makeHref: function makeHref(pathname, query) {
    var path = this.makePath(pathname, query);
    var history = this.props.history;

    if (history && history.makeHref) return history.makeHref(path);

    return path;
  },

  /**
   * Pushes a new Location onto the history stack.
   */
  transitionTo: function transitionTo(pathname, query) {
    var state = arguments[2] === undefined ? null : arguments[2];
    var history = this.props.history;

    (0, _invariant2['default'])(history, 'Router#transitionTo is client-side only (needs history)');

    history.pushState(state, this.makePath(pathname, query));
  },

  /**
   * Replaces the current Location on the history stack.
   */
  replaceWith: function replaceWith(pathname, query) {
    var state = arguments[2] === undefined ? null : arguments[2];
    var history = this.props.history;

    (0, _invariant2['default'])(history, 'Router#replaceWith is client-side only (needs history)');

    history.replaceState(state, this.makePath(pathname, query));
  },

  /**
   * Navigates forward/backward n entries in the history stack.
   */
  go: function go(n) {
    var history = this.props.history;

    (0, _invariant2['default'])(history, 'Router#go is client-side only (needs history)');

    history.go(n);
  },

  /**
   * Navigates back one entry in the history stack. This is identical to
   * the user clicking the browser's back button.
   */
  goBack: function goBack() {
    this.go(-1);
  },

  /**
   * Navigates forward one entry in the history stack. This is identical to
   * the user clicking the browser's forward button.
   */
  goForward: function goForward() {
    this.go(1);
  },

  /**
   * Returns true if a <Link> to the given pathname/query combination is
   * currently active.
   */
  isActive: function isActive(pathname, query) {
    var location = this.state.location;

    if (location == null) return false;

    return pathnameIsActive(pathname, location.pathname) && queryIsActive(query, location.query);
  }

};

exports['default'] = RouterContextMixin;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./URLUtils":23,"invariant":25}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.getState = getState;
exports.createTransitionHook = createTransitionHook;
exports.getTransitionHooks = getTransitionHooks;
exports.getComponents = getComponents;
exports.getRouteParams = getRouteParams;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _URLUtils = require('./URLUtils');

var _AsyncUtils = require('./AsyncUtils');

function getChildRoutes(route, locationState, callback) {
  if (route.childRoutes) {
    callback(null, route.childRoutes);
  } else if (route.getChildRoutes) {
    route.getChildRoutes(locationState, callback);
  } else {
    callback();
  }
}

function getIndexRoute(route, locationState, callback) {
  if (route.indexRoute) {
    callback(null, route.indexRoute);
  } else if (route.getIndexRoute) {
    route.getIndexRoute(callback, locationState);
  } else {
    callback();
  }
}

function assignParams(params, paramNames, paramValues) {
  return paramNames.reduceRight(function (params, paramName, index) {
    var paramValue = paramValues[index];

    if (Array.isArray(params[paramName])) {
      params[paramName].unshift(paramValue);
    } else if (paramName in params) {
      params[paramName] = [paramValue, params[paramName]];
    } else {
      params[paramName] = paramValue;
    }

    return params;
  }, params);
}

function createParams(paramNames, paramValues) {
  return assignParams({}, paramNames, paramValues);
}

function matchRouteDeep(route, pathname, locationState, callback) {
  var _matchPattern = (0, _URLUtils.matchPattern)(route.path, pathname);

  var remainingPathname = _matchPattern.remainingPathname;
  var paramNames = _matchPattern.paramNames;
  var paramValues = _matchPattern.paramValues;

  var isExactMatch = remainingPathname === '';

  if (isExactMatch && route.path) {
    var params = createParams(paramNames, paramValues);
    var branch = [route];

    getIndexRoute(route, locationState, function (error, indexRoute) {
      if (error) {
        callback(error);
      } else {
        if (indexRoute) branch.push(indexRoute);

        callback(null, { params: params, branch: branch });
      }
    });
  } else if (remainingPathname != null) {
    // This route matched at least some of the path.
    getChildRoutes(route, locationState, function (error, childRoutes) {
      if (error) {
        callback(error);
      } else if (childRoutes) {
        // Check the child routes to see if any of them match.
        matchRoutes(childRoutes, remainingPathname, locationState, function (error, match) {
          if (error) {
            callback(error);
          } else if (match) {
            // A child route matched! Augment the match and pass it up the stack.
            assignParams(match.params, paramNames, paramValues);
            match.branch.unshift(route);
            callback(null, match);
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
}

function matchRoutes(routes, pathname, locationState, callback) {
  routes = (0, _RouteUtils.createRoutes)(routes);

  (0, _AsyncUtils.loopAsync)(routes.length, function (index, next, done) {
    matchRouteDeep(routes[index], pathname, locationState, function (error, match) {
      if (error || match) {
        done(error, match);
      } else {
        next();
      }
    });
  }, callback);
}

/**
 * Asynchronously matches the given location to a set of routes and calls
 * callback(error, state) when finished. The state object may have the
 * following properties:
 *
 * - branch       An array of routes that matched, in hierarchical order
 * - params       An object of URL parameters
 *
 * Note: This operation may return synchronously if no routes have an
 * asynchronous getChildRoutes method.
 */

function getState(routes, location, callback) {
  matchRoutes(routes, (0, _URLUtils.stripLeadingSlashes)(location.pathname), location.state, callback);
}

function routeParamsChanged(route, prevState, nextState) {
  if (!route.path) return false;

  var paramNames = (0, _URLUtils.getParamNames)(route.path);

  return paramNames.some(function (paramName) {
    return prevState.params[paramName] !== nextState.params[paramName];
  });
}

/**
 * Runs a diff on the two router states and returns an array of two
 * arrays: 1) the routes that we are leaving, starting with the leaf
 * route and 2) the routes that we are entering, ending with the leaf
 * route.
 */
function computeDiff(prevState, nextState) {
  var fromRoutes = prevState && prevState.branch;
  var toRoutes = nextState.branch;

  var leavingRoutes, enteringRoutes;
  if (fromRoutes) {
    leavingRoutes = fromRoutes.filter(function (route) {
      return toRoutes.indexOf(route) === -1 || routeParamsChanged(route, prevState, nextState);
    });

    // onLeave hooks start at the leaf route.
    leavingRoutes.reverse();

    enteringRoutes = toRoutes.filter(function (route) {
      return fromRoutes.indexOf(route) === -1 || leavingRoutes.indexOf(route) !== -1;
    });
  } else {
    leavingRoutes = [];
    enteringRoutes = toRoutes;
  }

  return [leavingRoutes, enteringRoutes];
}

function createTransitionHook(fn, context) {
  return function (nextState, transition, callback) {
    if (fn.length > 2) {
      fn.call(context, nextState, transition, callback);
    } else {
      // Assume fn executes synchronously and
      // automatically call the callback for them.
      fn.call(context, nextState, transition);
      callback();
    }
  };
}

function getTransitionHooksFromRoutes(routes, hookName) {
  return routes.reduce(function (hooks, route) {
    if (route[hookName]) hooks.push(createTransitionHook(route[hookName], route));

    return hooks;
  }, []);
}

/**
 * Compiles and returns an array of transition hook functions that
 * should be called before we transition to a new state. Transition
 * hook signatures are:
 *
 *   - route.onLeave(nextState, transition[, callback ])
 *   - route.onEnter(nextState, transition[, callback ])
 *
 * Transition hooks run in order from the leaf route in the branch
 * we're leaving, up the tree to the common parent route, and back
 * down the branch we're entering to the leaf route.
 *
 * If a transition hook needs to execute asynchronously it may have
 * a 3rd argument that it should call when it is finished. Otherwise
 * the transition executes synchronously.
 */

function getTransitionHooks(prevState, nextState) {
  var _computeDiff = computeDiff(prevState, nextState);

  var leavingRoutes = _computeDiff[0];
  var enteringRoutes = _computeDiff[1];

  var hooks = getTransitionHooksFromRoutes(leavingRoutes, 'onLeave');

  hooks.push.apply(hooks, getTransitionHooksFromRoutes(enteringRoutes, 'onEnter'));

  return hooks;
}

function getComponentsForRoute(route, callback) {
  if (route.component || route.components) {
    callback(null, route.component || route.components);
  } else if (route.getComponents) {
    route.getComponents(callback);
  } else {
    callback();
  }
}

/**
 * Asynchronously fetches all components needed for the given router
 * state and calls callback(error, components) when finished.
 *
 * Note: This operation may return synchronously if no routes have an
 * asynchronous getComponents method.
 */

function getComponents(routes, callback) {
  (0, _AsyncUtils.mapAsync)(routes, function (route, index, callback) {
    getComponentsForRoute(route, callback);
  }, callback);
}

/**
 * Extracts an object of params the given route cares about from
 * the given params object.
 */

function getRouteParams(route, params) {
  var routeParams = {};

  if (!route.path) return routeParams;

  var paramNames = (0, _URLUtils.getParamNames)(route.path);

  for (var p in params) if (params.hasOwnProperty(p) && paramNames.indexOf(p) !== -1) routeParams[p] = params[p];

  return routeParams;
}
},{"./AsyncUtils":3,"./RouteUtils":15,"./URLUtils":23,"invariant":25}],19:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _DOMUtils = require('./DOMUtils');

var _NavigationTypes = require('./NavigationTypes');

var _NavigationTypes2 = _interopRequireDefault(_NavigationTypes);

var func = _react2['default'].PropTypes.func;

function getCommonAncestors(branch, otherBranch) {
  return branch.filter(function (route) {
    return otherBranch.indexOf(route) !== -1;
  });
}

function shouldUpdateScrollPosition(state, prevState) {
  var location = state.location;
  var branch = state.branch;
  var prevLocation = prevState.location;
  var prevBranch = prevState.branch;

  // When an onEnter hook uses transition.to to redirect
  // on the initial load prevLocation is null, so assume
  // we don't want to update the scroll position.
  if (prevLocation === null) return false;

  // Don't update scroll position if only the query has changed.
  if (location.pathname === prevLocation.pathname) return false;

  // Don't update scroll position if any of the ancestors
  // has `ignoreScrollPosition` set to `true` on the route.
  var sharedAncestors = getCommonAncestors(branch, prevBranch);
  if (sharedAncestors.some(function (route) {
    return route.ignoreScrollBehavior;
  })) return false;

  return true;
}

function updateWindowScrollPosition(navigationType, scrollX, scrollY) {
  if (_DOMUtils.canUseDOM) {
    if (navigationType === _NavigationTypes2['default'].POP) {
      (0, _DOMUtils.setWindowScrollPosition)(scrollX, scrollY);
    } else {
      (0, _DOMUtils.setWindowScrollPosition)(0, 0);
    }
  }
}

var ScrollManagementMixin = {

  propTypes: {
    shouldUpdateScrollPosition: func.isRequired,
    updateScrollPosition: func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      shouldUpdateScrollPosition: shouldUpdateScrollPosition,
      updateScrollPosition: updateWindowScrollPosition
    };
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var location = this.state.location;

    var locationState = location && location.state;

    if (locationState && this.props.shouldUpdateScrollPosition(this.state, prevState)) {
      var scrollX = locationState.scrollX;
      var scrollY = locationState.scrollY;

      this.props.updateScrollPosition(location.navigationType, scrollX || 0, scrollY || 0);
    }
  }

};

exports['default'] = ScrollManagementMixin;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./DOMUtils":6,"./NavigationTypes":11}],20:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var object = _react2['default'].PropTypes.object;

/**
 * A mixin for components that need to know the path, routes, URL
 * params and query that are currently active.
 *
 * Example:
 *
 *   import { State } from 'react-router';
 *
 *   var AboutLink = React.createClass({
 *     mixins: [ State ],
 *     render() {
 *       var className = this.props.className;
 *
 *       if (this.isActive('about'))
 *         className += ' is-active';
 *
 *       return React.createElement('a', { className: className }, this.props.children);
 *     }
 *   });
 */
var State = {

  contextTypes: {
    router: object.isRequired
  }

};

var RouterStateMethods = ['isActive'];

RouterStateMethods.forEach(function (method) {
  State[method] = function () {
    var router = this.context.router;
    return router[method].apply(router, arguments);
  };
});

exports['default'] = State;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],21:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transition = (function () {
  function Transition() {
    _classCallCheck(this, Transition);

    this.isCancelled = false;
    this.redirectInfo = null;
    this.abortReason = null;
  }

  Transition.prototype.to = function to(pathname, query, state) {
    this.redirectInfo = { pathname: pathname, query: query, state: state };
    this.isCancelled = true;
  };

  Transition.prototype.abort = function abort(reason) {
    this.abortReason = reason;
    this.isCancelled = true;
  };

  return Transition;
})();

exports["default"] = Transition;
module.exports = exports["default"];
},{}],22:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React']['require'] : typeof global !== "undefined" ? global['React']['require'] : null)("react");

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var object = _react2['default'].PropTypes.object;

var TransitionHook = {

  contextTypes: {
    router: object.isRequired
  },

  componentDidMount: function componentDidMount() {
    (0, _warning2['default'])(typeof this.routerWillLeave === 'function', 'Components that mixin TransitionHook should have a routerWillLeave method, check %s', this.constructor.displayName || this.constructor.name);

    if (this.routerWillLeave) this.context.router.addTransitionHook(this.routerWillLeave);
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.routerWillLeave) this.context.router.removeTransitionHook(this.routerWillLeave);
  }

};

exports['default'] = TransitionHook;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"warning":32}],23:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.stringifyQuery = stringifyQuery;
exports.getPathname = getPathname;
exports.getQueryString = getQueryString;
exports.stripLeadingSlashes = stripLeadingSlashes;
exports.isAbsolutePath = isAbsolutePath;
exports.compilePattern = compilePattern;
exports.matchPattern = matchPattern;
exports.getParamNames = getParamNames;
exports.getParams = getParams;
exports.formatPattern = formatPattern;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var parseQueryString = _qs2['default'].parse;

exports.parseQueryString = parseQueryString;

function stringifyQuery(query) {
  return _qs2['default'].stringify(query, { arrayFormat: 'brackets' });
}

var queryMatcher = /\?([\s\S]*)$/;

function getPathname(path) {
  return path.replace(queryMatcher, '');
}

function getQueryString(path) {
  var match = path.match(queryMatcher);
  return match ? match[1] : '';
}

function stripLeadingSlashes(path) {
  return path ? path.replace(/^\/+/, '') : '';
}

function isAbsolutePath(path) {
  return typeof path === 'string' && path.charAt(0) === '/';
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeSource(string) {
  return escapeRegExp(string).replace(/\/+/g, '/+');
}

function _compilePattern(pattern) {
  var regexpSource = '';
  var paramNames = [];
  var tokens = [];

  var match,
      lastIndex = 0,
      matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*|\(|\)/g;
  while (match = matcher.exec(pattern)) {
    if (match.index !== lastIndex) {
      tokens.push(pattern.slice(lastIndex, match.index));
      regexpSource += escapeSource(pattern.slice(lastIndex, match.index));
    }

    if (match[1]) {
      regexpSource += '([^/?#]+)';
      paramNames.push(match[1]);
    } else if (match[0] === '*') {
      regexpSource += '([\\s\\S]*?)';
      paramNames.push('splat');
    } else if (match[0] === '(') {
      regexpSource += '(?:';
    } else if (match[0] === ')') {
      regexpSource += ')?';
    }

    tokens.push(match[0]);

    lastIndex = matcher.lastIndex;
  }

  if (lastIndex !== pattern.length) {
    tokens.push(pattern.slice(lastIndex, pattern.length));
    regexpSource += escapeSource(pattern.slice(lastIndex, pattern.length));
  }

  return {
    pattern: pattern,
    regexpSource: regexpSource,
    paramNames: paramNames,
    tokens: tokens
  };
}

var CompiledPatternsCache = {};

function compilePattern(pattern) {
  if (!(pattern in CompiledPatternsCache)) CompiledPatternsCache[pattern] = _compilePattern(pattern);

  return CompiledPatternsCache[pattern];
}

/**
 * Attempts to match a pattern on the given pathname. Patterns may use
 * the following special characters:
 *
 * - :paramName     Matches a URL segment up to the next /, ?, or #. The
 *                  captured string is considered a "param"
 * - ()             Wraps a segment of the URL that is optional
 * - *              Consumes (non-greedy) all characters up to the next
 *                  character in the pattern, or to the end of the URL if
 *                  there is none
 *
 * The return value is an object with the following properties:
 *
 * - remainingPathname
 * - paramNames
 * - paramValues
 */

function matchPattern(pattern, pathname) {
  var _compilePattern2 = compilePattern(stripLeadingSlashes(pattern));

  var regexpSource = _compilePattern2.regexpSource;
  var paramNames = _compilePattern2.paramNames;
  var tokens = _compilePattern2.tokens;

  regexpSource += '/*'; // Ignore trailing slashes

  var captureRemaining = tokens[tokens.length - 1] !== '*';

  if (captureRemaining) regexpSource += '([\\s\\S]*?)';

  var match = pathname.match(new RegExp('^' + regexpSource + '$', 'i'));

  var remainingPathname, paramValues;
  if (match != null) {
    paramValues = Array.prototype.slice.call(match, 1).map(function (v) {
      return v != null ? decodeURIComponent(v.replace(/\+/g, '%20')) : v;
    });

    if (captureRemaining) {
      remainingPathname = paramValues.pop();
    } else {
      remainingPathname = pathname.replace(match[0], '');
    }
  } else {
    remainingPathname = paramValues = null;
  }

  return {
    remainingPathname: remainingPathname,
    paramNames: paramNames,
    paramValues: paramValues
  };
}

function getParamNames(pattern) {
  return compilePattern(pattern).paramNames;
}

function getParams(pattern, pathname) {
  var _matchPattern = matchPattern(pattern, stripLeadingSlashes(pathname));

  var paramNames = _matchPattern.paramNames;
  var paramValues = _matchPattern.paramValues;

  if (paramValues != null) {
    return paramNames.reduce(function (memo, paramName, index) {
      memo[paramName] = paramValues[index];
      return memo;
    }, {});
  }

  return null;
}

/**
 * Returns a version of the given pattern with params interpolated. Throws
 * if there is a dynamic segment of the pattern for which there is no param.
 */

function formatPattern(pattern, params) {
  params = params || {};

  var _compilePattern3 = compilePattern(pattern);

  var tokens = _compilePattern3.tokens;

  var parenCount = 0,
      pathname = '',
      splatIndex = 0;

  var token, paramName, paramValue;
  for (var i = 0, len = tokens.length; i < len; ++i) {
    token = tokens[i];

    if (token === '*') {
      paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;

      (0, _invariant2['default'])(paramValue != null || parenCount > 0, 'Missing splat #%s for path "%s"', splatIndex, pattern);

      if (paramValue != null) pathname += encodeURI(paramValue).replace(/%20/g, '+');
    } else if (token === '(') {
      parenCount += 1;
    } else if (token === ')') {
      parenCount -= 1;
    } else if (token.charAt(0) === ':') {
      paramName = token.substring(1);
      paramValue = params[paramName];

      (0, _invariant2['default'])(paramValue != null || parenCount > 0, 'Missing "%s" parameter for path "%s"', paramName, pattern);

      if (paramValue != null) pathname += encodeURIComponent(paramValue).replace(/%20/g, '+');
    } else {
      pathname += token;
    }
  }

  return pathname.replace(/\/+/g, '/');
}
},{"invariant":25,"qs":27}],24:[function(require,module,exports){
/* components */
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Router2 = require('./Router');

var _Router3 = _interopRequireDefault(_Router2);

exports.Router = _Router3['default'];

var _Link2 = require('./Link');

var _Link3 = _interopRequireDefault(_Link2);

exports.Link = _Link3['default'];

/* components (configuration) */

var _Redirect2 = require('./Redirect');

var _Redirect3 = _interopRequireDefault(_Redirect2);

exports.Redirect = _Redirect3['default'];

var _Route2 = require('./Route');

var _Route3 = _interopRequireDefault(_Route2);

exports.Route = _Route3['default'];

/* mixins */

var _Navigation2 = require('./Navigation');

var _Navigation3 = _interopRequireDefault(_Navigation2);

exports.Navigation = _Navigation3['default'];

var _TransitionHook2 = require('./TransitionHook');

var _TransitionHook3 = _interopRequireDefault(_TransitionHook2);

exports.TransitionHook = _TransitionHook3['default'];

var _State2 = require('./State');

var _State3 = _interopRequireDefault(_State2);

exports.State = _State3['default'];

/* utils */

var _RouteUtils = require('./RouteUtils');

exports.createRoutesFromReactChildren = _RouteUtils.createRoutesFromReactChildren;

var _PropTypes2 = require('./PropTypes');

var _PropTypes3 = _interopRequireDefault(_PropTypes2);

exports.PropTypes = _PropTypes3['default'];

var _Router4 = _interopRequireDefault(_Router2);

exports['default'] = _Router4['default'];
},{"./Link":8,"./Navigation":10,"./PropTypes":12,"./Redirect":13,"./Route":14,"./RouteUtils":15,"./Router":16,"./State":20,"./TransitionHook":22}],25:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))

},{"_process":1}],26:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],27:[function(require,module,exports){
module.exports = require('./lib/');

},{"./lib/":28}],28:[function(require,module,exports){
// Load modules

var Stringify = require('./stringify');
var Parse = require('./parse');


// Declare internals

var internals = {};


module.exports = {
    stringify: Stringify,
    parse: Parse
};

},{"./parse":29,"./stringify":30}],29:[function(require,module,exports){
// Load modules

var Utils = require('./utils');


// Declare internals

var internals = {
    delimiter: '&',
    depth: 5,
    arrayLimit: 20,
    parameterLimit: 1000
};


internals.parseValues = function (str, options) {

    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0, il = parts.length; i < il; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        if (pos === -1) {
            obj[Utils.decode(part)] = '';
        }
        else {
            var key = Utils.decode(part.slice(0, pos));
            var val = Utils.decode(part.slice(pos + 1));

            if (Object.prototype.hasOwnProperty(key)) {
                continue;
            }

            if (!obj.hasOwnProperty(key)) {
                obj[key] = val;
            }
            else {
                obj[key] = [].concat(obj[key]).concat(val);
            }
        }
    }

    return obj;
};


internals.parseObject = function (chain, val, options) {

    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj = {};
    if (root === '[]') {
        obj = [];
        obj = obj.concat(internals.parseObject(chain, val, options));
    }
    else {
        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
        var index = parseInt(cleanRoot, 10);
        var indexString = '' + index;
        if (!isNaN(index) &&
            root !== cleanRoot &&
            indexString === cleanRoot &&
            index >= 0 &&
            index <= options.arrayLimit) {

            obj = [];
            obj[index] = internals.parseObject(chain, val, options);
        }
        else {
            obj[cleanRoot] = internals.parseObject(chain, val, options);
        }
    }

    return obj;
};


internals.parseKeys = function (key, val, options) {

    if (!key) {
        return;
    }

    // The regex chunks

    var parent = /^([^\[\]]*)/;
    var child = /(\[[^\[\]]*\])/g;

    // Get the parent

    var segment = parent.exec(key);

    // Don't allow them to overwrite object prototype properties

    if (Object.prototype.hasOwnProperty(segment[1])) {
        return;
    }

    // Stash the parent if it exists

    var keys = [];
    if (segment[1]) {
        keys.push(segment[1]);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {

        ++i;
        if (!Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {
            keys.push(segment[1]);
        }
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return internals.parseObject(keys, val, options);
};


module.exports = function (str, options) {

    if (str === '' ||
        str === null ||
        typeof str === 'undefined') {

        return {};
    }

    options = options || {};
    options.delimiter = typeof options.delimiter === 'string' || Utils.isRegExp(options.delimiter) ? options.delimiter : internals.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : internals.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : internals.arrayLimit;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : internals.parameterLimit;

    var tempObj = typeof str === 'string' ? internals.parseValues(str, options) : str;
    var obj = {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        var newObj = internals.parseKeys(key, tempObj[key], options);
        obj = Utils.merge(obj, newObj);
    }

    return Utils.compact(obj);
};

},{"./utils":31}],30:[function(require,module,exports){
// Load modules

var Utils = require('./utils');


// Declare internals

var internals = {
    delimiter: '&',
    arrayPrefixGenerators: {
        brackets: function (prefix, key) {
            return prefix + '[]';
        },
        indices: function (prefix, key) {
            return prefix + '[' + key + ']';
        },
        repeat: function (prefix, key) {
            return prefix;
        }
    }
};


internals.stringify = function (obj, prefix, generateArrayPrefix) {

    if (Utils.isBuffer(obj)) {
        obj = obj.toString();
    }
    else if (obj instanceof Date) {
        obj = obj.toISOString();
    }
    else if (obj === null) {
        obj = '';
    }

    if (typeof obj === 'string' ||
        typeof obj === 'number' ||
        typeof obj === 'boolean') {

        return [encodeURIComponent(prefix) + '=' + encodeURIComponent(obj)];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys = Object.keys(obj);
    for (var i = 0, il = objKeys.length; i < il; ++i) {
        var key = objKeys[i];
        if (Array.isArray(obj)) {
            values = values.concat(internals.stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix));
        }
        else {
            values = values.concat(internals.stringify(obj[key], prefix + '[' + key + ']', generateArrayPrefix));
        }
    }

    return values;
};


module.exports = function (obj, options) {

    options = options || {};
    var delimiter = typeof options.delimiter === 'undefined' ? internals.delimiter : options.delimiter;

    var keys = [];

    if (typeof obj !== 'object' ||
        obj === null) {

        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in internals.arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    }
    else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    }
    else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = internals.arrayPrefixGenerators[arrayFormat];

    var objKeys = Object.keys(obj);
    for (var i = 0, il = objKeys.length; i < il; ++i) {
        var key = objKeys[i];
        keys = keys.concat(internals.stringify(obj[key], key, generateArrayPrefix));
    }

    return keys.join(delimiter);
};

},{"./utils":31}],31:[function(require,module,exports){
// Load modules


// Declare internals

var internals = {};


exports.arrayToObject = function (source) {

    var obj = {};
    for (var i = 0, il = source.length; i < il; ++i) {
        if (typeof source[i] !== 'undefined') {

            obj[i] = source[i];
        }
    }

    return obj;
};


exports.merge = function (target, source) {

    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        }
        else {
            target[source] = true;
        }

        return target;
    }

    if (typeof target !== 'object') {
        target = [target].concat(source);
        return target;
    }

    if (Array.isArray(target) &&
        !Array.isArray(source)) {

        target = exports.arrayToObject(target);
    }

    var keys = Object.keys(source);
    for (var k = 0, kl = keys.length; k < kl; ++k) {
        var key = keys[k];
        var value = source[key];

        if (!target[key]) {
            target[key] = value;
        }
        else {
            target[key] = exports.merge(target[key], value);
        }
    }

    return target;
};


exports.decode = function (str) {

    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};


exports.compact = function (obj, refs) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    refs = refs || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0, il = obj.length; i < il; ++i) {
            if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    for (i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        obj[key] = exports.compact(obj[key], refs);
    }

    return obj;
};


exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};


exports.isBuffer = function (obj) {

    if (obj === null ||
        typeof obj === 'undefined') {

        return false;
    }

    return !!(obj.constructor &&
        obj.constructor.isBuffer &&
        obj.constructor.isBuffer(obj));
};

},{}],32:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var __DEV__ = process.env.NODE_ENV !== 'production';

var warning = function() {};

if (__DEV__) {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))

},{"_process":1}]},{},[2])
//# sourceMappingURL=app.browserify.js

})();
