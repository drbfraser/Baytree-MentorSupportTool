import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography'
import DoneIcon from '@mui/icons-material/DoneOutline';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';

import {lightGreen} from '@mui/material/colors';



export default function NoteCard( {} ) {
  return (
    <div>
      <Card elevation={1} sx = {{bgcolor: lightGreen[200], m: 2}}>
        <CardHeader
          
        />
        <CardContent>
        <Fab size="medium"  aria-label="add" >
        <DoneIcon/>
        </Fab>
          <Typography variant="body2" color="textSecondary">
          this is a new goal and needs to be completed asap
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}