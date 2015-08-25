(function(){var _ReactRouter = ReactRouter;
var Link = _ReactRouter.Link;

Home = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement('div', { style: styles }),
            React.createElement(
                'p',
                null,
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
            )
        );
    }
});

var styles = {
    backgroundImage: 'url(http://www.fashionfightingfamine.com/uploads/7/2/4/3/7243319/2146593_orig.jpg)',
    backgroundSize: 'cover',
    minHeight: 350
};

})();
