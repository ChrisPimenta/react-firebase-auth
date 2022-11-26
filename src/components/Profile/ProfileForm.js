import { useContext } from 'react';
import { useRef } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const { token } = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredPassword = newPasswordInputRef.current.value.trim();

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBqQdEIhxadAAhnHJ_tIA2fhmzOTLVPOHI', {
      method: 'POST',
      body: JSON.stringify({
        idToken: token,
        password: enteredPassword,
        returnSecureToken: false,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      // TODO: Error handling
      if (res.ok) {
        alert('Password changed')
      }
    })

  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
