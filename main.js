import './style.css';
import serverFilesystemSnapshot from './server-files.bin'
import { files } from './files';
import { WebContainer } from '@webcontainer/api';

/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance;

async function bootContainer() {
  // Boot WebContainer
  console.log('booting webcontainer...')
  webcontainerInstance = await WebContainer.boot();

  // Mount filesystem snapshot
  console.log('mounting snapshot...')
  const snapshotResponse = await fetch(serverFilesystemSnapshot);
  const snapshot = await snapshotResponse.arrayBuffer();
  await webcontainerInstance.mount(snapshot);

  // Run Application
  console.log('starting process...')
  const serverProcess = await webcontainerInstance.spawn('npm', ['run', 'serve']);
  serverProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
    }
  }));

  serverProcess.

  // Extract URL and Port of application
  webcontainerInstance.on('server-ready', (port, url) => {
    console.log("Server is accessible on URL: " + url);
    iframeEl.src = url + "/api/status";
  });
}

window.addEventListener('load', async () => {
  bootContainer();
});

document.querySelector('#app').innerHTML = `
<div class="container">
<div class="editor">
  <textarea>I am a textarea</textarea>
</div>
<div class="preview">
  <iframe src="loading.html"></iframe>
</div>
</div>
`;

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('iframe');

/** @type {HTMLTextAreaElement | null} */
const textareaEl = document.querySelector('textarea');