#!/usr/bin/env node
'use strict';

// Ensure we can run against the HTTPS endpoint
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const rp = require('request-promise');
const {to} = require('await-to-js');
const {Parser} = require('json2csv');
const fs = require('fs');

const countries = [{
    code: 'DO',
    cities: ['Santo Domingo']
}, {
    code: 'US',
    cities: ['New York']
}];

(async () => {
    let err, results;
    for (let country of countries) { // loop through each country
        let overallResults = [];
        for (let city of country.cities) { // loop through each city (query lookup)
            let page = 1; // start at page 1
            let count = 0;
            let totalCount = 0;
            do {

                // Retrieve the data based on the query parameters
                const qs = {
                    country: country.code,
                    page,
                    q: city
                };
                [err, results] = await to(rp({
                    uri: `https://location.westernunion.com/api/locations`,
                    qs,
                    json: true
                }));
                if (err) { // break out of the script if any error is thrown
                    console.error(err);
                    process.exit();
                }
                totalCount = +results.resultCount; // store the total count of results
                overallResults = overallResults.concat(results.results); // store the overall results
                page += 1; // increment the page number
                count += results.results.length; // increment the count of results retrieved so far
            } while (count < totalCount);

            // Print out the results for the specified country/city combination
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(overallResults.map(({
                                                                     name,
                                                                     orig_id,
                                                                     streetAddress,
                                                                     state,
                                                                     location
                                                                 }) => ({
                name,
                orig_id,
                streetAddress,
                state,
                location
            })));
            fs.writeFileSync(`./data/wu-locations-for-${country.code}-${city}.csv`, csv)
        }
    }
})()
