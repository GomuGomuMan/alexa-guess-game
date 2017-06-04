#!bin/bash

#sync module directory with Microsoft bot
echo "Syncing api modules from alexa to microsoft bot"
rsync -a modules ../microsoft_bot
