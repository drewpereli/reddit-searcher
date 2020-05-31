#!/bin/sh

if [ -z "$AWS_ACCESS_KEY_ID" ]; then
  echo "AWS_ACCESS_KEY_ID is not set. Quitting."
  exit 1
fi

if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "AWS_SECRET_ACCESS_KEY is not set. Quitting."
  exit 1
fi

if [ -z "$AWS_S3_BUCKET" ]; then
  echo "AWS_S3_BUCKET is not set. Quitting."
  exit 1
fi

if [ -z "$SUBREDDIT_PARAMS" ]; then
  echo "SUBREDDIT_PARAMS is not set. Quitting."
  exit 1
fi

echo $SUBREDDIT_PARAMS > ./config/subreddit-params.json

npm install -g ember-cli

npm i

ember build --production

if [$? -ne 0]; then
  echo "ember build failed. Quitting."
  exit 1
fi

AWS_REGION="us-east-1"

# Create a dedicated profile for this action to avoid conflicts
# with past/future actions.
# https://github.com/jakejarvis/s3-sync-action/issues/1
aws configure --profile s3-sync-action <<-EOF > /dev/null 2>&1
${AWS_ACCESS_KEY_ID}
${AWS_SECRET_ACCESS_KEY}
${AWS_REGION}
text
EOF

# Sync using our dedicated profile and suppress verbose messages.
# All other flags are optional via the `args:` directive.
sh -c "aws s3 sync ./dist s3://$AWS_S3_BUCKET/ \
              --profile s3-sync-action \
              --no-progress \
              --delete"

if [$? -ne 0]; then
  echo "syncing s3 failed. Quitting."
  exit 1
fi

# Clear out credentials after we're done.
# We need to re-run `aws configure` with bogus input instead of
# deleting ~/.aws in case there are other credentials living there.
# https://forums.aws.amazon.com/thread.jspa?threadID=148833
aws configure --profile s3-sync-action <<-EOF > /dev/null 2>&1
null
null
null
text
EOF
