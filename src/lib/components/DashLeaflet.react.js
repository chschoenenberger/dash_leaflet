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
            console.warn('Attention: Map might not display, if height of element and parent are 100%.')
        }
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
            return (<ReactLeaflet.TileLayer
                url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
            />);

            // If there is a single baselayer provided, create Tilelayer and return it
        } else if (!Array.isArray(this.props.baselayer) || this.props.baselayer.length === 1) {
            let lyr = (this.props.baselayer.length === 1) ? this.props.baselayer[0] : this.props.baselayer;
            return (<ReactLeaflet.TileLayer
                url={lyr.url}
                attribution={lyr.attribution}
            />);

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
     * Load lines from an object containing title of line layer, array of geometries, array of popup content, color, weight and opacity.
     *
     * @returns {Array} of Layer overlays containing feature groups of provided lines
     */
    static loadLines(lines) {
        let line_layers = [];
        for (let i = 0; i < lines.length; i++) {
            let layerList = [];
            for (let j = 0; j < lines[i].geom.length; j++) {
                let popup = (Array.isArray(lines[i].popup)) ? lines[i].popup[j] : lines[i].popup;
                let color = (lines[i].color) ? lines[i].color : 'black';
                let weight = (lines[i].weight) ? lines[i].weight : 2;
                let opacity = (lines[i].opacity) ? lines[i].opacity : 1;
                console.log(color)
                let line = (
                    <ReactLeaflet.Polyline key={"line" + i + "_" + j} color={color} weight={weight} opacity={opacity}
                                           positions={lines[i].geom[j]}>
                        <ReactLeaflet.Popup>
                            <div>
                                {popup}
                            </div>
                        </ReactLeaflet.Popup>
                    </ReactLeaflet.Polyline>);
                layerList.push(line);
            }
            let line_group = (
                <ReactLeaflet.LayersControl.Overlay checked name={lines[i].title} key={"line_layer" + i}>
                    <ReactLeaflet.FeatureGroup>
                        {layerList}
                    </ReactLeaflet.FeatureGroup>
                </ReactLeaflet.LayersControl.Overlay>);
            line_layers.push(line_group);
        }
        return line_layers
    }


    /**
     * Return a leaflet icon element when provided with a source of an image.
     *
     * @param source
     */
    static getIcon(options) {
        if (!options) {
            return L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [41, 41]
            })
        }
        return L.icon({
            iconUrl: options.iconUrl,
            iconRetinaUrl: (options.iconRetinaUrl) ? options.iconRetinaUrl : options.iconUrl,
            shadowUrl: options.shadowUrl,
            iconSize: (options.iconSize) ? options.iconSize : [25, 25],
            iconAnchor: (options.iconAnchor) ? options.iconAnchor : [12.5, 12.5],
            popupAnchor: (options.popupAnchor) ? options.popupAnchor : [0, -12.5],
            tooltipAnchor: options.tooltipAnchor,
            shadowSize: options.shadowSize
        });
    }

    /**
     * Load points from an array of objects containing geometry (as geojson), layer title, popup property and icon source.
     *
     * @returns {Array} of Layer overlays containing feature groups of provided points
     */
    static loadPoints(points) {
        let point_layers = [];
        for (let i = 0; i < points.length; i++) {
            let layerList = [];
            for (let j = 0; j < points[i].geom.length; j++) {
                let popup = (Array.isArray(points[i].popup)) ? points[i].popup[j] : points[i].popup;
                let point = (
                    <ReactLeaflet.Marker key={"point" + i + "_" + j} position={points[i].geom[j]}
                                         icon={DashLeaflet.getIcon(points[i].icon)}>
                        <ReactLeaflet.Popup>
                            <div>
                                {popup}
                            </div>
                        </ReactLeaflet.Popup>
                    </ReactLeaflet.Marker>);
                layerList.push(point);
            }
            let point_group = (
                <ReactLeaflet.LayersControl.Overlay checked name={points[i].title} key={"point_layer" + i}>
                    <ReactLeaflet.FeatureGroup>
                        {layerList}
                    </ReactLeaflet.FeatureGroup>
                </ReactLeaflet.LayersControl.Overlay>);
            point_layers.push(point_group);
        }
        return point_layers
    }

    render() {
        let mapOptions = this.props.mapOptions;

        let layers;
        // Only show layer control when there are point/line layers or multiple base layers
        if ((!this.props.baselayer || !Array.isArray(this.props.baselayer) || this.props.baselayer.length === 1) &&
            this.props.lines.length === 0 && this.props.points.length === 0) {
            layers = (
                this.getBaseLayers()
            )
        } else {
            layers = (
                <ReactLeaflet.LayersControl>
                    {this.getBaseLayers()}
                    {DashLeaflet.loadLines(this.props.lines)}
                    {DashLeaflet.loadPoints(this.props.points)}
                </ReactLeaflet.LayersControl>
            )
        }

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
                    {layers}
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
     If no baselayer is provided, the OSM will serve as default.
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
     Array containing one or many shapes of:
     - title: Title of line layer that is to be rendered on the map.
     - geom: Array of arrays containing lines that are to be rendered on the map. These can either be lines or polylines.
     - popup: String containing popup-text for this layer group or list of strings containing popup-texts,
     - color: Color of the line on the map.
     - weight: Weight of the lines.
     - opacity: Opacity of the lines.
     */
    lines: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        geom: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
                PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)))
            ])).isRequired,
        popup: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string
        ]),
        color: PropTypes.string,
        weight: PropTypes.number,
        opacity: PropTypes.number
    })),

    /**
     Array containing one or many shapes of:
     - title: Title of point layer that is to be rendered on the map.
     - geom: Array of arrays containing coordinates ([lat, lng]) of points that are to be rendered on the map.
     - popup: String containing popup-text for this layer group or list of strings containing popup-texts
     - icon: Shape for the icon that is to be rendered for the points. Attention, the iconUrl must be an
     external link and cannot be a relative link.
     */
    points: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        geom: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
        popup: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string
        ]),
        icon: PropTypes.shape({
            iconUrl: PropTypes.string,
            iconRetinaUrl: PropTypes.string,
            shadowUrl: PropTypes.string,
            iconSize: PropTypes.arrayOf(PropTypes.number),
            iconAnchor: PropTypes.arrayOf(PropTypes.number),
            popupAnchor: PropTypes.arrayOf(PropTypes.number),
            tooltipAnchor: PropTypes.arrayOf(PropTypes.number),
            shadowSize: PropTypes.arrayOf(PropTypes.number)
        })
    })),

};

DashLeaflet.defaultProps = {
    style: {'height': '600px'},
    mapOptions: {
        center: [0, 0],
        zoom: 4.
    },
    lines: [],
    points: []
};