#!/bin/bash

# Extract all YouTube IDs from videos.ts
ids=$(grep -o '"youtubeId":"[^"]*"' src/data/videos.ts | sed 's/"youtubeId":"//g' | sed 's/"//g')

total=$(echo "$ids" | wc -l)
checked=0
broken=0

echo "Checking $total videos..."
echo ""

for id in $ids; do
  checked=$((checked + 1))
  result=$(curl -s --max-time 10 "https://noembed.com/embed?url=https://www.youtube.com/watch?v=$id" 2>&1)

  if echo "$result" | grep -q '"error"'; then
    # Get the title for this ID
    title=$(grep "$id" src/data/videos.ts | grep -o '"title":"[^"]*"' | sed 's/"title":"//g' | sed 's/"//g')
    channel=$(grep "$id" src/data/videos.ts | grep -o '"channel":"[^"]*"' | sed 's/"channel":"//g' | sed 's/"//g')
    echo "BROKEN: $id - $title ($channel)"
    broken=$((broken + 1))
  fi

  # Progress every 25 videos
  if [ $((checked % 25)) -eq 0 ]; then
    echo "Progress: $checked/$total checked, $broken broken so far"
  fi

  # Small delay to avoid rate limiting
  sleep 0.1
done

echo ""
echo "=== SUMMARY ==="
echo "Total: $total"
echo "Broken: $broken"
echo "Working: $((total - broken))"
