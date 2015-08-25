//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var babelHelpers = Package['babel-runtime'].babelHelpers;

/* Package-scope variables */
var ReactMeteorData;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/react-meteor-data/meteor-data-mixin.jsx.js                                               //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
ReactMeteorData = {
  componentWillMount: function () {
    this.data = {};
    this._meteorDataManager = new MeteorDataManager(this);
    var newData = this._meteorDataManager.calculateData();
    this._meteorDataManager.updateData(newData);
  },
  componentWillUpdate: function (nextProps, nextState) {
    var saveProps = this.props;
    var saveState = this.state;
    var newData = undefined;
    try {
      // Temporarily assign this.state and this.props,
      // so that they are seen by getMeteorData!
      // This is a simulation of how the proposed Observe API
      // for React will work, which calls observe() after
      // componentWillUpdate and after props and state are
      // updated, but before render() is called.
      // See https://github.com/facebook/react/issues/3398.
      this.props = nextProps;
      this.state = nextState;
      newData = this._meteorDataManager.calculateData();
    } finally {
      this.props = saveProps;
      this.state = saveState;
    }

    this._meteorDataManager.updateData(newData);
  },
  componentWillUnmount: function () {
    this._meteorDataManager.dispose();
  }
};

// A class to keep the state and utility methods needed to manage
// the Meteor data for a component.

var MeteorDataManager = (function () {
  function MeteorDataManager(component) {
    babelHelpers.classCallCheck(this, MeteorDataManager);

    this.component = component;
    this.computation = null;
    this.oldData = null;
  }

  MeteorDataManager.prototype.dispose = function dispose() {
    if (this.computation) {
      this.computation.stop();
      this.computation = null;
    }
  };

  MeteorDataManager.prototype.calculateData = function calculateData() {
    var component = this.component;
    var props = component.props;
    var state = component.state;

    if (!component.getMeteorData) {
      return null;
    }

    // When rendering on the server, we don't want to use the Tracker.
    // We only do the first rendering on the server so we can get the data right away
    if (Meteor.isServer) {
      return component.getMeteorData();
    }

    if (this.computation) {
      this.computation.stop();
      this.computation = null;
    }

    var data = undefined;
    // Use Tracker.nonreactive in case we are inside a Tracker Computation.
    // This can happen if someone calls `React.render` inside a Computation.
    // In that case, we want to opt out of the normal behavior of nested
    // Computations, where if the outer one is invalidated or stopped,
    // it stops the inner one.
    this.computation = Tracker.nonreactive(function () {
      return Tracker.autorun(function (c) {
        if (c.firstRun) {
          var savedSetState = component.setState;
          try {
            component.setState = function () {
              throw new Error("Can't call `setState` inside `getMeteorData` as this could cause an endless" + " loop. To respond to Meteor data changing, consider making this component" + " a \"wrapper component\" that only fetches data and passes it in as props to" + " a child component. Then you can use `componentWillReceiveProps` in that" + " child component.");
            };

            data = component.getMeteorData();
          } finally {
            component.setState = savedSetState;
          }
        } else {
          // Stop this computation instead of using the re-run.
          // We use a brand-new autorun for each call to getMeteorData
          // to capture dependencies on any reactive data sources that
          // are accessed.  The reason we can't use a single autorun
          // for the lifetime of the component is that Tracker only
          // re-runs autoruns at flush time, while we need to be able to
          // re-call getMeteorData synchronously whenever we want, e.g.
          // from componentWillUpdate.
          c.stop();
          // Calling forceUpdate() triggers componentWillUpdate which
          // recalculates getMeteorData() and re-renders the component.
          component.forceUpdate();
        }
      });
    });

    Object.keys(data).forEach(function (key) {
      if (Package.mongo && Package.mongo.Mongo && data[key] instanceof Package.mongo.Mongo.Cursor) {
        console.warn("Warning: you are returning a Mongo cursor from getMeteorData. This value " + "will not be reactive. You probably want to call `.fetch()` on the cursor " + "before returning it.");
      }
    });

    return data;
  };

  MeteorDataManager.prototype.updateData = function updateData(newData) {
    var component = this.component;
    var oldData = this.oldData;

    if (!(newData && typeof newData === "object")) {
      throw new Error("Expected object returned from getMeteorData");
    }
    // update componentData in place based on newData
    for (var key in newData) {
      component.data[key] = newData[key];
    }
    // if there is oldData (which is every time this method is called
    // except the first), delete keys in newData that aren't in
    // oldData.  don't interfere with other keys, in case we are
    // co-existing with something else that writes to a component's
    // this.data.
    if (oldData) {
      for (var key in oldData) {
        if (!(key in newData)) {
          delete component.data[key];
        }
      }
    }
    this.oldData = newData;
  };

  return MeteorDataManager;
})();///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['react-meteor-data'] = {
  ReactMeteorData: ReactMeteorData
};

})();
