import React from 'react';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const UserList = ({ user, users, onCall }) => (
  <div className="user-list">
    <ListGroup>
      {users.map((u) => (
        <ListGroupItem key={u.username}>
          <div className="username">
            {u.username}
            {u.username === user.username ? ' (you)' : ''}
          </div>
          <Button
            disabled={user.username === u.username}
            color="success rounded-circle"
            onClick={() => onCall(u)}
          >
            <i className="icon-phone" />
          </Button>
        </ListGroupItem>
      ))}
    </ListGroup>
  </div>
);

UserList.propTypes = {
  user: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  onCall: PropTypes.func.isRequired,
};

export default UserList;
