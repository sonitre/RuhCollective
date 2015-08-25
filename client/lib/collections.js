
if (Meteor.isServer) {
    var database = new MongoInternals.RemoteCollectionDriver('mongodb://ben:password@candidate.20.mongolayer.com:11191/ruh');

    Brands = new Mongo.Collection("brands", { _driver: database });
    Meteor.publish('brands', function() {
        return Brands.find();
    });
}

if (Meteor.isClient) {
    Meteor.subscribe('brands');
    Brands = new Mongo.Collection('brands');
}