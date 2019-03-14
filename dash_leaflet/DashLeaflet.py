# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class DashLeaflet(Component):
    """A DashLeaflet component.
DashLeaflet is allows to display a map in dash. Several point and line layers can be added to the map.

Keyword arguments:
- id (string; optional)
- label (string; optional)"""
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, label=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'label']
        self._type = 'DashLeaflet'
        self._namespace = 'dash_leaflet'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'label']
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
