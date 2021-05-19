# Luaswap Relayer Bot

Automated relayer bot for [Luaswap Settlement](https://github.com/tomochain/luaswap-settlement).

> **WARNING**: This bot is in *pre-alpha* stage so it could harm your funds. Read the code and use it with caution.

## Download
```shell script
git clone https://github.com/tomochain/luaswap-relayer
```

## Install
1. Install [Node.js](https://nodejs.org/en/download/) if not installed.
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) if not installed.
3. Install dependencies.
```shell script
$ cd Luaswap-relayer
$ yarn
```

## Configure
### Provider

### Signer
You need an ethereum account with balances.
Copy your ethereum account **private key**.

### Write .env file
Create `.env` in the project root.
```shell script
TOMO_RPC= https://rpc.tomochain.com
TOMO_NETWORK_ID= 88
TOMO_GAS_LIMIT= 500000
TOMO_GAS_PRICE= 250000000
PRIVATE_KEY=<Your Private Kye>
```

## Run
```shell script
$ yarn start
```

## License
MIT
