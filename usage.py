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

po = [[47.086342, 7.140647],
      [46.272342, 8.093497],
      [46.272342, 8.093497],
      [46.524625, 6.532603],
      [47.086342, 7.140647],
      [47.399819, 8.414725],
      [47.399786, 8.414717],
      [47.399739, 8.4147],
      [47.542853, 7.617747], [47.429842, 8.364483], [47.399706, 8.414692], [47.455194, 9.628836], [46.524625, 6.532603],
      [46.766444, 7.607453], [47.006911, 8.617842], [47.006892, 8.617883], [46.272342, 8.093497], [46.272342, 8.093497],
      [45.891989, 8.974706], [45.892008, 8.974744], [46.261561, 9.016042], [46.258889, 9.016294], [47.381542, 8.219533],
      [47.381517, 8.2195], [47.693683, 8.627917], [47.69365, 8.627919], [47.164167, 9.480211], [46.154578, 8.918947],
      [47.429761, 8.364433], [46.190431, 6.125067], [47.547594, 7.614615]]


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
        markers=[
            {
                'title': 'SBB Haltestellen',
                'geom': po, #[list(reversed(point['geometry']['coordinates'])) for point in points['features']],
                'popup': [point['properties']['name'] for point in points['features']],
                'icon': {
                    'iconUrl': 'https://appstickers-cdn.appadvice.com/1193200134/821557143/09f5bff947642901256be8f4e7478fd2-8.png'
                }
            }
        ],
        circleMarkers=[{
            'title': 'Circle Markers',
            'geom': [list(reversed(point['geometry']['coordinates'])) for point in points['features']],
            'popup': [point['properties']['name'] for point in points['features']],
            'options': {
                # 'stroke': False,
                'radius': 5,
                'color': 'red',
                'opacity': 0.5,
                'fillColor': 'blue',
                'fillOpacity': 0.1
            }
        }],
        lines=[
            {
                'title': 'SBB Linien',
                'geom': [line['geometry']['coordinates'] for line in lines['features']],
                'popup': [line['properties']['Name'] for line in lines['features']]
            }
        ]
    ),
    html.Div(id='output')
])

if __name__ == '__main__':
    app.run_server(debug=True)
