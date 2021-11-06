import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography'
import { DeleteOutline } from '@mui/icons-material';

interface goal {
    goalName: string;
    details: string;
   
  }

export default function NoteCard( {} ) {
  return (
    <div>
      <Card elevation={1}>
        <CardHeader
          action={
            <IconButton >
              <DeleteOutline />
            </IconButton>
          }
          title="New Goal"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
          this is a new goal and needs to be completed asap
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}