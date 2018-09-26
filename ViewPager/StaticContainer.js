import React, { Component } from 'react'

class StaticContainer extends Component {
    shouldComponentUpdate(nextProps) {
        return !!nextProps.shouldUpdate;
    }

    render() {
        var child = this.props.children;
        if (child === null || child === false) {
            return null;
        }
        return React.Children.only(child);
    }
}

module.exports = StaticContainer;