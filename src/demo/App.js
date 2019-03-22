/* eslint no-magic-numbers: 0 */
import React, {Component} from 'react';

import {DashLeaflet} from '../lib';

const data_l = require('./data/sbb_network.json')
const data_p = require('./data/haltestellen_zug.json')

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
                    style={{height: '100%'}}
                    baselayer={[
                        {
                            name: 'Light',
                            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        },
                        {
                            name: 'Satellite',
                            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        },
                    ]}
                    points={[
                        {
                            geom: data_p,
                            title: 'SBB Haltestellen',
                            popup: 'name',
                            source: 'https://appstickers-cdn.appadvice.com/1193200134/821557143/09f5bff947642901256be8f4e7478fd2-8.png'
                        }
                    ]}
                    lines={[
                        {
                            geom: data_l,
                            title: 'SBB Linien',
                            popup: 'Name',
                        }
                    ]}
                />
            </div>
        )
    }
}

export default App;
