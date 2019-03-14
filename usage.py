import dash_leaflet
import dash
from dash.dependencies import Input, Output
import dash_html_components as html

app = dash.Dash(__name__)

app.scripts.config.serve_locally = True
app.css.config.serve_locally = True

app.layout = html.Div([
    dash_leaflet.DashLeaflet(
        id='map',
        label='test'
    ),
    html.Div(id='output')
])

if __name__ == '__main__':
    app.run_server(debug=True)
