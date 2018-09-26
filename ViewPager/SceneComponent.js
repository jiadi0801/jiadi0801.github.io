const React = require('react');
const {Component} = React;
const {View, StyleSheet} = require('react-native');

const StaticContainer = require('./StaticContainer');

class SceneComponent extends React.Component {
    state = {
        shouldUpdated: this.props.shouldUpdated && !this.props.lazy,
    };

    componentWillReceiveProps(nextProps) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        const lazyTime = nextProps.tabSelected ? 0 : nextProps.lazyTime;
        if (nextProps.shouldUpdated && typeof lazyTime === 'number') {
            this.state.shouldUpdated && this.setState({
                shouldUpdated: false,
            });
            this.timeoutId = setTimeout(() => {
                this.setState({
                    shouldUpdated : true,
                });
            }, lazyTime);
        } else {
            nextProps.shouldUpdated !== this.state.shouldUpdated && this.setState({
                shouldUpdated: nextProps.shouldUpdated,
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId)
    }

    render() {
        const {shouldUpdated, lazy, ...props} = this.props;
        return (
            <View {...props}>
                <StaticContainer shouldUpdate={this.state.shouldUpdated}>
                    {props.children}
                </StaticContainer>
            </View>
        );
    }
}

module.exports = SceneComponent;
