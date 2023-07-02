import 'dotenv/config'
import axios from 'axios'
import data from '../data/payload.json'

const baseUrl = `http://localhost:${process.env.MOCK_PORT}`

export const userList = async () => {
    return await axios.post(`${baseUrl}/graphql`, data, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg4MzEwMjkxLCJleHAiOjE2ODg0ODMwOTF9.h8Z6ivfD_S7IxA_JEjS2OVmOwGo6BcVCS5OUQ09guQU',
            "Content-Type": 'application/json'
        }
    })
}