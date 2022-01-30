const { ethers } = require('hardhat')

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())

  const Executor = await ethers.getContractFactory('TestExecutor')
  const executor = await Executor.deploy()
  await executor.deployed()

  console.log('Executor address:', executor.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
