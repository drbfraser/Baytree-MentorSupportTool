const express = require("express")
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors({credentials: true, origin:true}))

app.get("/api/volunteers/volunteer/", (req, res) => {
  res.json({
    total: 1,
    data:   [
        {
          firstname: 'Sam',
          surname: 'Kim'
        }

      ]

  });
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})