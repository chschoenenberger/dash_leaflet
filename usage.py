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

with open('./data/haltestellen_zug.geojson') as point_file:
    points = geojson.load(point_file)

app.layout = html.Div([
    dash_leaflet.DashLeaflet(
        id='map',
        mapOptions={
            'bounds': [[47.82, 10.50], [45.80, 5.93]],
            'minZoom': 8,
            'maxZoom': 18,
            'maxBounds': [[47.82, 10.50], [45.80, 5.93]]
        },
        style={'height': '95vh'},
        baselayer=[{
            'name': 'OSM Mapnik',
            'url': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }, {
            'name': 'Carto Light',
            'url': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }, {
            'name': 'Satellite',
            'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            'attribution': 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }],
        lines=[
            {
                'geom': lines,
                'titles': 'Liniennetz SBB',
                'popup': 'Name'
            }
        ],
        points=[
            {
                'geom': points,
                'title': 'SBB Haltestellen',
                'popup': 'name',
                'source': 'https://appstickers-cdn.appadvice.com/1193200134/821557143/09f5bff947642901256be8f4e7478fd2-8.png'
            }
        ]
    ),
    html.Div(id='output')
])

if __name__ == '__main__':
    app.run_server(debug=True)
