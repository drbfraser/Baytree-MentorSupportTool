import express from 'express'
import cors from 'cors'
import { Request, Response } from 'express'
const PORT = process.env.PORT || 5000
const app = express()

app.use(cors({ credentials: true, origin: true }))
const mockData = {
  total: 1,
  data: [
    {
      firstname: 'Sam',
      surname: 'Kim'
    }
  ]
}

app.get('/api/volunteers/volunteer/', (_req: Request, res: Response) => {
  res.status(200).json(mockData)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
