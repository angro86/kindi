const https = require('https');
const fs = require('fs');

// Read the videos file
const content = fs.readFileSync('./src/data/videos.ts', 'utf8');
const arrayStart = content.indexOf('= [') + 2;
const arrayEnd = content.lastIndexOf('];') + 1;
const arrayContent = content.slice(arrayStart, arrayEnd);
const videos = JSON.parse(arrayContent);

console.log(`Checking ${videos.length} videos using noembed.com...\n`);

let checked = 0;
let broken = [];
let working = [];

function checkVideo(video) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'noembed.com',
      path: `/embed?url=https://www.youtube.com/watch?v=${video.youtubeId}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            broken.push({...video, reason: json.error});
          } else if (json.html) {
            working.push(video);
          } else {
            broken.push({...video, reason: 'no html field'});
          }
        } catch (e) {
          broken.push({...video, reason: 'JSON parse error: ' + e.message});
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      broken.push({...video, reason: 'Request error: ' + e.message});
      resolve();
    });

    req.setTimeout(10000, () => {
      req.destroy();
      broken.push({...video, reason: 'timeout'});
      resolve();
    });

    req.end();
  });
}

async function main() {
  // Check sequentially to avoid rate limiting
  for (let i = 0; i < videos.length; i++) {
    await checkVideo(videos[i]);
    checked++;
    if (checked % 10 === 0) {
      process.stdout.write(`\rChecked ${checked}/${videos.length}... (${broken.length} broken so far)`);
    }
    // Small delay between requests
    await new Promise(r => setTimeout(r, 50));
  }

  console.log('\n\n=== BROKEN VIDEOS ===\n');
  broken.forEach(v => {
    console.log(`ID ${v.id}: "${v.title}" (${v.channel}) - ${v.youtubeId} [${v.reason}]`);
  });

  console.log(`\n\nSUMMARY: ${broken.length} broken, ${working.length} working out of ${videos.length} total`);
}

main();
