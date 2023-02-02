#!/usr/bin/env bash

if npx eslint --max-warnings 0 "src/"
then
    echo "ESlint exit code: $?"
    echo "ESLint Successful"
else
    echo "ESLint exit code: $?"
    echo "Failed ESlint" >&2
    exit 1
fi

if npx prettier --check "src/**/*.ts"
then
    echo "Prettier exit code: $?"
    echo "Prettier Completed"
else
    echo "Prettier Error" >&2
    exit 1
fi

