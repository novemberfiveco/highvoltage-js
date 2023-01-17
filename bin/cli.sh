#!/usr/bin/env bash

PWD=$(pwd)

$PWD/node_modules/@novemberfiveco/highvoltage-js/node_modules/.bin/danger $1 --dangerfile $PWD/node_modules/@novemberfiveco/highvoltage-js/dangerfile.js "${@:2}"
