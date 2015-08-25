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
            React.createElement('div', { style: styles.spotLight }),
            React.createElement(
                'p',
                { style: styles.textBlock },
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
            ),
            React.createElement(
                'div',
                { style: styles.howItWorksWrapper },
                React.createElement(
                    'div',
                    { style: styles.howItWorksDiv },
                    '1'
                ),
                React.createElement(
                    'div',
                    { style: styles.howItWorksDiv },
                    '2'
                ),
                React.createElement(
                    'div',
                    { style: styles.howItWorksDiv },
                    '3'
                )
            ),
            React.createElement(
                'p',
                { style: styles.textBlock },
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
            ),
            React.createElement(
                'div',
                { style: styles.currentSaleImage },
                React.createElement(
                    'button',
                    { style: styles.button },
                    'Shop Now'
                )
            )
        );
    }
});

var styles = {
    spotLight: {
        backgroundImage: 'url(http://www.fashionfightingfamine.com/uploads/7/2/4/3/7243319/2146593_orig.jpg)',
        backgroundSize: 'cover',
        minHeight: 350
    },
    howItWorksWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    howItWorksDiv: {
        width: '33%',
        minHeight: 100,
        display: 'flex',
        justifyContent: 'center',
        background: 'lightgray',
        flexDirection: 'column',
        textAlign: 'center'
    },
    textBlock: {
        margin: 0,
        background: '#fafafa',
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        display: 'flex',
        minHeight: 100
    },
    currentSaleImage: {
        backgroundImage: 'url(https://secure.static.tumblr.com/9d6aa46413869e08a0647e5e92e66c52/qjeafrh/eEynexfab/tumblr_static_djd7ntcx2pkwgo4kk88c0ogc8_640_v2.jpg)',
        backgroundSize: 'cover',
        minHeight: 350
    },
    button: {
        background: 'gray',
        color: 'white',
        padding: '15px 30px',
        marginTop: 110,
        marginLeft: 90,
        borderRadius: 25
    }
};

})();
