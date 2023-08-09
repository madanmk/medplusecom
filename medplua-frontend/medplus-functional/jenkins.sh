#!/bin/bash -x

directory=$(pwd)
echo "Directory is $directory"
npx kill-port 3000
npm install
npm start
echo "Successfully Deployed"
