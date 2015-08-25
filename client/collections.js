if (Meteor.isClient) {
    Meteor.subscribe('brands');
    Meteor.subscribe('edits');
    Meteor.subscribe('products');

    Brands = new Mongo.Collection('brands');
    Edits = new Mongo.Collection('edits');
    Products = new Mongo.Collection('products');
}