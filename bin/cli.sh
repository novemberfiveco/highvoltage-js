#!/usr/bin/env bash

PWD=$(pwd)

$PWD/node_modules/.bin/danger $1 --dangerfile $PWD/node_modules/highvoltage-js/dangerfile.js "${@:2}"
