import dash_leaflet
import dash
from dash.dependencies import Input, Output
import dash_html_components as html

import geojson

app = dash.Dash(__name__)

app.scripts.config.serve_locally = True
app.css.config.serve_locally = True

with open('./data/sbb_network.json') as line_file:
    lines = geojson.load(line_file)

app.layout = html.Div([
    dash_leaflet.DashLeaflet(
        id='map',
        mapOptions={
            'bounds': [[47.82, 10.50], [45.80, 5.93]],
            'minZoom': 8,
            'maxZoom': 18,
            'maxBounds': [[47.82, 10.50], [45.80, 5.93]]
        },
        baselayer=[{
            'name': 'SBB Basemap',
            'url': 'https://maps.tilehosting.com/c/sbb/styles/sbb/{z}/{x}/{y}.png?key=9BD3inXxrAPHVp6fEoMN',
            'attribution': 'Powered by <a href="http://www.opendatasoft.com/" target="_blank">OpenDataSoft</a> - @ SBB Daten Portal @ swisstopo @ openstreetmap'
        }, {
            'name': 'Light',
            'url': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }, {
            'name': 'Satellit',
            'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            'attribution': 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }],
        lines={'geom': [lines], 'titles': ['Liniennetz SBB'], 'popup': ['Name']}
    ),
    html.Div(id='output')
])

if __name__ == '__main__':
    app.run_server(debug=True)
