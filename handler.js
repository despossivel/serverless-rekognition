'use strict';

const {
  Rekognition,
  Translate
} = require('aws-sdk');

const {
  getImageBuffer
} = require('./utils')

const Analysis = require('./analysis');
const CompareFaces = require('./compareFaces');

const reko = new Rekognition();
const translator = new Translate();

const analysis = new Analysis({
  rekoSvc: reko,
  translatorSvc: translator,
  getImageBuffer
})

const compareFaces = new CompareFaces({
  rekoSvc: reko,
  translatorSvc: translator,
  getImageBuffer
})

module.exports = {
  analysis: analysis.main.bind(analysis),
  compareFaces: compareFaces.main.bind(compareFaces)
}; 