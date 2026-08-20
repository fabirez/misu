#!/bin/sh

MISU_BIN=misu
statusOut=$($MISU_BIN --status)

# Example waybar configuration

# "custom/misu": {
#  "format": "{text}",
#  "return-type": "json",
#  "exec": "/home/$USER/.config/waybar/scripts/misu-waybar.sh",
# "interval":1
# },

# Getting all the keys 
for key in $(echo "$statusOut" | jq -r 'keys[]'); do
  value=$(echo "$statusOut" | jq -r ".${key}")
  export "$key"="$value"
done

if [[ "$isRunning" == true ]]; then
  jq -nc \
      --arg project_sid "$projectSID" \
      --arg task_sid "$taskName" \
      --arg timer "$timer" \
  '{ text:"Working on: " + $project_sid + "/" + $task_sid + " " + $timer, class:"active" }'
fi
