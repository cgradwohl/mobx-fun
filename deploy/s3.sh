#!/usr/bin/env bash

if [[ -z $DEPLOY_ENV ]]; then
  echo "DEPLOY_ENV must be supplied"
  exit 1
fi

# Configure AWS client
echo "[Ok] Starting S3 deploy with AWS CLI: $(aws --version)"
aws configure set default.region us-east-1
aws configure set default.output json

# More bash-friendly output for jq
JQ="jq --raw-output --exit-status"

# Setup ENV vars based on branch name to map to AWS resource conventions
case "${DEPLOY_ENV}" in
    ("staging")
        SOURCE_FILE="app.js"
        AWS_S3_BUCKET=${STAGING_AWS_S3_BUCKET}
        AWS_ACCOUNT_ID=${STAGING_AWS_ACCOUNT_ID}
        export AWS_ACCESS_KEY_ID=${STAGING_AWS_ACCESS_KEY_ID}
        export AWS_SECRET_ACCESS_KEY=${STAGING_AWS_SECRET_ACCESS_KEY};;
    ("production")
        SOURCE_FILE="app.min.js"
        AWS_S3_BUCKET=${PRODUCTION_AWS_S3_BUCKET}
        AWS_ACCOUNT_ID=${PRODUCTION_AWS_ACCOUNT_ID}
        export AWS_ACCESS_KEY_ID=${PRODUCTION_AWS_ACCESS_KEY_ID}
        export AWS_SECRET_ACCESS_KEY=${PRODUCTION_AWS_SECRET_ACCESS_KEY};;
    (*)
        SOURCE_FILE="app.js"
        AWS_S3_BUCKET=${DEV_AWS_S3_BUCKET}
        AWS_ACCOUNT_ID=${DEV_AWS_ACCOUNT_ID}
        export AWS_ACCESS_KEY_ID=${DEV_AWS_ACCESS_KEY_ID}
        export AWS_SECRET_ACCESS_KEY=${DEV_AWS_SECRET_ACCESS_KEY};;
esac

echo "[Ok] Assuming AWS Role for account id: ${AWS_ACCOUNT_ID}"
temp_role=$(aws sts assume-role --role-arn "arn:aws:iam::${AWS_ACCOUNT_ID}:role/circleci_deploy" --role-session-name "circleci-deploy")

export AWS_ACCESS_KEY_ID="$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)"
export AWS_SECRET_ACCESS_KEY="$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)"
export AWS_SESSION_TOKEN="$(echo $temp_role | jq .Credentials.SessionToken | xargs)"

echo "[Ok] Deploying to S3 bucket: ${AWS_S3_BUCKET}"
aws s3 cp lib/${SOURCE_FILE} s3://${AWS_S3_BUCKET}/${SOURCE_FILE} --acl public-read