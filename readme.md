# MOS Auto !play

A proof of concept (POC) Chrome extension that monitors chat for the '!play' command and certain emotes to automatically participate in games after reaching a certain threshold.

## Features

- **Multi-Tab Scope**: Each tab operates independently allowing multi-stream monitoring.
- **User Control**: Users can start or stop monitoring on a per-tab basis.
- **State Indication**: The extension icon changes to reflect the current state of monitoring.
- **Smart Pause**: Automatically pauses monitoring for a set time after sending '!play'.
- **Compatibility**: Works in conjunction with the 7TV extension.

## Limitations

- **No Energy Monitoring**: Users must manually keep track of their energy levels.
- **Low Player Streams**: May not auto-join in streams with very few players if the threshold is not met.
- **BetterTTV Compatibility**: Has not been tested with the BetterTTV extension.

## Installation

Currently, MOS Auto !play can be installed by loading it as an unpacked extension:

1. Download or clone the repository:
   ```bash
   git clone https://github.com/yourusername/mos-auto-play.git
2. Open Chrome and navigate to chrome://extensions/.
3. Enable Developer Mode at the top right.
4. Click "Load unpacked" and select the directory where you cloned or extracted the repository.

## Usage
1. Open a stream on your browser.
2. Click on the extension icon and select "Start Monitoring."
3. The extension icon will display three states:
    - **Stopped**: Monitoring is not active.
    - **Monitoring**: Currently monitoring the chat.
    - **Auto Paused**: Monitoring is paused after sending '!play'.

