const client = require('./client')('localhost', 8000)

/**
 * Food is represented by a json with a following format
 * {'name':'name of the food', 'calories': 10 }
 * When a food is created it will get a randomly generated id 
 * and a food becomes
 * {'name':'name of the food', 'calories': 10, 'id': 'abcd1234' }
 */

describe('Food tests', () => {

    it('1. Name is not defined', async () => {

        const postResponse = await client.post('/api/food', {'calories': 100})

        expect(postResponse.code).toBe(400)
    })

    it('2. Negative calories', async () => {
        
        const postResponse = await client.post('/api/food', {'name': 'hotdog' , 'calories': -10})

        expect(postResponse.code).toBe(400)
    })

    it('3. Can create new food', async () => {
        let hotdog = {'name': 'hotdog', 'calories': 20};
        
        const postResponse = await client.post('/api/food', hotdog)
        
        expect(postResponse.code).toBe(201)
        const created = JSON.parse(postResponse.body)
        expect(created.id).toBeDefined()
        hotdog.id = created.id
        expect(created).toEqual(hotdog)
    })

    it('4. Can return the food', async () => {
        let hamburger = {'name': 'hamburger', 'calories': 220}

        const hamResponse = await client.post('/api/food', hamburger)
        const hamId = JSON.parse(hamResponse.body).id

        const getResponse = await client.get('/api/food')
        expect(getResponse.code).toBe(200)

        const getResponseBody = JSON.parse(getResponse.body)
        hamburger.id = hamId

        expect(getResponseBody).toContainEqual(hamburger)
    })

    it('5. Invalid page request', async () => {
        const getResponse = await client.get('/api/food/invalidPage')
        expect(getResponse.code).toBe(404)
    })

    it ('6. Can update food', async () => {
        let palacsinta = {'name': 'palacsinta', 'calories': 70}

        const postResponse = await client.post('/api/food', palacsinta)
        const palId = JSON.parse(postResponse.body).id
        palacsinta.id = palId

        palacsinta.name = 'csokolade'
        const putResponse = await client.put('/api/food/' + palId, palacsinta)
        expect(putResponse.code).toBe(200)

        const putResponseBody = JSON.parse(putResponse.body)
        expect(putResponseBody).toEqual(palacsinta)
    })

    it('7. Put response is invalid', async () => {
        let palacsinta = {'name': 'palacsinta', 'calories': 70}
        const putResponse = await client.put('/api/food/invalidPage', palacsinta)
        expect(putResponse.code).toBe(404)
    })

    it('8. Can delete food', async () => {
        let palacsinta = {'name': 'palacsinta', 'calories': 70}
        const postResponse = await client.post('/api/food', palacsinta)
        palacsinta.id = JSON.parse(postResponse.body).id
        
        const deleteResponse = await client.delete('/api/food/' + palacsinta.id)
        expect(deleteResponse.code).toBe(204)

        const getResponse = await client.get('/api/food')
        expect(JSON.parse(getResponse.body)).toEqual(expect.not.arrayContaining([palacsinta]))
    })

    it('9. Delete returns 404', async () => {
        let palacsinta = {'name': 'palacsinta', 'calories': 70}
        const postResponse = await client.post('/api/food', palacsinta)
        palacsinta.id = JSON.parse(postResponse.body).id
        
        const deleteResponse = await client.delete('/api/food/invalidPage' + palacsinta.id)
        expect(deleteResponse.code).toBe(404)
    })

    it('10. Url and body id is different, returns error 400', async () => {
        let csokipalacsinta = {'name': 'csokipalacsinta', 'calories': 69}
        const postResponse = await client.post('/api/food', csokipalacsinta)
        csokipalacsinta.id = JSON.parse(postResponse.body).id
        
        const putResponse = await client.put('/api/food/' + 'asd' + csokipalacsinta.id, csokipalacsinta)
        expect(putResponse.code).toBe(400)
    })

})