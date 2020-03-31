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

const dependencies = {
  rekoSvc: reko,
  translatorSvc: translator,
  getImageBuffer
};

const analysis = new Analysis(dependencies)
const compareFaces = new CompareFaces(dependencies)

module.exports = {
  analysis: analysis.main.bind(analysis),
  compareFaces: compareFaces.main.bind(compareFaces)
}; 