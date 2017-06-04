#!bin/bash

zipFile="alexa-guess-game.zip"
funcName="alexa-guess-game"

#zip files
echo "zipping files..."
zip $zipFile -r *index.js constants.js node_modules* -x "*.DS_Store"

#upload zip file to s3
echo "uploading to s3..."
aws s3 cp $zipFile s3://alexa_mortgagecoach/

#update function
echo "updating code on lambda..."
aws lambda update-function-code --function-name $funcName \
 --s3-bucket alexa_mortgagecoach \
 --s3-key $zipFile \
 --publish
