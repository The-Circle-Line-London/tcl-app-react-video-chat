import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { useAppState } from '../../state';
import LocalAudioLevelIndicator from '../LocalAudioLevelIndicator/LocalAudioLevelIndicator';

interface HelpDialogProps {
  open: boolean;
  onClose(): void;
}

function HelpDialog({ open, onClose }: PropsWithChildren<HelpDialogProps>) {
  const { user } = useAppState();

  console.log(user);

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle>Help</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          <p>If you are having connection problems, then try disconnecting and re-connecting.</p>
          <p>If you microphone is working then microphone inidicator should be changing when you talk.</p>
          <p>You can change your audio settings clicking 'Settings', which is next to the 'Disconnect' button.</p>
          <p>
            If you have more than 1 camera, the 'Flip Camera' button will switch between them - this is common on Phones
            and some Tablets.
          </p>
          <p>
            You can also connect by phone, using the following number <strong>0330 058 9425</strong>
          </p>
          <p>
            When you are prompted for your room number, enter <strong>{(user as any)?.pin}</strong>
          </p>
          <p>
            Top Tip: If you do connect by phone, mute your microphone and turn your speakers off - you can still use
            your screen to see the other person.
          </p>
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default HelpDialog;
