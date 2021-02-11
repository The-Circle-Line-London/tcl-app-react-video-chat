import React, { useState } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import HelpDialog from '../../HelpDialog/HelpDialog';

import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: 'rgb(0, 0, 178)',
      },
    },
  })
);

export default function HelpButton(props: { className?: string }) {
  const classes = useStyles();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setHelpOpen(true)} className={clsx(classes.button, props.className)} data-cy-disconnect>
        Help
      </Button>

      <HelpDialog
        open={helpOpen}
        onClose={() => {
          setHelpOpen(false);
        }}
      />
    </>
  );
}
