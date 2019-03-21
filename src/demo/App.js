/* eslint no-magic-numbers: 0 */
import React, {Component} from 'react';

import {DashLeaflet} from '../lib';

const data_l = require('./some_lines.json')
const data_p = require('./some_points.json')

const line_dat = {'geom': [data_l], 'titles': ['Some Line Title']}
const point_dat = {'geom': [data_p], 'titles': ['Some Point Title']}

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
                    id={'map'}
                    mapOptions={{
                        bounds: [[47.82, 10.50], [45.80, 5.93]],
                        maxBounds: [[47.82, 10.50], [45.80, 5.93]]
                    }}
                    baselayer={[
                        {
                            name: 'Light',
                            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        },
                        {
                            name: 'Satellit',
                            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        },
                    ]}
                    lines={line_dat}
                />
            </div>
        )
    }
}

export default App;
