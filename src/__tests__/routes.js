const dependencies = require('../configurations/dependencies/index')
const { express, routes, services, schemas, swagger, middlewares, databases, mongoose } = dependencies
const _routers = express => express.Router()
const _utils = { router: _routers(express), schemas: schemas, services: services }

describe('Routes', ()=>{
    it('Routes Injection', () =>{
        let routesPath = []
        routes(_utils)(dependencies).forEach(el =>{
            el.stack.forEach(element => {
                routesPath.push(element.route.path)
            })
        })
        expect(routesPath.length).toBe(2)
        expect(routesPath[0]).toBe('/payments')
        expect(routesPath[1]).toBe('/payments/:payment')
    })
})




