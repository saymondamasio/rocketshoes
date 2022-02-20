import GoogleLogin from 'react-google-login'
import Modal from 'react-modal'
import { useAuth } from '../../../hooks/useAuth'

Modal.setAppElement('#__next')

export function ModalLogin() {
  const { modalIsOpen, closeModal, signInWithGoogle } = useAuth()

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      overlayClassName="react-modal-overlay"
      className="react-modal"
    >
      <GoogleLogin
        clientId={
          '220386858670-8r5dq01dtrr47cu1egbu3c4lfgv80qpf.apps.googleusercontent.com'
        }
        buttonText="Log in"
        onSuccess={signInWithGoogle}
      />
    </Modal>
  )
}
