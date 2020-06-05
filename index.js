const axios = require('axios')

const fetchData = async () => {
    return await axios.post('http://localhost:5000/api/users/login', { email: 'buryar313@gmail.com', password: '123456'},{
        headers: {
            'Content-Type':'application/json',
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWQ4OTUxN2YyZjg0ZTAwMWZjOTcxNTEiLCJlbWFpbCI6ImJ1cnlhcjMxM0BnbWFpbC5jb20iLCJpYXQiOjE1OTEyNjE0NDcsImV4cCI6MTU5MTI2NTA0N30.79KyxNonh-WEFX9hccf9-erRsIPLhz3tCyaE9NkiyzM'
        }
    })
        .then(data => {
                console.log(data.data)
                windows.localSession.set('toke', data.data.token)
        })
        .catch(err => console.log(err))
}

fetchData()