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
    Meteor.publishComposite('edits', {
        find: function() {
            return Edits.find();
        },
        children: [
            {
                find: function(edit) {
                    //console.log('edit in server ', edit)
                    Products.find( { edit: edit._id._str },
                    { limit: 1, fields: { product: 1 } }
                    );
                }
            }
        ]
    })
}