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
     * Load lines from an array of objects containing geometry (as geojson), layer title, popup property and icon source.
     *
     * @returns {Array} of Layer overlays containing feature groups of provided lines
     */
    static loadLines(lines) {
        let line_layers = [];
        for (let i = 0; i < lines.length; i++) {
            let layers = L.geoJSON(lines[i].geom).getLayers();
            let layerList = [];
            for (let j = 0; j < layers.length; j++) {
                let line = (
                    <ReactLeaflet.Polyline key={"line" + i + "_" + j} color={'black'} weight={2} opacity={1}
                                           positions={layers[j].getLatLngs()}>
                        <ReactLeaflet.Popup>
                            <div>
                                {lines[i].title}: <br/>{layers[j].feature.properties[lines[i].popup]}
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
                iconUrl:       'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png',
                shadowUrl:     'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png',
                iconSize:    [25, 41],
                iconAnchor:  [12, 41],
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
            let layers = L.geoJSON(points[i].geom).getLayers();
            let layerList = [];
            for (let j = 0; j < layers.length; j++) {
                let point = (
                    <ReactLeaflet.Marker key={"point" + i + "_" + j} position={layers[j].getLatLng()}
                                         icon={DashLeaflet.getIcon(points[i].icon)}>
                        <ReactLeaflet.Popup>
                            <div>
                                {points[i].title}: <br/>{layers[j].feature.properties[points[i].popup]}
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
     - geom: Array of GeoJSON objects containing lines that are to be rendered on the map.
     - title: Title of line layers that are to be rendered on the map.
     - popup: Property name that is to be rendered in the popup of the lines.
     */
    lines: PropTypes.arrayOf(PropTypes.shape({
        geom: PropTypes.object.isRequired,
        titles: PropTypes.string,
        popup: PropTypes.string,
    })),

    /**
     Array containing one or many shapes of:
     - geom: GeoJSON object containing points that are to be rendered on the map.
     - title: Title of point layer that are to be rendered on the map.
     - popup: Property name that is to be rendered in the popup of the points.
     - icon: Shape for the icon that is to be rendered for the points. Attention, the iconUrl must be an
       external link and cannot be a relative link.
     */
    points: PropTypes.arrayOf(PropTypes.shape({
        geom: PropTypes.object.isRequired,
        title: PropTypes.string,
        popup: PropTypes.string,
        source: PropTypes.string,
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
    points: [],
};