const { ethers } = require('hardhat')

async function main() {
  const gasLimit = 200000

  // BSC TEST VALUES
  const novaProxy = '0xC953965A9287d298bbECF13fd59aA3F4cE69d322' // test one
  const newNovaImpl = '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59' // random contract
  const ethAmbBridge = '0x05185872898b6f94AA600177EF41B9334B1FA48B' // on bsc

  // MAINNET VALUES
  // const novaProxy = "0xD692Fd2D0b2Fbd2e52CFa5B5b9424bC981C30696"
  // const newNovaImpl = "TODO"
  // const ethAmbBridge = "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"

  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())

  const Proposal = await ethers.getContractFactory('NovaUpgradeProposal')
  const proposal = await Proposal.deploy(novaProxy, newNovaImpl, ethAmbBridge, gasLimit)

  console.log('Proposal address:', proposal.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
