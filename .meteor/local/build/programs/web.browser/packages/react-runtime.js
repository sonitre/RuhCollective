(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactProd = Package['react-runtime-prod'].ReactProd;

/* Package-scope variables */
var React;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/react-runtime/react-runtime.js                           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
if (Package["react-runtime-dev"]) {                                  // 1
  React = Package["react-runtime-dev"].ReactDev;                     // 2
} else {                                                             // 3
  React = ReactProd;                                                 // 4
}                                                                    // 5
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['react-runtime'] = {
  React: React
};

})();
