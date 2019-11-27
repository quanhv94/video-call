import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const OutgoingModal = ({ isOpen, onHangup, user }) => (
  <Modal isOpen={isOpen}>
    <ModalHeader>
      Cuộc gọi đi
    </ModalHeader>
    <ModalBody>
      <h5 className="text-center">{`Bạn đang gọi cho ${user && user.username}`}</h5>
      <div className="text-center mt-3">
        <i className="phone-ring-animation" />
      </div>
    </ModalBody>
    <ModalFooter>
      <Button onClick={onHangup} color="danger rounded-circle">
        <i className="icon-call-end" />
      </Button>
    </ModalFooter>
    <audio autoPlay loop>
      <track kind="captions" />
      <source src="https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_1MG.mp3" />
    </audio>
  </Modal>
);

OutgoingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onHangup: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default OutgoingModal;
