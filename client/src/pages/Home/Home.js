/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { toast } from 'react-toastify';
import UserList from './UserList';
import Controls from './Controls';
import socket from '../../socket';
import API from '../../api';
import IncomingModal from './IncomingModal';
import OutComingModal from './OutgoingModal';
import './style.scss';

export default class Home extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { match } = props;
    const { username } = match.params;
    this.state = {
      loading: true,
      incomingUser: null,
      outgoingUser: null,
      showIncomingModal: false,
      showOutgoingModal: false,
      screenFull: 0,
      user: { username },
      users: [],
      stringeeToken: '',
    };
    this.call = null;
    this.stringeeClient = null;
  }

  componentDidMount() {
    const { user } = this.state;
    socket.emit('join', user);
    socket.addEventListener('users', this.updateUsers);
    if (window.StringeeUtil.isWebRTCSupported()) {
      this.fetchToken();
    } else {
      toast.error('WebRTC is not supported this device');
    }
  }

  componentWillUnmount() {
    socket.emit('leave');
    socket.removeEventListener('users', this.updateUsers);
    if (this.stringeeClient) {
      this.stringeeClient.disconnect();
    }
  }

  fetchToken = () => {
    const { user } = this.state;
    API.getStringeeToken({ userId: user.username }).then((response) => {
      const { data } = response;
      const stringeeToken = data.data;
      console.log(stringeeToken);
      this.setState({ stringeeToken }, this.setupStringee);
    });
  }

  setupStringee = () => {
    const { stringeeToken } = this.state;
    const stringeeClient = new window.StringeeClient();

    stringeeClient.connect(stringeeToken);

    stringeeClient.on('connect', () => {
      console.log('++++++++++++++ connected to StringeeServer');
    });
    stringeeClient.on('authen', () => {
      this.setState({ loading: false });
    });
    stringeeClient.on('incomingcall', (incomingcall) => {
      this.call = incomingcall;
      const { users } = this.state;
      const { fromNumber } = incomingcall;
      const incomingUser = _.find(users, (x) => x.username === fromNumber);
      this.setState({ showIncomingModal: true, incomingUser });
      this.settingCallEvent(incomingcall);
      console.log('++++++++++++++ incomingcall', incomingcall);
    });
    stringeeClient.on('disconnect', () => {
      console.log('++++++++++++++ disconnected: ');
    });
    this.stringeeClient = stringeeClient;
  }

  updateUsers = (users) => {
    this.setState({ users });
  }

  makeCall = (toUser) => {
    const { user } = this.state;
    const call = new window.StringeeCall(this.stringeeClient, user.username, toUser.username, true);
    this.call = call;
    window.call = call;
    this.settingCallEvent(call);
    this.setState({ outgoingUser: toUser, showOutgoingModal: true });
    call.makeCall();
  }

  settingCallEvent = (call1) => {
    call1.on('addremotestream', (stream) => {
      console.log('addremotestream');
      // reset srcObject to work around minor bugs in Chrome and Edge.
      document.getElementById('remoteVideo').srcObject = null;
      document.getElementById('remoteVideo').srcObject = stream;
    });

    call1.on('addlocalstream', (stream) => {
      console.log('addlocalstream');
      // reset srcObject to work around minor bugs in Chrome and Edge.
      document.getElementById('localVideo').srcObject = null;
      document.getElementById('localVideo').srcObject = stream;
    });

    call1.on('signalingstate', (state) => {
      console.log('signalingstate', state);
      if (_.includes([5, 6], state.code)) {
        toast.error('Call ended');
        document.getElementById('remoteVideo').srcObject = null;
        document.getElementById('localVideo').srcObject = null;
        this.setState({
          incomingUser: null,
          outgoingUser: null,
          showIncomingModal: false,
          showOutgoingModal: false,
        });
      }
      if (state.code === 3) {
        this.setState({
          showIncomingModal: false,
          showOutgoingModal: false,
        });
      }
    });

    call1.on('mediastate', (state) => {
      console.log('mediastate ', state);
      if (state.code === 2) {
        toast.error('Disconnected');
        this.hangupCall();
      }
    });

    call1.on('info', (info) => {
      console.log('info', info);
    });

    call1.on('otherdevice', (data) => {
      console.log('otherdevice', data);
    });

    call1.on('error', (state) => {
      console.log('error ', state);
    });
  }

  toggleFullscreen = (index) => {
    const { screenFull } = this.state;
    if (index === screenFull) {
      this.setState({ screenFull: 0 });
    } else {
      this.setState({ screenFull: index });
    }
  }

  acceptCall = () => {
    this.call.answer();
    this.setState({
      showIncomingModal: false,
      showOutgoingModal: false,
    });
  }

  rejectCall = () => {
    this.call.reject();
    document.getElementById('localVideo').srcObject = null;
    document.getElementById('remoteVideo').srcObject = null;
    this.setState({
      incomingUser: null,
      outgoingUser: null,
      showIncomingModal: false,
      showOutgoingModal: false,
    });
  }

  hangupCall = () => {
    this.call.hangup();
    document.getElementById('localVideo').srcObject = null;
    document.getElementById('remoteVideo').srcObject = null;
    this.setState({
      incomingUser: null,
      outgoingUser: null,
      showIncomingModal: false,
      showOutgoingModal: false,
    });
  }

  toggleCamera = (status) => {
    this.call.enableLocalVideo(status);
  }

  toggleMicrophone = (status) => {
    this.call.mute(!status);
  }

  render() {
    const {
      user,
      users,
      incomingUser,
      outgoingUser,
      showIncomingModal,
      showOutgoingModal,
      screenFull,
      loading,
    } = this.state;
    return (
      <div className={classnames('home-page', { loading })}>
        {!incomingUser && !outgoingUser && (
          <UserList user={user} users={users} onCall={this.makeCall} />
        )}
        <div className={classnames('content-wrapper', { disabled: !incomingUser && !outgoingUser })}>
          <div className="screen-wrapper">
            <div className="screen" style={{ flexBasis: ['50%', '80%', '20%'][screenFull] }}>
              <div className="screen-content">
                <video id="localVideo" playsInline autoPlay muted />
              </div>
              <Button color="transparent" onClick={() => this.toggleFullscreen(1)}>
                <i className={`icon-size-${screenFull === 1 ? 'actual' : 'fullscreen'}`} />
              </Button>
            </div>
            <div className="screen" style={{ flexBasis: ['50%', '20%', '80%'][screenFull] }}>
              <div className="screen-content">
                <video id="remoteVideo" playsInline autoPlay />
              </div>
              <Button color="transparent" onClick={() => this.toggleFullscreen(2)}>
                <i className={`icon-size-${screenFull === 2 ? 'actual' : 'fullscreen'}`} />
              </Button>
            </div>
          </div>
          <Controls
            leave={this.hangupCall}
            toggleMicrophone={this.toggleMicrophone}
            toggleCamera={this.toggleCamera}
          />
        </div>
        {showIncomingModal && (
          <IncomingModal
            isOpen={showIncomingModal}
            user={incomingUser}
            onReject={this.rejectCall}
            onAccept={this.acceptCall}
          />
        )}
        {showOutgoingModal && (
          <OutComingModal
            isOpen={showOutgoingModal}
            user={outgoingUser}
            onHangup={this.hangupCall}
          />
        )}
      </div>
    );
  }
}
