const express     = require('express');
const MapnikStyle = require('./src/mapnik_style');
const wms         = require('./src/wms111');

let app = express();

let service = {
  title:    'D162 WMS',
  abstract: 'WMS implementation for D162',
  host:     'http://localhost:3000',
  layers: [
    {
      // human-readable title
      title: 'Sample',
      // machine-readable name
      name: 'sample',
      // EPSG:4326 bounding box for layer
      bbox: [-180, -85, 180, 85],
      // An extent object is required for each projection supported.
      // The bbox should be in the coordinates of the SRS.
      bounds: [{
        srs:  'EPSG:3857',
        bbox: [-20026376.39, -20048966.10, 20026376.39, 20048966.10]
      }],
      // Rendering output formats supported
      formats: ['image/png'],
      // Return a Promise that resolves with a Buffer containing the image
      getMap: (params) => {
        let style = new MapnikStyle('styles/nedata.xml');
        return style.renderImage({
          width:  parseInt(params.WIDTH),
          height: parseInt(params.HEIGHT),
          bbox:   params.BBOX.split(',').map(parseFloat),
          srs:    params.SRS
        });
      }
    }
  ]
};

app.get('/service', (req, res) => {
  wms(service, req.query).then((wmsResponse) => {
    res.set(wmsResponse.headers);
    res.status(wmsResponse.code);
    res.send(wmsResponse.data);
  });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
