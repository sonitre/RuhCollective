(function(){var _ReactRouter = ReactRouter;
var Router = _ReactRouter.Router;
var Route = _ReactRouter.Route;

Routes = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        return React.createElement(
            Router,
            { history: ReactRouter.lib.BrowserHistory.history },
            React.createElement(
                Route,
                { component: App },
                React.createElement(Route, { path: "/", component: Home }),
                React.createElement(Route, { path: "vote", component: Vote }),
                React.createElement(Route, { path: "shop", component: Shop }),
                React.createElement(Route, { path: "about", component: About })
            )
        );
    }
});

})();
