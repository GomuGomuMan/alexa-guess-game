#!bin/bash

role="arn:aws:iam::445854903472:role/lambda-s3-execution-role "
handler="index.handler"
funcName="chatbot_lex"
S3Bucket="alexa_mortgagecoach"
S3Key="lex.zip"
description="This is MortgageCoach's chatbot that answers basic info about the company"

#Create function on lambda
echo "Creating function on Lambda..."
aws lambda create-function --runtime nodejs6.10 \
  --role $role \
  --handler $handler --function-name $funcName \
  --description "$description" \
  --code S3Bucket=$S3Bucket,S3Key=$S3Key
  # --s3-bucket alexa_mortgagecoach \
  # --s3-key lambda.zip
  # --zip-file fileb://~/Projects/alexa_skill/lambda.zip
