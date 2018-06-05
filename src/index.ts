import 'reflect-metadata'
import { createKoaServer } from 'routing-controllers'

const port = process.env.PORT || 4000

const app = createKoaServer({
  cors: true,
  controllers: []
})

app.listen(port, () => {
  return console.log(`Listening on port ${port}`)
})
