const { ethers } = require('hardhat')

async function generate(config) {
  const singletonFactory = await ethers.getContractAt('SingletonFactory', config.singletonFactory)
  
  const ProposalFactory = await ethers.getContractFactory('NovaUpgradeProposal')
  const deploymentBytecodeProposal =
    ProposalFactory.bytecode +
    ProposalFactory.interface
      .encodeDeploy([
        config.novaProxy,
        config.newNovaImpl,
        config.bridge,
        config.gasLimit,
      ])
      .slice(2)

  const proposalAddress = ethers.utils.getCreate2Address(
    singletonFactory.address,
    config.salt,
    ethers.utils.keccak256(deploymentBytecodeProposal),
  )

  const result = {
    proposalContract: {
      address: proposalAddress,
      bytecode: deploymentBytecodeProposal,
      isProxy: false,
    },
  }

  return result
}

module.exports = {
  generate,
}
