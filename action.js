#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const CSV = require('csv');
// for you to change easily
const dataFolder = '/data';
const now = new Date();
const pathToData = path.join(__dirname, dataFolder, fileString(now)) + '.csv';

// read data, if needed

// if (fs.existsSync(pathToData)) {
//   data = JSON.parse(fs.readFileSync(pathToData));
// }

// scrape data, possibly using prior data
async function getData() {
  const response = await fetch(
    'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=324a75d9-3609-4276-8c87-49c754a1ec73&limit=500'
  ).then((res) => res.json());
  /*
  const response = {
    success: true,
    result: {
      resource_id: ['324a75d9-3609-4276-8c87-49c754a1ec73'],
      limit: 5,
      total: '196',
      records: [
        {
          end_of_month: '2004-03',
          preliminary: '0',
          m3: '272026.5',
          m2: '266768.6',
          m1: '59651.3',
          currency_circ: '13094.5',
          demand_deposits: '46556.8',
          qm_total: '207117.3',
          qm_fixed_deposits: '134659.7',
          qm_sgd_ncds: '3712.6',
          qm_savings_deposits: '68745.0',
          net_deposits_fin_cpy: '5257.9',
          timestamp: '1596993868',
        },
        {
          end_of_month: '2004-04',
          preliminary: '0',
          m3: '272978.1',
          m2: '267726.4',
          m1: '58602.3',
          currency_circ: '13140.0',
          demand_deposits: '45462.3',
          qm_total: '209124.1',
          qm_fixed_deposits: '137136.9',
          qm_sgd_ncds: '3719.2',
          qm_savings_deposits: '68268.0',
          net_deposits_fin_cpy: '5251.7',
          timestamp: '1596993868',
        },
        {
          end_of_month: '2004-05',
          preliminary: '0',
          m3: '276728.6',
          m2: '271603.4',
          m1: '61818.9',
          currency_circ: '13219.8',
          demand_deposits: '48599.1',
          qm_total: '209784.5',
          qm_fixed_deposits: '137720.8',
          qm_sgd_ncds: '3768.5',
          qm_savings_deposits: '68295.2',
          net_deposits_fin_cpy: '5125.2',
          timestamp: '1596993868',
        },
        {
          end_of_month: '2004-06',
          preliminary: '0',
          m3: '272364.1',
          m2: '267191.3',
          m1: '59164.0',
          currency_circ: '13229.9',
          demand_deposits: '45934.1',
          qm_total: '208027.3',
          qm_fixed_deposits: '134977.0',
          qm_sgd_ncds: '4006.6',
          qm_savings_deposits: '69043.7',
          net_deposits_fin_cpy: '5172.8',
          timestamp: '1596993868',
        },
        {
          end_of_month: '2004-07',
          preliminary: '0',
          m3: '274571.5',
          m2: '269407.4',
          m1: '60203.6',
          currency_circ: '13426.1',
          demand_deposits: '46777.5',
          qm_total: '209203.8',
          qm_fixed_deposits: '134779.2',
          qm_sgd_ncds: '5077.7',
          qm_savings_deposits: '69346.9',
          net_deposits_fin_cpy: '5164.1',
          timestamp: '1596993868',
        },
      ],
    },
  };*/
  return response.result.records;
}

// execute and persist data
getData() // no top level await... yet
  .then((data) => {
    // persist data
    console.log(data);

    writeToFile(data, path.resolve(path.join(__dirname, dataFolder, 'm2') + '.csv'), ['end_of_month', 'm2']);
    console.log('done');
  });

function writeToFile(data, filePath, cols) {
  CSV.stringify(
    data,
    {
      header: true,
      columns: [{ key: cols[0] }, { key: cols[1] }],
    },
    function (err, output) {
      console.log(output);
      fs.writeFile(filePath, output, (err) => {
        console.log('csv saved.');
      });
    }
  );
}

/**
 *
 * utils
 *
 */
function fileString(ts) {
  const year = ts.getUTCFullYear();
  const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = ts.getUTCDate().toString().toString().padStart(2, '0');
  const name = `${year}-${month}-${day}`;
  return name;
}
