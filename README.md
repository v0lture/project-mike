# project-mike
Electron app for Project Mike

## Launching from source
Clone the project into whatever directory you choose, as long as your user has access rights to it.

`cd` into the directory and run `npm install`, this will grab and install all the required dependencies and setup Electron for you.

Once this is finished, run `npm start` to launch the app.

### Keytar
This project uses [node-keytar](https://github.com/atom/node-keytar) which requires some additional dependencies to build.

Run `npm install -g node-gyp` as an administrator or sudo. 

Note: **Python 2.7.x** is required, 3.x.x is not usable with `node-gyp`.

If you are not running Windows, try `npm install` once again to install `node-keytar` correctly.

#### Windows only:
Afterwards, run `npm install -g --production windows-build-tools` (as admin) which will install Python and Windows MS build tools needed for `node-gyp` to work correctly.

Then run `npm config set msvs_version 2015 --global` (as admin) to update the MS build tools version for `node-gyp` to use. 

[Source](https://github.com/chjj/pty.js/issues/60#issuecomment-284125481) for the above commands to fix an Windows-related issue with `node-gyp`
