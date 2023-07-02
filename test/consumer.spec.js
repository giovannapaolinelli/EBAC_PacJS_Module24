import 'dotenv/config'

import { Pact } from "@pact-foundation/pact"
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { userList } from '../request/user.request';

const mockProvider = new Pact({
    consumer: 'ebac-demo-store-admin',
    provider: 'ebac-demo-store-server',
    port: parseInt(process.env.MOCK_PORT),
    log: resolve(process.cwd(), 'logs', 'pact.log'),
    dir: resolve(process.cwd(), 'pacts')
})

describe('Consumer Test', () => {

    beforeAll(async () => {
        await mockProvider.setup().then(() => {
            mockProvider.addInteraction({
                uponReceiving: 'a request',
                withRequest: {
                    method: 'POST',
                    path: '/graphql',
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg4MzEwMjkxLCJleHAiOjE2ODg0ODMwOTF9.h8Z6ivfD_S7IxA_JEjS2OVmOwGo6BcVCS5OUQ09guQU',
                        "Content-Type": 'application/json'
                    },
                    body: {
                        "operationName": "users",
                        "variables": {},
                        "query": "query users($orderBy: UserOrderByInput, $skip: Float, $take: Float, $where: UserWhereInput) {\n  items: users(orderBy: $orderBy, skip: $skip, take: $take, where: $where) {\n    createdAt\n    firstName\n    id\n    lastName\n    roles\n    updatedAt\n    username\n    __typename\n  }\n  total: _usersMeta(where: $where) {\n    count\n    __typename\n  }\n}\n"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": 'application/json; charset=utf-8'
                    },
                    body: {
                        "data": {
                            "items": eachLike(
                                {
                                    "createdAt": somethingLike("2021-11-21T19:57:22.221Z"),
                                    "firstName": somethingLike("Giovanna"),
                                    "id": somethingLike("ckw9nw4h90000ouup31sak6l3"),
                                    "lastName": somethingLike("Paolinelli"),
                                    "roles": ["user"],
                                    "updatedAt": somethingLike("2021-11-23T01:09:22.828Z"),
                                    "username": somethingLike("admin"),
                                    "__typename": somethingLike("User")
                                },
                                { min: 2 }
                            ),
                            "total": {
                                "count": "2",
                                "__typename": "MetaQueryPayload"
                            }
                        }
                    }

                }
            })
        })
    })

    afterAll(() => mockProvider.finalize())
    afterEach(() => mockProvider.verify())


    it('should return user list', () => {
        userList().then(response => {
            const { firstName, lastName } = response.data.data.items[1]

            expect(response.status).toEqual(200)
            expect(firstName).toBe('Giovanna')
            expect(lastName).toBe('Paolinelli')
        })
    });
});