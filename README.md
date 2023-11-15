# Outer Ring Dapp

This README provides essential information for developers and collaborators.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [License](#license)

## Introduction

Outer Ring is a web3 game and this Angular application is designed to manage web3 tokens, governance, marketplace...

## Features

Website includes the following features:

- **Home Page**: A visually landing page with site information.
- **Marketplace**: A place to buy and sell OR NFTs.
- **Lootboxes**: The place to buy the lootboxes.
- **Governance**: The place to obtain Voting Power (a token) to vote on proposals to decide game future.
- **Lands**: The place to buy Land NFTs and stake them to earn resources.
- **DeFi**: Pools and farms to earn profits staking GQ.
- **Crafting**: A system to build weapon and armor NFTs with earned materials.
- **Responsive Design**: The website is optimized for both desktop and mobile devices.

## Prerequisites

Before you can run the OR Dapp website locally, you need to have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (version 16.x or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Angular CLI](https://angular.io/cli) (for development)

## Installation

1. Clone this repository to your local machine:

   ```
   git clone https://github.com/NexxyoLabs/NLD001.Frontend.Dapp.git
   ```

2. Navigate to the project directory:

   ```
   cd NLD001.Frontend.Dapp
   ```

3. Install project dependencies:

   ```
   npm install
   ```

## Usage

To start the development server and view the website locally, run:

  ```
  ng serve
  ```

This command starts a development server, and you can access the website in your web browser at http://localhost:4200.

* If wallet connect doesn't work properly, add `--ssl true` to run as https.
* If you want to use another port, add `--port 4201` or the number of the port.
* If you want to allow access to other computers connected to the same network, add `--host 0.0.0.0`.

## Deployment

The deployment process for the OR Dapp may vary depending on your hosting platform. Angular applications can be deployed to various hosting services. Consult the documentation of your chosen hosting provider for deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
