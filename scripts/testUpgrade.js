const { ethers } = require('hardhat')

async function main() {
  const [sender] = await ethers.getSigners()

  console.log('Calling contracts with the account:', sender.address)
  console.log('Account balance:', (await sender.getBalance()).toString())

  const executor = await ethers.getContractAt('TestExecutor', '0xC953965A9287d298bbECF13fd59aA3F4cE69d322')
  console.log('Executor address:', executor.address)

  const tx = await executor.connect(sender).execute('0x189A86fB2c334095efd04B1F00d0ee27A54c74f5')
  let receipt = await tx.wait()
  console.log('Upgrade receipt:', receipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
