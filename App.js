import * as React from 'react';
import Navigation from "./Navigation";

export default class App extends React.Component {
    render() {
        console.disableYellowBox = true;
        return (
            <Navigation/>
        )
    }
}