#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PWD=$(pwd)

$PWD/node_modules/.bin/danger $1 -d $PWD/node_modules/highvoltage-js/dangerfile.ts "${@:2}"