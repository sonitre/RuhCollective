let { Router, Route } = ReactRouter;

Routes = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function () {
        return (
            <Router history={ReactRouter.lib.BrowserHistory.history}>
                <Route component={App}>
                    <Route path="/" component={Home}/>
                    <Route path="vote" component={Vote}/>
                    <Route path="shop" component={Shop}/>
                    <Route path="about" component={About}/>
                </Route>
            </Router>
        );
    }
});