'use client'
import * as api from "../../api/api"
import {useState} from "react"
import {useRouter} from "next/navigation"

export default function LoginForm (){
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const router = useRouter();

    let validate = async (userName, userId) => {
        const persons = await api.getPersons();
        const isValid = persons.some(person => person.id == userId && person.name == userName);
        console.log(isValid); 
        return isValid; 
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const valid = await validate(userName, userId);
        if (valid){
            router.push('/calendar');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="userName">Name:</label>
                <input id="name" onChange={(e) => {setUserName(e.target.value)}}/>
            </div>
            <div>
                <label htmlFor="userId">Id:</label>
                <input id="id" onChange={(e) => {setUserId(e.target.value)}}/>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}
