#!/bin/sh

#Set default value for variables
ENVIRONMENT="${ENVIRONMENT:=local}"
DEBUG="${DEBUG:=false}"

if $DEBUG; then
  echo "DOCKER ENTRYPOINT"
  echo "NODE ENV: $ENVIRONMENT"
  echo "ARGS:$@"
fi

if [[ $ENVIRONMENT == "test" ]]; then
  $DEBUG == true && echo "RUN TESTS"
  npm run dev
elif [[ $ENVIRONMENT == "dev" ]]; then
  $DEBUG == true && echo "RUN DEV WEB API IN AWS"
  npm run dev
elif [[ $ENVIRONMENT == "prod" ]]; then
  $DEBUG == true && echo "RUN WEB API"
  npm run dev
else
  $DEBUG == true &&  echo "RUN LOCAL API"
  npm run dev
fi