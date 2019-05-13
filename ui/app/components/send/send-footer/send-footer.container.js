import { connect } from 'react-redux'
import ethUtil from 'ethereumjs-util'
import {
  addToAddressBook,
  clearSend,
  signTokenTx,
  signTx,
} from '../../../actions'
import SendFooter from './send-footer.component'
import {
  getSelectedToken,
  getSendAmount,
  getSendEditingTransactionId,
  getSendFromObject,
  getSendTo,
  getSendToAccounts,
  getSendHexData,
  getTokenBalance,
  getUnapprovedTxs,
  getSendErrors,
  getSendCur,
  getSendWarnings,
  getJccSendWarnings,
} from '../send.selectors'
import {
  isSendFormInError,
} from './send-footer.selectors'
import {
  addressIsNew,
} from './send-footer.utils'

export default connect(mapStateToProps, mapDispatchToProps)(SendFooter)

function mapStateToProps (state) {
  return {
    amount: getSendAmount(state),
    sendCur: getSendCur(state),
    data: getSendHexData(state),
    editingTransactionId: getSendEditingTransactionId(state),
    from: getSendFromObject(state),
    inError: isSendFormInError(state),
    selectedToken: getSelectedToken(state),
    to: getSendTo(state),
    toAccounts: getSendToAccounts(state),
    tokenBalance: getTokenBalance(state),
    unapprovedTxs: getUnapprovedTxs(state),
    sendErrors: getSendErrors(state),
    warning: getSendWarnings(state),
    jccWarning: getJccSendWarnings(state),
  //  warning: state.appState.warning,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSend: () => dispatch(clearSend()),
    sign: ({ selectedToken, to, amount, from, password, sendCur }) => {
      const txParams = {
        Flags: 0,
        Fee: 0.00001,
        Account: from,
        TransactionType: 'Payment',
        Amount: {
          value: amount,
          currency: sendCur,
          issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
        },
        Destination: to,
      }
      selectedToken
        ? dispatch(signTokenTx(selectedToken.address, to, amount, txParams))
        : dispatch(signTx(from, txParams, password))
    },
    addToAddressBookIfNew: (newAddress, toAccounts, nickname = '') => {
      const hexPrefixedAddress = ethUtil.addHexPrefix(newAddress)
      if (addressIsNew(toAccounts)) {
        // TODO: nickname, i.e. addToAddressBook(recipient, nickname)
        dispatch(addToAddressBook(hexPrefixedAddress, nickname))
      }
    },
  }
}
