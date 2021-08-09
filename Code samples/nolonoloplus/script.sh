#!/bin/bash

echo "### Starting building ###"

npm run build &
wait
if [ $? -eq 0 ]
then
	echo "Succesfully created file."
else
	echo "Error could not build" >&2
fi


echo "### Building finished ###"

echo "### Moving file inside nolonolobackend/  folder"

mv  build  ../nolonolobackend/

if [ $? -eq 0 ]
then
        echo "Done."
else
        echo "Error could not finish" >&2
fi

#echo "### Starting server ###"
#nodemon ../nolonolobackend/server.js
