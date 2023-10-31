import { data } from 'autoprefixer'
import React, { useEffect, useState } from 'react'
import Stats from '../components/Stats'
import Register from '../components/Register'
import axios from 'axios'

export default function Analyzer({userName}) {
  const [show, setShow] = React.useState(false);
  const [data, setData] = useState({});
  
  useEffect(() => {
    const func = (userName) => {
    console.log(userName)

    const averageFrequencyPerWeek = async (userName, repoName) => {
      const finalURI = `https://api.github.com/repos/${userName}/${repoName}/stats/code_frequency`
        let averageFrequency=0;
        axios.get(finalURI, {headers:{
          'Authorization': process.env.REACT_APP_GITHUB_TOKEN
        }}).then(res => {
            let data = res.data;
            data.map(repo => {
              averageFrequency+= Math.round((repo[1]/data.length) + (repo[2]/data.length));
              
            })
            setData(prevState => {
              let obj ={...prevState}
              obj.weeklyFrequency += Math.round(averageFrequency)/100
              return obj
            })
            return averageFrequency;
        }).catch(err => {
          console.log('CALLLLEDDDD')
          console.log(err)
        });
      }
      const userData =  async (userName)  => {
        const uri = `https://api.github.com/users/${userName}`
          // followers
          let followers=0;
          let created_at=0;
          let updated_at;
          axios.get(uri, {headers:{
            'Authorization': process.env.REACT_APP_GITHUB_TOKEN
          }}).then(res => {
            console.log('CALLLLEDDDD')
              let data = res.data;
              followers = data.followers;
              created_at = data.created_at;
              created_at = created_at.substring(0, 7) // 2020-05
              updated_at = data.updated_at.substring(0, 7);
              setData(prevState => {
                return {...prevState,  followers, created_at, updated_at}
              })
              return {followers, created_at, updated_at}
            }).catch(err => {
              console.log('CALLLLEDDDD')
              console.log(err)
            });
    }

    const repoData = async (userName) => {
      const finalURI = `https://api.github.com/users/${userName}/repos`
          
          let forks=0;
          let stars=0;
          let watchers=0;
          let weeklyFrequency=0;
          
          axios.get(finalURI, {headers:{
            'Authorization': process.env.REACT_APP_GITHUB_TOKEN
          }}).then(res => {
            console.log('CALLLLEDDDD')
              let data = res.data;
              console.log(data)
              data.map(repo => {
                  forks+=repo.forks_count;
                  stars+=repo.stargazers_count
                  watchers+=repo.watchers_count
                  averageFrequencyPerWeek(userName, repo.name)
                  pullsForCurrentRepo(userName, repo.name)
                  pullsForCurrentRepoOpen(userName, repo.name)
                })
                setData(prevState => {
                  return {...prevState,  forks, stars, watchers, weeklyFrequency}
                })
          }).catch(err => {
            console.log('CALLLLEDDDD')
            console.log(err)
          });

    }
    const pullsForCurrentRepo = (userName, repoName) => {
      const uri = `https://api.github.com/repos/${userName}/${repoName}/pulls?state=closed`
      let x = 0;
      axios.get(uri, {headers:{
        'Authorization': process.env.REACT_APP_GITHUB_TOKEN
      }}).then(res => {
          setData(prevState => {
              let obj ={...prevState, PRMerged: res.data.length}
              console.log(obj.PRMerged)
              return obj
          })
      })
  }

  const pullsForCurrentRepoOpen = (userName, repoName) => {
    // https://api.github.com/repos/octocat/Hello-World/pulls
    const uri = `https://api.github.com/repos/${userName}/${repoName}/pulls?state=open`
    let x = 0;
    axios.get(uri, {headers:{
      'Authorization': process.env.REACT_APP_GITHUB_TOKEN
    }}).then(res => {
        setData(prevState => {
            let obj ={...prevState, PROpen: res.data.length}
            console.log(obj.PROpen)
            return obj
        })
    })
}
    const orgCount = async (userName) => {
      let orgs=0;
      
        const uri = `https://api.github.com/users/${userName}`
        axios.get(uri, {headers:{
          'Authorization': process.env.REACT_APP_GITHUB_TOKEN
        }}+'/orgs').then(res => {
          console.log('CALLLLEDDDD')
          orgs = res.data.length
          setData(prevState => {
            return {...prevState, orgs}
          })
          return orgs
        }).catch(err => {
          console.log('CALLLLEDDDD')
          console.log(err)
        });
    }
      const requiredData = async (userName) => {
        let obj; 
        userData(userName).then(res => obj = res)
        let obj2; repoData(userName).then(res => obj2 = res)
        let orgs; orgCount(userName).then(res => obj = res)
          // forks_count
        return {obj2, obj, orgs};
      }
      
      return requiredData(userName)
    }
  console.log(func(userName))
  console.log(data)
  }, [])
  if(show){
    return(
      <Register lift={setShow} kind={"user"}/>
    )
  }
  return (
    <div>
<section className="text-gray-600 body-font">
  <div className="container px-5 py-24 mx-auto flex flex-wrap">
    <div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
      <div className="w-full sm:p-4 px-4 mb-6">
        {/* <h1 className="title-font font-medium text-xl mb-2 text-gray-900">There is <span className="text-orange-400"> 3.014% </span>chance that that user is <span className="text-red-400"> Malicious </span> </h1> */}
        <h1 className="title-font font-medium text-xl mb-2 text-gray-900">Analysis for {userName}</h1>
        
        <div className="leading-relaxed">After analysing the parameters of GitHub profile of the user and correlating with the critical values, our <b> Machine Learning models </b> predicts if the following user is <b> malicious/benign </b> 
      and can possibly cause threat. The following graph depicts a clustering model segregating the malicious commits from the non-malicious ones.
      </div>
      </div>
      {
        
        Object.keys(data).map((item, idx) => <Stats key={idx} count={data[item]} heading={item}/> )
      }
    </div>
    <div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
      <img className="object-cover object-center" src={`/${userName}.jpeg`} alt="stats" />
    </div>
  </div>
</section>

    </div>
  )
}
