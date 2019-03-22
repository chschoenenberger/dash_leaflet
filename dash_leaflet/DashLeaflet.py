# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class DashLeaflet(Component):
    """A DashLeaflet component.
DashLeaflet is allows to display a map in dash. Several point and line layers can be added to the map.

Keyword arguments:
- id (string; optional): The id of the main element
- style (optional): The style of the main element. style has the following type: dict containing keys 'height'.
Those keys have the following types: 
  - height (string; optional)
- mapOptions (optional): The style of the main element. mapOptions has the following type: dict containing keys 'bounds', 'center', 'minBounds', 'maxBounds', 'minZoom', 'maxZoom', 'zoom'.
Those keys have the following types: 
  - bounds (list; optional)
  - center (list; optional)
  - minBounds (list; optional)
  - maxBounds (list; optional)
  - minZoom (number; optional)
  - maxZoom (number; optional)
  - zoom (number; optional)
- baselayer (optional): The baselayer(s) of the map. Can either be a single one or an array of multiple baselayers including their name.
     If no baselayer is provided, the OSM will serve as defualt.. baselayer has the following type: dict containing keys 'url', 'attribution'.
Those keys have the following types: 
  - url (string; optional)
  - attribution (string; optional) | list
- lines (optional): Object containing
     - geom: Array of GeoJSON objects containing lines that are to be rendered on the map.
     - titles: Array of titles of line layers that are to be rendered on the map.
     - popup: Array of property name that is to be rendered in the popup of the line.. lines has the following type: dict containing keys 'geom', 'titles', 'popup'.
Those keys have the following types: 
  - geom (list; optional)
  - titles (list; optional)
  - popup (list; optional)
- points (optional): Object containing
     - geom: Array of GeoJSON objects containing points that are to be rendered on the map.
     - titles: Array of titles of point layers that are to be rendered on the map.
     - popup: Array of property name that is to be rendered in the popup of the points.. points has the following type: dict containing keys 'geom', 'titles', 'popup'.
Those keys have the following types: 
  - geom (list; optional)
  - titles (list; optional)
  - popup (list; optional)

Available events: """
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, style=Component.UNDEFINED, mapOptions=Component.UNDEFINED, baselayer=Component.UNDEFINED, lines=Component.UNDEFINED, points=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'style', 'mapOptions', 'baselayer', 'lines', 'points']
        self._type = 'DashLeaflet'
        self._namespace = 'dash_leaflet'
        self._valid_wildcard_attributes =            []
        self.available_events = []
        self.available_properties = ['id', 'style', 'mapOptions', 'baselayer', 'lines', 'points']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(DashLeaflet, self).__init__(**args)

    def __repr__(self):
        if(any(getattr(self, c, None) is not None
               for c in self._prop_names
               if c is not self._prop_names[0])
           or any(getattr(self, c, None) is not None
                  for c in self.__dict__.keys()
                  if any(c.startswith(wc_attr)
                  for wc_attr in self._valid_wildcard_attributes))):
            props_string = ', '.join([c+'='+repr(getattr(self, c, None))
                                      for c in self._prop_names
                                      if getattr(self, c, None) is not None])
            wilds_string = ', '.join([c+'='+repr(getattr(self, c, None))
                                      for c in self.__dict__.keys()
                                      if any([c.startswith(wc_attr)
                                      for wc_attr in
                                      self._valid_wildcard_attributes])])
            return ('DashLeaflet(' + props_string +
                   (', ' + wilds_string if wilds_string != '' else '') + ')')
        else:
            return (
                'DashLeaflet(' +
                repr(getattr(self, self._prop_names[0], None)) + ')')
