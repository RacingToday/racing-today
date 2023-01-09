'use strict';

/**
 * race-track service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::race-track.race-track');
