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


def swapCoords(x):
    out = []
    for iter in x:
        if isinstance(iter, list):
            out.append(swapCoords(iter))
        else:
            return [x[1], x[0]]
    return out


for feature in lines['features']:
    feature['geometry']['coordinates'] = swapCoords(feature['geometry']['coordinates'])

app.layout = html.Div([
    dash_leaflet.DashLeaflet(
        id='map',
        mapOptions={
            'bounds': [[47.82, 10.50], [45.80, 5.93]],
            'maxZoom': 18,
            'maxBounds': [[47.82, 10.50], [45.80, 5.93]]
        },
        style={'height': '95vh'},
        baselayer=[
            {
                'name': 'Carto Light',
                'url': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }, {
                'name': 'Satellite',
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                'attribution': 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }],
        points=[
            {
                'title': 'SBB Haltestellen',
                'geom': [list(reversed(point['geometry']['coordinates'])) for point in points['features']],
                'popup': [point['properties']['name'] for point in points['features']],
                'icon': {
                    'iconUrl': 'https://appstickers-cdn.appadvice.com/1193200134/821557143/09f5bff947642901256be8f4e7478fd2-8.png'
                }
            }
        ],
        lines=[
            {
                'title': 'SBB Linien',
                'geom': [line['geometry']['coordinates'] for line in lines['features']],
                'popup': [line['properties']['Name'] for line in lines['features']]
            }
        ]
        # lines=[
        #     {
        #         'geom': lines,
        #         'title': 'Liniennetz SBB',
        #         'popup': 'Name'
        #     }
        # ],
        # points=[
        #     {
        #         'geom': points,
        #         'title': 'SBB Haltestellen',
        #         'popup': 'name',
        #         'icon': {
        #             'iconUrl': 'https://appstickers-cdn.appadvice.com/1193200134/821557143/09f5bff947642901256be8f4e7478fd2-8.png'
        #         }
        #     }
        # ]
    ),
    html.Div(id='output')
])

if __name__ == '__main__':
    app.run_server(debug=True)
