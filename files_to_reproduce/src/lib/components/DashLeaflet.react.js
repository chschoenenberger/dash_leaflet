import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';

// Center of Switzerland
const center = [46.801111, 8.226667];
// Initial zoom level
const zoom = 8;

/**
 * DashLeaflet is allows to display a map in dash. Several point and line layers can be added to the map.
 */
export default class DashLeaflet extends Component<{}, State> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div id={this.props.id}>
                <Map id='Map'
                        style={{height: "100%"}}
                        center={center}
                        zoom={zoom}
                >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                </Map>
            </div>
        )
    }
}

DashLeaflet.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
};