import React, { useEffect, useState } from 'react'

function App(){
  const [data, setData] = useState([])
  useEffect(()=>{
      fetch('http://localhost:8081/users')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []
  )
    return(
      <div>
          <table>
            <thead>
              <th>id_employee</th>
              <th>empl_surname</th>
              <th>empl_name</th>
              
            </thead>
            <tbody>
              {data.map((d,i) => (
                <tr key={i}>
                  <td>d.id_employee</td>
                  <td>d.empl_surname</td>
                  <td>d.empl_name</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    )
}

export default App