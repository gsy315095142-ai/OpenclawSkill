const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path; // Added this
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath); // And configured it

const VIDEO_PATH = path.join(__dirname, 'video.mp4');
const FRAMES_DIR = path.join(__dirname, 'frames');

if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR);
}

console.log('🎬 Starting video extraction...');
console.log(`Video: ${VIDEO_PATH}`);

ffmpeg(VIDEO_PATH)
  .on('filenames', (filenames) => {
    console.log(`📸 Will generate ${filenames.length} frames...`);
  })
  .on('end', () => {
    console.log('✅ Extraction finished!');
  })
  .on('error', (err) => {
    console.error('❌ Error:', err);
  })
  .screenshots({
    count: 10,
    folder: FRAMES_DIR,
    filename: 'thumb-%i.png', // Changed naming pattern
    size: '1280x?'
  });
