const { ethers } = require('hardhat')
const { expect } = require('chai')

const config = require('./test.config.json')
const { getSignerFromAddress, takeSnapshot, revertSnapshot } = require('./utils')
const { generate } = require('../src/0_generateAddresses')

const ambPath = 'omnibridge/contracts/interfaces/IAMB.sol:IAMB'

const ProposalState = {
  Pending: 0,
  Active: 1,
  Defeated: 2,
  Timelocked: 3,
  AwaitingExecution: 4,
  Executed: 5,
  Expired: 6,
}

describe('General functionality tests', () => {
  let snapshotId

  let torn = config.tokenAddresses.torn
  let gov
  let tornWhale
  let proposal

  //// HELPER FN
  let getToken = async (tokenAddress) => {
    return await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20', tokenAddress)
  }

  let minewait = async (time) => {
    await ethers.provider.send('evm_increaseTime', [time])
    await ethers.provider.send('evm_mine', [])
  }

  before(async function () {
    tornWhale = await getSignerFromAddress(config.whales.torn)

    // deploy proposal
    const singletonFactory = await ethers.getContractAt(
      'SingletonFactory',
      config.singletonFactoryVerboseWrapper,
    )

    const contracts = await generate(config)

    await singletonFactory.deploy(contracts.proposalContract.bytecode, config.salt, { gasLimit: 50000000 })
    proposal = await ethers.getContractAt('NovaUpgradeProposal', contracts.proposalContract.address)

    snapshotId = await takeSnapshot()
  })

  describe('Proposal execution', () => {
    it('the proposal should be executed correctly', async () => {
      let response, id, state
      gov = (
        await ethers.getContractAt(
          'tornado-governance/contracts/v2-vault-and-gas/gas/GovernanceGasUpgrade.sol:GovernanceGasUpgrade',
          config.governance,
        )
      ).connect(tornWhale)

      await (
        await (await getToken(torn)).connect(tornWhale)
      ).approve(gov.address, ethers.utils.parseEther('1000000'))

      await gov.lockWithApproval(ethers.utils.parseEther('26000'))

      response = await gov.propose(proposal.address, 'Nova Upgrade Proposal')
      id = await gov.latestProposalIds(tornWhale.address)
      state = await gov.state(id)

      let { events } = await response.wait()
      let args = events.find(({ event }) => event == 'ProposalCreated').args
      expect(args.id).to.be.equal(id)
      expect(args.proposer).to.be.equal(tornWhale.address)
      expect(args.target).to.be.equal(proposal.address)
      expect(args.description).to.be.equal('Nova Upgrade Proposal')
      expect(state).to.be.equal(ProposalState.Pending)

      await minewait((await gov.VOTING_DELAY()).add(1).toNumber())
      await expect(gov.castVote(id, true)).to.not.be.reverted
      state = await gov.state(id)
      expect(state).to.be.equal(ProposalState.Active)
      await minewait(
        (
          await gov.VOTING_PERIOD()
        )
          .add(await gov.EXECUTION_DELAY())
          .add(96400)
          .toNumber(),
      )
      state = await gov.state(id)
      expect(state).to.be.equal(ProposalState.AwaitingExecution)

      await gov.execute(id)

      const amb = await ethers.getContractAt(ambPath, config.ethAmbBridge)
      const filter = amb.filters.UserRequestForAffirmation()
      const fromBlock = await ethers.provider.getBlock()
      events = await amb.queryFilter(filter, fromBlock.number)
      const bridgedData = events[0].args.encodedData.toString()
      expect(bridgedData.slice(106, 146)).to.be.equal(config.novaProxy.slice(2))
      expect(bridgedData.slice(196)).to.be.equal(config.newNovaImpl.slice(2))

      state = await gov.state(id)
      expect(state).to.be.equal(ProposalState.Executed)
    })
  })

  afterEach(async () => {
    await revertSnapshot(snapshotId)
    snapshotId = await takeSnapshot()
  })
})
