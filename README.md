# Nova upgrade proposal

There is Tornado governance proposal for upgrade nova contract on Xdai chain.

## Tests

1. Install dependencies:

```
    yarn install
```

2. Create `.env` file with actual values from `.env.sample`.

3. Run tests:

```
    yarn test
```

4. Run linter:

```
    yarn lint
```

## Deploy

1. Check `config.js` for actual values. Take `newNovaImpl` address from README of [repository](https://github.com/tornadocash/tornado-nova/tree/l1-fee-from-user).

2. Run deploy:

```
    npx hardhat run scripts/deploy.js --network mainnet
```
