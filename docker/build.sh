#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )/.."
GIT_SHA=$(git rev-parse --short HEAD)
docker build -t carrierapi-hermes:${GIT_SHA} --build-arg NODE_ENV=production .
