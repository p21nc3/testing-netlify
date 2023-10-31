import React, {useEffect, useState} from 'react';
import axios from 'axios'
  
  const extractRecord = (data) => {
    let final = [];
    let score=0;
    let cnt=0;
    data.map((item, idx) => {
      let responseData = {
        name:"",
        title:"",
        role: "",
        severity: "",
        email: "",
        image: "",
        color: "",
        tags:[]
    }
    
    if(item.rule.security_severity_level === 'low'){
      responseData.role = 90;
      score+=90*1.5;
      cnt+=1.5;
    }
    else if(item.rule.security_severity_level === 'medium'){
      responseData.role = 70;
      score+=70*1.3;cnt+=1.3;
    }
    else{
      responseData.role = 30;
      score+=30*1.1;cnt+=1.1;
    }
            responseData.id = item.number;
            responseData.title = item.rule.name;
            responseData.name = item.rule.id;
            
            responseData.severity = item.rule.security_severity_level;
            responseData.email = "";
            responseData.image = "" // To be done later
            responseData.color = "" // Later
            responseData.tags = [...item.rule.tags]
            final.push(responseData)
        })
        if(cnt) 
          score=score/cnt;
   return [final, score]
  }

  const extractColor = (severity) => {
    let finalColor="";
    let imgURL="";

    if(severity === 'low'){
      finalColor = 'green'
      imgURL = 'https://i.imgur.com/RuopxmJ.png'
    }
    else if(severity === 'medium'){
      finalColor = 'yellow'
      imgURL = 'https://i.imgur.com/9OPnZNk.png'
    }
    else if(severity === 'high'){
      finalColor = 'orange'
      imgURL = 'https://i.imgur.com/HttphJ3.png'
    }
    else{
      finalColor = 'red'
      imgURL = 'https://i.imgur.com/eN1KBk7.jpeg'
    }
    return {finalColor, imgURL}
  }
  export default function Example(props) {
    let {url, setScore} = props;
    const [vul, setVul] = useState([]);
    useEffect(() => {
      axios.get(url, {
        headers: {
          'Authorization': process.env.REACT_APP_GITHUB_TOKEN
        }
      }).then(function (response) {
        // handle success
        console.log("This is the response from slotList", response.data)
        const f = extractRecord(response.data)
        setScore(f[1])
        setVul(f[0]);
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        alert(error)
      })
      .then(function () {
        // always executed
      });
    }, []);
    return (
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Issues
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type of VULNERABILITY
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Score
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tags
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vul?.map((person) => (
                    <tr key={person.email}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={extractColor(person.severity).imgURL}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {person.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {person.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {person.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {person.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {person.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${person.color}-300 text-${person.color}-600`}>
                          {person.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black-800">
                        {person.tags.map(tag => (
                          <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${person.color}-300 text-${person.color}-600`}>
                            {tag}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  