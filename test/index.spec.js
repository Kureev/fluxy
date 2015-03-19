'use strict';

var FFlux = require('../src/index.js');
var React = require('react/addons');
var chai = require('chai');
var expect = chai.expect;
var jsdom = require("jsdom").jsdom;

global.document = jsdom();
global.window = global.document.defaultView;

describe('FFlux static functions', function() {
    
    it('createDispatcher', function() {
        expect(FFlux.Dispatcher).to.be.a('function');
    });

    it('mutable store constructor is a function', function() {
        expect(FFlux.MutableStore).to.be.a('function');
    });

    it('immutable store constructor is a function', function() {
        expect(FFlux.ImmutableStore).to.be.a('function');
    });

    it('mixin\'s bind function', function() {
        var dispatcher = new FFlux.Dispatcher();
        var store = new FFlux.MutableStore({
            actions: {
                'TEST': 'test'
            },

            test: function() {
                this.emitChange();
            }
        });

        dispatcher.register(store);

        var spy = chai.spy();

        var viewClass = React.createClass({
            mixins: [FFlux.mixins.bind(store)],

            storeDidUpdate: spy,

            render: function() {
                return React.DOM.div(null, 'something');
            }
        });

        var view = React.createFactory(viewClass)();

        React.render(view, global.document.body);

        dispatcher.dispatch('TEST');

        expect(spy).to.have.been.called.once();

        React.unmountComponentAtNode(global.document.body);

        dispatcher.dispatch('TEST');

        expect(spy).to.have.been.called.once();
    });
});