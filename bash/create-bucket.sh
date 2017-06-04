#!bin/bash
echo "creating bucket..."
aws s3api create-bucket --bucket alexa_mortgagecoach --region us-east-1
  # --grant-full-control emailaddress=duy@mortgagecoach.com
