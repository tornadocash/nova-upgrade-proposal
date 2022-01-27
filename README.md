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
1. Check `config.json` for actual values.

2. Run deploy:

```
    npx hardhat run scripts/deploy.js --network <network-name>
```
