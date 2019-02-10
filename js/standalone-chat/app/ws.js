'use strict';

var router = require('./router.js');
var express = require('express');
var config = require('./config.json');

module.exports = dbc => {
  var router = express.Router();

  function _getType(baseUrl) {
    switch (baseUrl) {
      case config.ns + '/users':
        return 'User';
      case config.ns + '/hotels':
        return 'Hotel';
      case config.ns + '/rooms':
        return 'Room';
      case config.ns + '/bookings':
        return 'Booking';
      case config.ns + '/reviews':
        return 'Review';
      case config.ns + '/facilities':
        return 'Facility';
      case config.ns + '/categories':
        return 'Category';
      case config.ns + '/locations':
        return 'Location';
      case config.ns + '/media':
        return 'Media';
      default:
        return 'Nothing';
    }
  };

  /* GET REQUESTS */
  router.get('/', (req, res, next) => {
    var entries = dbc.all();
    var type = _getType(req.baseUrl);

    var json = {
      '@context': config.ns + '/contexts/collection',
      '@type': 'Collection',
      '@id': config.ns + req.baseUrl,
      members: []
    };

    entries.forEach(entry => {
      json.members.push({
        '@id': entry.id,
        '@type': 'vocab:' + type
      });
    });

    res.send(json);
    next();
  });

  /* POST REQUESTS */
  router.post('/', (req, res, next) => {
    if (dbc.create(req.body)) {
      res.status(201).send('Entry created!');
    } else {
      res.status(500).send('Entry not created!');
    }

    next();
  });

  /* PUT REQUESTS */
  router.put('/', (req, res, next) => {
    if (dbc.update(req.body)) {
      res.status(200).send('Entry updated!');
    } else {
      res.status(404).send('Entry not updated!');
    }

    next();
  });

  /* DELETE REQUESTS */
  router.delete('/:id', (req, res, next) => {
    if (dbc.remove(req.params.id)) {
      res.status(200).send('Entry deleted!');
    } else {
      res.status(404).send('Entry not deleted!');
    }

    next();
  });

  return router;
};
