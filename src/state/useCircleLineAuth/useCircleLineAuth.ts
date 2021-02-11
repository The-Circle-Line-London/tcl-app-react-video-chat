import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RoomType } from '../../types';

const TCL_JWT_COOKIE = 'circle-line-jwt';

export function getPasscode() {
  const match = window.location.href.match(/id=(.*)$/);
  const passcode = match ? match[1] : window.sessionStorage.getItem('passcode');
  return passcode;
}

export function extractIdentity() {
  var name = TCL_JWT_COOKIE + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function fetchToken(name: string, room: string, passcode: string, create_room = true) {
  const idJwt = extractIdentity();
  return fetch(process.env.REACT_APP_TOKEN_ENDPOINT || `/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${idJwt}`,
    },
    body: JSON.stringify({ passcode, create_room }),
  });
}

export function verifyPasscode(passcode: string) {
  return fetchToken('temp-name', 'temp-room', passcode, false /* create_room */).then(async res => {
    const jsonResponse = await res.json();
    return jsonResponse;
  });
}

export function getErrorMessage(message: string) {
  switch (message) {
    case 'no authorisation provided':
      return 'You do not have permission to access this session. Please log in and try again.';
    case 'no passcode provided':
      return 'No session identifier has been provided so we cannot proceed';
    case 'not a valid user':
      return 'You are not a valid user so we cannot proceed';
    case 'session not valid':
      return 'You are not allow to join the session. It may have already past or not started yet.';
    default:
      return message;
  }
}

export default function useCircleLineAuth() {
  const history = useHistory();

  const [user, setUser] = useState<{
    displayName: undefined;
    photoURL: undefined;
    passcode: string;
    pin: string;
  } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [roomType, setRoomType] = useState<RoomType>();
  const passcode = getPasscode();

  const getToken = useCallback(
    (name: string, room: string) => {
      return fetchToken(name, room, passcode || '')
        .then(async res => {
          if (res.ok) {
            return res;
          }
          const json = await res.json();
          const errorMessage = getErrorMessage(json.error?.message || res.statusText);
          throw Error(errorMessage);
        })
        .then(res => res.json())
        .then(res => {
          setRoomType(res.room_type);
          return res.token as string;
        });
    },
    [user]
  );

  useEffect(() => {
    const passcode = getPasscode();
    if (passcode) {
      verifyPasscode(passcode)
        .then(verification => {
          if (verification?.isValid) {
            setUser(verification);
            window.sessionStorage.setItem('passcode', passcode);
            //history.replace(window.location.pathname);
          }
        })
        .then(() => setIsAuthReady(true));
    } else {
      setIsAuthReady(true);
    }
  }, [history]);

  const signIn = useCallback((passcode: string) => {
    return verifyPasscode(passcode).then(verification => {
      if (verification?.isValid) {
        setUser({ passcode } as any);
        window.sessionStorage.setItem('passcode', passcode);
      } else {
        throw new Error(getErrorMessage(verification?.error));
      }
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.sessionStorage.removeItem('passcode');
    return Promise.resolve();
  }, []);

  return { user, isAuthReady, getToken, signIn, signOut, roomType };
}
