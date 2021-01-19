#!/usr/bin/env bash

PWD=$(pwd)

$PWD/node_modules/.bin/danger $1 --dangerfile $PWD/node_modules/@novemberfive/highvoltage-js/packages/highvoltage-js/dangerfile.js "${@:2}"
