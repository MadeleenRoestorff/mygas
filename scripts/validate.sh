#!/usr/bin/env bash

if npx eslint --max-warnings 0 "src/"
then
    echo "eslint exit code: $?"
    echo "ES Lint Successful"
else
    echo "eslint exit code: $?"
    echo "failed ESlint" >&2
    exit 1
fi

if npx prettier --check "src/**/*.js"
then
    echo "prettier completed"
else
    echo "prettier error" >&2
    exit 1
fi

