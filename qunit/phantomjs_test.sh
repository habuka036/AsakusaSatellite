#!/bin/sh
URL=file://$PWD/index.html
echo "1..16"
phantomjs run_qunit.js $URL | sed -e "s%^$URL\:[0-9]* %%g"
