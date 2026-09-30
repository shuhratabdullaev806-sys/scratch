import {Config} from '@remotion/cli/config';
import fs from 'fs';

const chromium = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(chromium)) {
  Config.setBrowserExecutable(chromium);
}
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
