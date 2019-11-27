import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Controls extends React.Component {
  static propTypes = {
    toggleMicrophone: PropTypes.func,
    toggleCamera: PropTypes.func,
    leave: PropTypes.func,
  };

  static defaultProps = {
    toggleMicrophone: () => null,
    toggleCamera: () => null,
    leave: () => null,
  }

  constructor(props) {
    super(props);
    this.state = {
      microphoneOn: true,
      cameraOn: true,
    };
  }

  toggleCamera = () => {
    const { cameraOn } = this.state;
    const { toggleCamera } = this.props;
    this.setState({ cameraOn: !cameraOn }, toggleCamera(!cameraOn));
  }

  toggleMicrophone = () => {
    const { microphoneOn } = this.state;
    const { toggleMicrophone } = this.props;
    this.setState({ microphoneOn: !microphoneOn }, toggleMicrophone(!microphoneOn));
  }

  render() {
    const { leave } = this.props;
    const { microphoneOn, cameraOn } = this.state;
    return (
      <div className="control-wrapper">
        <Button
          color="transparent"
          className={classnames({ active: microphoneOn })}
          onClick={this.toggleMicrophone}
        >
          <i className="icon-microphone" />
          <div className="small">{`Micro ${microphoneOn ? 'off' : 'on'}`}</div>
        </Button>
        <Button
          color="transparent"
          className={classnames({ active: cameraOn })}
          onClick={this.toggleCamera}
        >
          <i className="icon-camrecorder" />
          <div className="small">{`Camera ${cameraOn ? 'off' : 'on'}`}</div>
        </Button>
        <Button color="transparent active" onClick={leave}>
          <i className="icon-close" />
          <div className="small">Leave</div>
        </Button>
      </div>
    );
  }
}

export default Controls;
