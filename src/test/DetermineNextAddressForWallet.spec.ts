import { seed } from './utils/seed'
import { expect } from 'chai'
import { InMemoryKeyManager, connect } from '..'
import { mockProvider, seedMockProvider } from './utils/mock_provider'
import { AddressType } from '../Wallet'
import { addressDiscoveryWithinBounds } from '../Utils'

describe('Example: Key Derivation', () => {
  it('allows a user to determine their next receipt address', async () => {
    seedMockProvider(seed.utxos, seed.transactions)

    const mnemonic = seed.accountMnemonics.account1
    const keyManager = InMemoryKeyManager({ mnemonic, password: '' })

    const { address } = await connect(mockProvider).wallet(keyManager.publicAccount()).getNextReceivingAddress()
    const nextAddressBasedOnSeedContext = addressDiscoveryWithinBounds({
      account: keyManager.publicAccount(),
      lowerBound: 16,
      upperBound: 16,
      type: AddressType.external
    })[0].address

    expect(nextAddressBasedOnSeedContext).to.eql(address)
  })

  it('allows a user to determine their next change address', async () => {
    seedMockProvider(seed.utxos, seed.transactions)

    const mnemonic = seed.accountMnemonics.account1
    const keyManager = InMemoryKeyManager({ mnemonic, password: '' })

    const { address } = await connect(mockProvider).wallet(keyManager.publicAccount()).getNextChangeAddress()
    const nextAddressBasedOnSeedContext = addressDiscoveryWithinBounds({
      account: keyManager.publicAccount(),
      lowerBound: 0,
      upperBound: 0,
      type: AddressType.internal
    })[0].address

    expect(nextAddressBasedOnSeedContext).to.eql(address)
  })
})