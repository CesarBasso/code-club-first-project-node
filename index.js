const express = require('express')
const uuid = require('uuid')

const port = 3000

const app = express()
app.use(express.json())

/*
    -QUERY PARAMS => meusite.com/users?nome=cesar&age=27 //filtros
    -ROUTE PARAMS => /users/2 //buscar, deletar ou atualizar algo específico
*/
    // QUERY PARAMS
        // app.get('/users', (request, response) => {

        // const name = request.query.name
        // const age = request.query.age
        // ou assim que é o melhor jeito

        // const { name, age } = request.query // Destructuring assigment

        // return response.json({name: name, age: age})

    // console.log(name, age)
    // return response.send('Hello Brazil')
    // })

    // END QUERY PARAMS

    // ROUTE PARAMS

    //     app.get('/users/:id', (request, response) => {

    //       const { id } = request.params
    //       console.log(id)

    //       return response.json({id})
    // })

    // END ROUTE PARAMS

    // BODY PARAMS
    //     app.get('/users', (request, response) => {
    //         const { name, age } = request.body
    //         console.log(request.body)

    //         return response.json({ name, age })
    // })

    // END BODY PARAMS

    //Middleware => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição

    //PROJETO 1
    const users = []

    const checkUserId = (request, response, next) => {
        const { id } = request.params

        const index = users.findIndex(user => user.id === id)

        if(index < 0){
            return response.status(404).json({ message: "User not found"})
        }

        request.userIndex = index
        request.userId = id

        next()

    }


    app.get('/users', (request, response) => {
       return response.json(users)
    })

    app.post('/users', (request, response) => {
        const { name, age } = request.body

        const user = { id: uuid.v4(), name, age }

        users.push(user)

        return response.status(201).json(user)
     })

     // SEM MIDDLEWARE

    //  app.put('/users/:id', (request, response) => {
    //     const { id } = request.params
    //     const { name, age } = request.body

    //     const updateUser = { id, name, age }

    //     const index = users.findIndex(user => user.id === id)

    //     if(index < 0){
    //         return response.status(404).json({ message: "User not found"})
    //     }
        
    //     users[index] = updateUser

    //     return response.json(updateUser)
    //  })

    //  app.delete('/users/:id', (request, response) => {
    //     const { id } = request.params

    //     const index = users.findIndex(user => user.id === id)

    //     if(index < 0){
    //         return response.status(404).json({ message: "User not found"})
    //     }

    //     users.splice(index,1)

    //     return response.status(204).json()
    //  })

    // COM MIDDLEWARE

     app.put('/users/:id', checkUserId, (request, response) => {
        const { name, age } = request.body
        const index = request.userIndex
        const id = request.userId

        const updateUser = { id, name, age }
        
        users[index] = updateUser

        return response.json(updateUser)
     })

     app.delete('/users/:id', checkUserId, (request, response) => {
        const index = request.userIndex

        users.splice(index,1)

        return response.status(204).json()
     })

    // END PROJETO 1



app.listen(port, () => {
    console.log(`Server started on ${port}`)
})