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
            marker_layer: [],

        };
    }

    /**
     * Get baselayers from props and add them to the map.
     *
     * @returns {*} Single baselayer as TileLayer or multiple baselayers as TileLayers in LayersControl
     */
    static loadBaseLayers(baselayers) {
        // If there is no baselayer, return OSM
        if (!baselayers) {
            return (<ReactLeaflet.TileLayer
                url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
            />);

            // If there is a single baselayer provided, create Tilelayer and return it
        } else if (!Array.isArray(baselayers) || baselayers.length === 1) {
            let lyr = (baselayers.length === 1) ? baselayers[0] : baselayers;
            return (<ReactLeaflet.TileLayer
                url={lyr.url}
                attribution={lyr.attribution}
            />);

            // If there are multiple baselayers provided in an array, loop over them and return the baselayers in a layer
            // control element.
        } else {
            let layers = [];
            for (let i = 0; i < baselayers.length; i++) {
                let check = (i === 0) ? 'checked' : '';
                let baselayer = (<ReactLeaflet.LayersControl.BaseLayer key={'baselayer_' + i} checked={check}
                                                                       name={baselayers[i].name}>
                    <ReactLeaflet.TileLayer
                        url={baselayers[i].url}
                        attribution={baselayers[i].attribution}
                    />
                </ReactLeaflet.LayersControl.BaseLayer>);
                layers.push(baselayer);
            }
            return layers;
        }
    }


    static getOptions(options, type) {
        options = (options != null) ? options : {};
        let radius = (options.radius != null) ? options.radius: 10;
        let stroke = (options.stroke != null) ? options.stroke : true;
        let color = (options.color != null) ? options.color : 'black';
        let weight = (options.weight != null) ? options.weight : 2;
        let opacity = (options.opacity != null) ? options.opacity : 1;
        let fill = (options.fill != null) ? options.fill : true;
        let fillColor = (options.fillColor != null) ? options.fillColor : color;
        let fillOpacity = (options.fillOpacity != null) ? options.fillOpacity : 0.2;

        if (type === 'line') {
            return {
                color: color,
                weight: weight,
                opacity: opacity
            }
        }
        if (type === 'circle') {
            return {
                radius: radius,
                stroke: stroke,
                color: color,
                weight: weight,
                opacity: opacity,
                fill: fill,
                fillColor: fillColor,
                fillOpacity: fillOpacity
            }
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
                let options = this.getOptions(lines[i].options, 'line');
                let line = (
                    <ReactLeaflet.Polyline key={"line" + i + "_" + j} color={options.color} weight={options.weight}
                                           opacity={options.opacity}
                                           positions={lines[i].geom[j]}>
                        <ReactLeaflet.Popup>
                            <div dangerouslySetInnerHTML={{__html: popup}}/>
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
        if (options.iconSizeMultiplier) {
            let icons = [];
            for (let i = 0; i < options.iconSizeMultiplier.length; i++) {
                let size = (options.iconSize) ? options.iconSize.map(x => x * options.iconSizeMultiplier[i]) : [25, 25].map(x => x * options.iconSizeMultiplier[i])
                icons.push(L.icon({
                    iconUrl: options.iconUrl,
                    iconRetinaUrl: (options.iconRetinaUrl) ? options.iconRetinaUrl : options.iconUrl,
                    shadowUrl: options.shadowUrl,
                    iconSize: size,
                    iconAnchor: (options.iconAnchor) ? options.iconAnchor : size.map(x => x / 2),
                    popupAnchor: (options.popupAnchor) ? options.popupAnchor : [0, size[0] * -0.5],
                    tooltipAnchor: options.tooltipAnchor,
                    shadowSize: options.shadowSize
                }))
            }
            return icons;
        }
        let size = [25, 25]
        return L.icon({
            iconUrl: options.iconUrl,
            iconRetinaUrl: (options.iconRetinaUrl) ? options.iconRetinaUrl : options.iconUrl,
            shadowUrl: options.shadowUrl,
            iconSize: (options.iconSize) ? options.iconSize : [25, 25],
            iconAnchor: (options.iconAnchor) ? options.iconAnchor : size.map(x => x / 2),
            popupAnchor: (options.popupAnchor) ? options.popupAnchor : [0, size[0] * -0.5],
            tooltipAnchor: options.tooltipAnchor,
            shadowSize: options.shadowSize
        });
    }

    /**
     * Load points from an array of objects containing geometry (as geojson), layer title, popup property and icon source.
     *
     * @returns {Array} of Layer overlays containing feature groups of provided points
     */
    static loadMarkers(markers) {
        let marker_layers = [];
        for (let i = 0; i < markers.length; i++) {
            let layerList = [];
            for (let j = 0; j < markers[i].geom.length; j++) {
                let popup = (Array.isArray(markers[i].popup)) ? markers[i].popup[j] : markers[i].popup;
                let icon = (Array.isArray(DashLeaflet.getIcon(markers[i].icon))) ? DashLeaflet.getIcon(markers[i].icon)[j] : DashLeaflet.getIcon(markers[i].icon);
                let marker = (
                    <ReactLeaflet.Marker key={"marker" + i + "_" + j} position={markers[i].geom[j]}
                                         icon={icon}>
                        <ReactLeaflet.Popup>
                            <div dangerouslySetInnerHTML={{__html: popup}}/>
                        </ReactLeaflet.Popup>
                    </ReactLeaflet.Marker>);
                layerList.push(marker);
            }
            let marker_group = (
                <ReactLeaflet.LayersControl.Overlay checked name={markers[i].title} key={"marker_layer" + i}>
                    <ReactLeaflet.FeatureGroup>
                        {layerList}
                    </ReactLeaflet.FeatureGroup>
                </ReactLeaflet.LayersControl.Overlay>);
            marker_layers.push(marker_group);
        }
        return marker_layers
    }

    /**
     * Load points from an array of objects containing geometry (as geojson), layer title, popup property and icon source.
     *
     * @returns {Array} of Layer overlays containing feature groups of provided points
     */
    static loadCircleMarkers(circleMarkers) {
        let circleMarker_layers = [];
        for (let i = 0; i < circleMarkers.length; i++) {
            let layerList = [];
            for (let j = 0; j < circleMarkers[i].geom.length; j++) {
                let popup = (Array.isArray(circleMarkers[i].popup)) ? circleMarkers[i].popup[j] : circleMarkers[i].popup;
                let options = this.getOptions(circleMarkers[i].options, 'circle')
                let radius = (Array.isArray(options.radius)) ? options.radius[j] : options.radius;
                let circleMarker = (
                    <ReactLeaflet.CircleMarker key={"circleMarker" + i + "_" + j} center={circleMarkers[i].geom[j]}
                                               radius={radius} stroke={options.stroke} color={options.color}
                                               weight={options.weight} opacity={options.opacity} fill={options.fill}
                                               fillColor={options.fillColor} fillOpacity={options.fillOpacity}>
                        <ReactLeaflet.Popup>
                            <div dangerouslySetInnerHTML={{__html: popup}}/>
                        </ReactLeaflet.Popup>
                    </ReactLeaflet.CircleMarker>);
                layerList.push(circleMarker);
            }
            let circleMarker_group = (
                <ReactLeaflet.LayersControl.Overlay checked name={circleMarkers[i].title}
                                                    key={"circleMarker_layer" + i}>
                    <ReactLeaflet.FeatureGroup>
                        {layerList}
                    </ReactLeaflet.FeatureGroup>
                </ReactLeaflet.LayersControl.Overlay>);
            circleMarker_layers.push(circleMarker_group);
        }
        return circleMarker_layers
    }

    render() {
        let mapOptions = this.props.mapOptions;

        let layers;
        // Only show layer control when there are marker/line layers or multiple base layers
        if ((!this.props.baselayer || !Array.isArray(this.props.baselayer) || this.props.baselayer.length === 1) &&
            this.props.lines.length === 0 && this.props.markers.length === 0 && this.props.circleMarkers.length === 0) {
            layers = (
                DashLeaflet.loadBaseLayers(this.props.baselayer)
            )
        } else {
            layers = (
                <ReactLeaflet.LayersControl>
                    {DashLeaflet.loadBaseLayers(this.props.baselayer)}
                    {DashLeaflet.loadLines(this.props.lines)}
                    {DashLeaflet.loadMarkers(this.props.markers)}
                    {DashLeaflet.loadCircleMarkers(this.props.circleMarkers)}
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
     - options: Shape containing element options:
     - color: Stroke color
     - weight: Stroke width in pixels
     - opacity: Stroke opacity
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
        options: PropTypes.shape({
            color: PropTypes.string,
            weight: PropTypes.number,
            opacity: PropTypes.number
        })
    })),

    /**
     Array containing one or many shapes of:
     - title: Title of marker layer that is to be rendered on the map.
     - geom: Array of arrays containing coordinates ([lat, lng]) of markers that are to be rendered on the map.
     - popup: String containing popup-text for this layer group or list of strings containing popup-texts
     - icon: Shape for the icon that is to be rendered for the markers. Attention, the iconUrl must be an
     external link and cannot be a relative link.
     */
    markers: PropTypes.arrayOf(PropTypes.shape({
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
            iconSizeMultiplier: PropTypes.arrayOf(PropTypes.number),
            iconAnchor: PropTypes.arrayOf(PropTypes.number),
            popupAnchor: PropTypes.arrayOf(PropTypes.number),
            tooltipAnchor: PropTypes.arrayOf(PropTypes.number),
            shadowSize: PropTypes.arrayOf(PropTypes.number)
        })
    })),

    /**
     Array containing one or many shapes of:
     - title: Title of marker layer that is to be rendered on the map.
     - geom: Array of arrays containing coordinates ([lat, lng]) of markers that are to be rendered on the map.
     - popup: String containing popup-text for this layer group or list of strings containing popup-texts
     - options: Shape containing element options:
     - stroke: Whether to draw stroke along the circle. Set it to false to disable borders.
     - color: Stroke color
     - weight: Stroke width in pixels
     - opacity: Stroke opacity
     - fill: Whether to fill the path with color. Set it to false to disable filling.
     - fillColor: Fill color. Defaults to color of stroke
     - fillOpacity: Fill opacity
     */
    circleMarkers: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        geom: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
        popup: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string
        ]),
        radius: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.number
        ]),
        options: PropTypes.shape({
            stroke: PropTypes.bool,
            color: PropTypes.string,
            weight: PropTypes.number,
            opacity: PropTypes.number,
            fill: PropTypes.bool,
            fillColor: PropTypes.string,
            fillOpacity: PropTypes.number
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
    markers: [],
    circleMarkers: []
};