# Image Resizer App

## Overview

The **Image Resizer App** is a desktop application built with Electron that allows users to resize images and convert them to black and white (grayscale). The app is designed to be simple and user-friendly, making it easy to quickly process images.

## Features

- **Resize Image**: Allows you to resize an image by specifying the desired width and height.
- **Convert Image to Black and White**: Convert an image to black and white (grayscale) with a single click.

## Screenshots

![Image Resizer App Screenshot](src\public\screenshot.png)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Steps

1. Clone the repository:

    ```bash
    git clonehttps://github.com/tarun2001jawla/my-first-electron-app.git
    cd image-resizer-app
    ```

2. Install the dependencies:

    ```bash
    npm install
    # or if you are using Yarn
    yarn install
    ```

3. Run the application:

    ```bash
    npm start
    # or if you are using Yarn
    yarn start
    ```

## Usage

1. **Resize Image**
   - Select an image file using the "Choose File" button.
   - Enter the desired width and height in pixels.
   - Click "Resize" to resize the image.

2. **Convert Image to Black and White**
   - Select an image file using the "Choose File" button.
   - Click "Convert to B&W" to convert the image to black and white.

## File Structure

```plaintext
├── dist
│   ├── main.js                 # Main process entry point
│   ├── renderer
│   │   ├── index.html          # Main window HTML file
│   │   ├── about.html          # About window HTML file
│   │   └── js
│   │       ├── preload.js      # Preload script
│   │       └── renderer.js     # Renderer process script
├── src
│   ├── main.ts                 # TypeScript source for main process
│   ├── renderer
│   │   ├── index.ts            # TypeScript source for renderer process
│   │   └── preload.ts          # TypeScript source for preload script
├── package.json
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
