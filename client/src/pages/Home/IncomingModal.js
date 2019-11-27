import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const IncomingModal = ({ isOpen, onAccept, onReject, user }) => (
  <Modal isOpen={isOpen}>
    <ModalHeader>
      Cuộc gọi đến
    </ModalHeader>
    <ModalBody>
      <h5 className="text-center">{`${user && user.username}  đang gọi cho bạn`}</h5>
      <div className="text-center mt-3">
        <i className="phone-ring-animation" />
      </div>
    </ModalBody>
    <ModalFooter className="justify-content-around">
      <Button onClick={onAccept} color="success rounded-circle">
        <i className="icon-phone" />
      </Button>
      <Button onClick={onReject} color="danger rounded-circle">
        <i className="icon-call-end" />
      </Button>
    </ModalFooter>
    <audio autoPlay loop>
      <track kind="captions" />
      <source src="https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_1MG.mp3" />
    </audio>
  </Modal>
);

IncomingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default IncomingModal;
