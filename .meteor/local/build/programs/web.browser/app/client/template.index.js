(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.Raw('<div id="react-app"></div>');
}));
Meteor.startup(Template.body.renderToDocument);

})();
