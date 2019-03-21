import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as ReactLeaflet from 'react-leaflet';
/* global ReactLeaflet:true */


/**
 * DashLeaflet is allows to display a map in dash. Several point and line layers can be added to the map.
 */
export default class DashLeaflet extends Component<{}, State> {

    constructor(props) {
        super(props);
        if (this.props.style['height'] === '100%') {
            this.props.style['height'] = '600px'
        }
        ;

        this.state = {
            line_layer: [],
            point_layer: [],
        };
    }

    /**
     * Get baselayers from props and add them to the map.
     *
     * @returns {*} Single baselayer as TileLayer or multiple baselayers as TileLayers in LayersControl
     */
    getBaseLayers() {
        // If there is no baselayer, return OSM
        if (!this.props.baselayer) {
            let baselayer = (<ReactLeaflet.TileLayer
                url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
            />);
            return baselayer;

            // If there is a single baselayer provided, create Tilelayer and return it
        } else if (!Array.isArray(this.props.baselayer) || this.props.baselayer.length === 1) {
            let lyr = (this.props.baselayer.length === 1) ? this.props.baselayer[0] : this.props.baselayer;
            let baselayer = (<ReactLeaflet.TileLayer
                url={lyr.url}
                attribution={lyr.attribution}
            />);
            return baselayer;

            // If there are multiple baselayers provided in an array, loop over them and return the baselayers in a layer
            // control element.
        } else {
            let baselayers = [];
            for (let i = 0; i < this.props.baselayer.length; i++) {
                let check = (i === 0) ? 'checked' : '';
                let baselayer = (<ReactLeaflet.LayersControl.BaseLayer key={'baselayer_' + i} checked={check}
                                                                       name={this.props.baselayer[i].name}>
                    <ReactLeaflet.TileLayer
                        url={this.props.baselayer[i].url}
                        attribution={this.props.baselayer[i].attribution}
                    />
                </ReactLeaflet.LayersControl.BaseLayer>);
                baselayers.push(baselayer);
            }
            return baselayers;
        }
    }

    /**
     * Load lines from array of geojsons and return a feature group for each geojson.
     *
     * @param geom Array of geojson objects containing lines
     * @param titles Title of each feature group that is to be displayed in the layer control
     * @returns {Array} of Layer overlays containing feature groups of provided lines
     */
    loadLines(geom, titles) {
        let line_groups = [];
        for (let i = 0; i < geom.length; i++) {
            let layers = L.geoJSON(geom[i]).getLayers();
            let layer_list = [];
            for (let j = 0; j < layers.length; j++) {
                let line = (<ReactLeaflet.Polyline key={"line" + i + "_" + j} color="black" weight={2}
                                                   positions={layers[j].getLatLngs()}>
                    <ReactLeaflet.Popup>
                        A pretty CSS3 popup. <br/> Easily customizable.
                    </ReactLeaflet.Popup>
                </ReactLeaflet.Polyline>);
                layer_list.push(line);
            }
            let line_group = (<ReactLeaflet.LayersControl.Overlay checked name={titles[i]} key={"line_layer" + i}>
                <ReactLeaflet.FeatureGroup>
                    {layer_list}
                </ReactLeaflet.FeatureGroup>
            </ReactLeaflet.LayersControl.Overlay>);
            line_groups.push(line_group);
        }
        return line_groups
    }

    /**
     * Load points from array of geojsons and return a feature group for each geojson.
     *
     * @param geom Array of geojson objects containing points
     * @param titles Title of each feature group that is to be displayed in the layer control
     * @returns {Array} of Layer overlays containing feature groups of provided points
     */
    loadPoints(geom, titles) {
        let point_groups = [];
        for (let i = 0; i < geom.length; i++) {
            let layers = L.geoJSON(geom[i]).getLayers();
            let layer_list = [];
            for (let j = 0; j < layers.length; j++) {
                let point = (
                    <ReactLeaflet.CircleMarker key={"point" + i + "_" + j} center={layers[j].getLatLng()} color="red"
                                               radius={2}>
                        <ReactLeaflet.Popup>This is some fucking bullshit -.-</ReactLeaflet.Popup>
                    </ReactLeaflet.CircleMarker>);
                layer_list.push(point);
            }
            let point_group = (
                <ReactLeaflet.LayersControl.Overlay checked name={titles[i]} key={"point_layer" + i}>
                    <ReactLeaflet.FeatureGroup>
                        {layer_list}
                    </ReactLeaflet.FeatureGroup>
                </ReactLeaflet.LayersControl.Overlay>);
            point_groups.push(point_group);
        }
        return point_groups
    }

    componentDidMount() {
        this.setState({
            line_layer: this.loadLines(this.props.lines.geom, this.props.lines.titles),
            point_layer: this.loadPoints(this.props.points.geom, this.props.points.titles)
        })
    }

    render() {
        let mapOptions = this.props.mapOptions;

        let line_data = this.loadLines(this.props.lines.geom, this.props.lines.titles);
        let point_data = this.loadPoints(this.props.points.geom, this.props.points.titles);

        return (
            <div id={this.props.id} style={this.props.style}>
                <ReactLeaflet.Map id='Map'
                                  style={{height: "100%"}}
                                  bounds={mapOptions.bounds}
                                  center={mapOptions.center}
                                  minBounds={mapOptions.minBounds}
                                  maxBounds={mapOptions.maxBounds}
                                  minZoom={mapOptions.minZoom}
                                  maxZoom={mapOptions.maxZoom}
                                  zoom={mapOptions.zoom}
                >
                    <ReactLeaflet.LayersControl position='topright'>
                        {this.getBaseLayers()}
                        {this.state.line_layer}
                        {this.state.point_layer}
                    </ReactLeaflet.LayersControl>
                </ReactLeaflet.Map>
            </div>
        )
    }
}

DashLeaflet.propTypes = {
    /**
     The id of the main element
     */
    id: PropTypes.string,

    /**
     The style of the main element
     */
    style: PropTypes.shape({
        height: PropTypes.string
    }),

    /**
     The style of the main element
     */
    mapOptions: PropTypes.shape({
        bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        center: PropTypes.arrayOf(PropTypes.number),
        minBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,
        zoom: PropTypes.number
    }),

    /**
     The baselayer(s) of the map. Can either be a single one or an array of multiple baselayers including their name.
     If no baselayer is provided, the OSM will serve as defualt.
     */
    baselayer: PropTypes.oneOfType([
        PropTypes.shape({
            url: PropTypes.string,
            attribution: PropTypes.string
        }),
        PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            url: PropTypes.string,
            attribution: PropTypes.string
        }))
    ]),

    /**
     Object containing
     - geom: Array of GeoJSON objects containing lines that are to be rendered on the map.
     - titles: Array of titles of line layers that are to be rendered on the map.
     */
    lines: PropTypes.shape({
        geom: PropTypes.arrayOf(PropTypes.object),
        titles: PropTypes.arrayOf(PropTypes.string),
    }),

    /**
     Object containing
     - geom: Array of GeoJSON objects containing points that are to be rendered on the map.
     - titles: Array of titles of point layers that are to be rendered on the map.
     */
    points: PropTypes.shape({
        geom: PropTypes.arrayOf(PropTypes.object),
        titles: PropTypes.arrayOf(PropTypes.string),
    }),
};

DashLeaflet.defaultProps = {
    style: {'height': '600px'},
    mapOptions: {
        center: [0, 0],
        zoom: 4.
    },
    lines: {'geom': [], 'titles': [], 'popup': []},
    points: {'geom': [], 'titles': [], 'popup': []},
};