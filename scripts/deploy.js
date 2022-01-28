const { ethers } = require('hardhat')
const { generate } = require('../src/0_generateAddresses')
const config = require('../config')

async function deploy({ address, bytecode, singletonFactory }) {
  const contractCode = await ethers.provider.getCode(address)
  if (contractCode !== '0x') {
    console.log(`Contract ${address} already deployed. Skipping...`)
    return
  }
  await singletonFactory.deploy(bytecode, config.salt)
}

async function main() {
  const singletonFactory = await ethers.getContractAt(
    'SingletonFactory',
    config.singletonFactoryVerboseWrapper,
  )
  const contract = await generate(config)
  await deploy({ ...contract, singletonFactory })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
