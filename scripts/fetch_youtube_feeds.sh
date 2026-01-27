#!/usr/bin/env bash
# Fetches YouTube RSS feeds for kids educational channels and extracts video IDs + titles.
# Usage: bash fetch_youtube_feeds.sh > videos.txt

declare -A CHANNELS=(
  ["Ms Rachel"]="UCkJFPMala0kHmGPcIFi3PVA"
  ["Numberblocks"]="UCPlwvN0w4qFSP1FllALB92w"
  ["Peppa Pig"]="UCWI-ohtRu8eEVbVAkN8DSqg"
  ["Cocomelon"]="UCbCmjCuTUZos6Inko4u57UQ"
  ["Blippi"]="UC5PYHgAzJ1wLEidB58SK6Xw"
  ["Super Simple Songs"]="UCLsooMJoIpl_7ux2jvdPB-Q"
  ["Pinkfong"]="UCcdwLMPsaU2ezNSJU1nFoBQ"
  ["Sesame Street"]="UCfOC3SmAi3UUEaLhFRPEsoQ"
  ["Little Baby Bum"]="UCEiasLUBEt7Cp1dOHHbiOhQ"
  ["Cosmic Kids Yoga"]="UC5uIZ2KOZZeQDQo_Gsi_qbQ"
  ["SciShow Kids"]="UCIBaDdAbGlFDeS33shmlD0A"
  ["National Geographic Kids"]="UCXVCgDuD_QCkI7gTKU7-tpg"
  ["Crash Course Kids"]="UCmPmNAXTER7xr3sfaKbNaBg"
  ["TED-Ed"]="UCsooa4yRKGN_zEE8iknghZA"
  ["Mark Rober"]="UCY1kMZp36IQSyNx_9h4mpCg"
  ["Kurzgesagt"]="UCsXVk37bltHxD1rDPwtNM8Q"
  ["Wild Kratts"]="UC3T-ERa6S7qkIoJazmslkbA"
  ["GoNoodle"]="UCl_3bFSVTiKsHfCkmh0Gbvg"
  ["StorylineOnline"]="UCz4e7UoiSJ5FS3K0uMUHXAA"
  ["Code.org"]="UCJyEBMU1xVP2be1LpSMtn0g"
  ["Daniel Tiger"]="UCXMqRMGjWqjLVb-regOxJhg"
  ["Bounce Patrol"]="UCby6mIvFBklGYw302tlOmYA"
  ["Dave and Ava"]="UCcJap6bkLEoOFVLKEhPps7g"
  ["ChuChu TV"]="UCBnZ16ahKA2DZ_T5W0FPUXg"
  ["Gracie's Corner"]="UC4Gp_KnBsqN1sCwbCKSSm-w"
  ["Math Antics"]="UCBuMwlP3GEgpZkkhixREi3A"
  ["Khan Academy"]="UC4a-Gbdw7vOaccHmFo40b9g"
  ["SciShow"]="UCZYTClx2T1of7BRZ86-8fow"
  ["Smarter Every Day"]="UC6107grRI4m0o2-emgoDnAA"
  ["Veritasium"]="UCHnyfMqiRRG1u-2MsSQLbXA"
)

for name in "${!CHANNELS[@]}"; do
  cid="${CHANNELS[$name]}"
  url="https://www.youtube.com/feeds/videos.xml?channel_id=${cid}"
  echo "=== ${name} (${cid}) ==="
  xml=$(curl -s "$url")
  if echo "$xml" | grep -q '<entry>'; then
    echo "$xml" | grep -oP '(?<=<yt:videoId>)[^<]+|(?<=<title>)[^<]+' | \
    paste - - | while IFS=$'\t' read -r vid title; do
      echo "  VideoID: ${vid} | Title: ${title}"
    done
  else
    echo "  (no entries found or feed unavailable)"
  fi
  echo ""
done
