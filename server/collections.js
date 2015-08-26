if (Meteor.isServer) {
    var database = new MongoInternals.RemoteCollectionDriver('mongodb://ben:password@candidate.20.mongolayer.com:11191/ruh');

    Brands = new Mongo.Collection("brands", { _driver: database });
    Edits = new Mongo.Collection("edits", { _driver: database });
    Products = new Mongo.Collection("products", { _driver: database });

    Meteor.publish('brands', function() {
        return Brands.find();
    });
    Meteor.publish('products', function() {
        return Products.find()
    });
    Meteor.publish('edits', function() {
        return Edits.find()
    })
}