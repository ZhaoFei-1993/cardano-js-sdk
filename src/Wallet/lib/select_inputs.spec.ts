import { expect } from 'chai'
import { selectInputsAndChangeOutput } from '.'
import { AddressType } from '..'
import { Utils, InMemoryKeyManager } from '../..'
import { hexGenerator } from '../../test/utils'
import { addressDiscoveryWithinBounds } from '../../Utils'

describe('selectInputsAndChangeOutput', () => {
  it('throws if there is insufficient inputs to cover the payment cost', () => {
    const mnemonic = Utils.generateMnemonic()
    const account = InMemoryKeyManager({ password: '', mnemonic }).publicAccount()
    const [address1, address2, address3, changeAddress] = addressDiscoveryWithinBounds({
      account,
      type: AddressType.internal,
      lowerBound: 0,
      upperBound: 5
    })

    const utxosWithAddressing = [
      { address: address1.address, value: '1000', id: hexGenerator(64), index: 0, addressing: { index: 0, change: 0 } },
      { address: address2.address, value: '1000', id: hexGenerator(64), index: 1, addressing: { index: 0, change: 0 } }
    ]

    const outputs = [
      { address: address3.address, value: '1000000' }
    ]

    expect(() => selectInputsAndChangeOutput(outputs, utxosWithAddressing, changeAddress.address)).to.throw('NotEnoughInput')
  })

  describe('FirstMatchFirst', () => {
    it('selects valid UTXOs and produces change', () => {
      const mnemonic = Utils.generateMnemonic()
      const account = InMemoryKeyManager({ password: '', mnemonic }).publicAccount()
      const [address1, address2, address3, address4, address5, change] = addressDiscoveryWithinBounds({
        account,
        type: AddressType.internal,
        lowerBound: 0,
        upperBound: 5
      })

      // Any combination of these inputs will always produce change
      const utxosWithAddressing = [
        { address: address1.address, value: '600000', id: hexGenerator(64), index: 0, addressing: { index: 0, change: 0 } },
        { address: address2.address, value: '500000', id: hexGenerator(64), index: 1, addressing: { index: 0, change: 0 } },
        { address: address3.address, value: '330000', id: hexGenerator(64), index: 2, addressing: { index: 0, change: 0 } },
        { address: address4.address, value: '410000', id: hexGenerator(64), index: 3, addressing: { index: 0, change: 0 } }
      ]

      const outputs = [
        { address: address5.address, value: '10000' }
      ]

      const { inputs, changeOutput } = selectInputsAndChangeOutput(outputs, utxosWithAddressing, change.address)
      expect(inputs.length > 0).to.eql(true)
      expect(changeOutput.address).to.eql(change.address)
    })
  })
})