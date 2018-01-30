#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )/.."
GIT_SHA=$(git rev-parse --short HEAD)
aws ecr get-login --no-include-email --region us-east-1 | sh
docker tag carrierapi-hermes:${GIT_SHA} 813448775391.dkr.ecr.us-east-1.amazonaws.com/carrierapi-hermes:${GIT_SHA}
docker tag carrierapi-hermes:${GIT_SHA} 813448775391.dkr.ecr.us-east-1.amazonaws.com/carrierapi-hermes:latest
docker push 813448775391.dkr.ecr.us-east-1.amazonaws.com/carrierapi-hermes:${GIT_SHA}
docker push 813448775391.dkr.ecr.us-east-1.amazonaws.com/carrierapi-hermes:latest
