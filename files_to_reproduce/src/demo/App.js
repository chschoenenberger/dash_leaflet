/* eslint no-magic-numbers: 0 */
import React, {Component} from 'react';

import { DashLeaflet } from '../lib';

class App extends Component {

    constructor() {
        super();
        this.state = {};
    }

    setProps(newProps) {
        this.setState(newProps);
    }

    render() {
        return (
            <div>
                <DashLeaflet
                    id={'whatever'}
                />
            </div>
        )
    }
}

export default App;
