// useEffect(() => {

//     const func = (userName) => {
//       const averageFrequencyPerWeek = async (userName, repoName) => {
//         const finalURI = `https://api.github.com/repos/${userName}/${repoName}/stats/code_frequency`
//           let averageFrequency=0;
//           axios.get(finalURI).then(res => {
//               let data = res.data;
//               data.map(repo => {
//                 averageFrequency+=repo[1]/data.length;
                
//               })
//               setData(prevState => {
//                 let obj ={...prevState}
//                 obj.weeklyFrequency += Math.round(averageFrequency) 
//                 return obj
//               })
//               return averageFrequency;
//           }).catch(err => console.log(err));
//         }
//         const userData =  async (userName)  => {
//           const uri = `https://api.github.com/users/${userName}`
//             // followers
//             let followers=0;
//             let created_at=0;
//             let updated_at;
//             axios.get(uri).then(res => {
//                 let data = res.data;
//                 followers = data.followers;
//                 created_at = data.created_at;
//                 created_at = created_at.substring(0, 7) // 2020-05
//                 updated_at = data.updated_at.substring(0, 7);
//                 setData(prevState => {
//                   return {...prevState,  followers, created_at, updated_at}
//                 })
//                 return {followers, created_at, updated_at}
//               }).catch(err => console.log(err));
//       }
  
//       const repoData = async (userName) => {
//         const finalURI = `https://api.github.com/users/${userName}/repos`
            
//             let forks=0;
//             let stars=0;
//             let watchers=0;
//             let weeklyFrequency=0;
            
//             axios.get(finalURI).then(res => {
//                 let data = res.data;
//                 console.log(data)
//                 data.map(repo => {
//                     forks+=repo.forks_count;
//                     stars+=repo.stargazers_count
//                     watchers+=repo.watchers_count
//                     averageFrequencyPerWeek(userName, repo.name)
//                     pullsForCurrentRepo(userName, repo.name)
//                     pullsForCurrentRepoOpen(userName, repo.name)
                    
//                   })
//                   setData(prevState => {
//                     return {...prevState,  forks, stars, watchers, weeklyFrequency}
//                   })
//             }).catch(err => console.log(err));
  
//       }
//       const pullsForCurrentRepo = (userName, repoName) => {
//         // https://api.github.com/repos/octocat/Hello-World/pulls
//         const uri = `https://api.github.com/repos/${userName}/${repoName}/pulls?state=closed`
//         let x = 0;
//         axios.get(uri).then(res => {
//             setData(prevState => {
//                 let obj ={...prevState, PRMerged: res.data.length}
//                 console.log(obj.PRMerged)
//                 return obj
//             })
//         })
//     }
  
//     const pullsForCurrentRepoOpen = (userName, repoName) => {
//       // https://api.github.com/repos/octocat/Hello-World/pulls
//       const uri = `https://api.github.com/repos/${userName}/${repoName}/pulls?state=open`
//       let x = 0;
//       axios.get(uri).then(res => {
//           setData(prevState => {
//               let obj ={...prevState, PROpen: res.data.length}
//               console.log(obj.PROpen)
//               return obj
//           })
//       })
//   }
//       const orgCount = async (userName) => {
//         let orgs=0;
//           const uri = `https://api.github.com/users/${userName}`
//           axios.get(uri+'/orgs').then(res => {
//             orgs = res.data.length
//             setData(prevState => {
//               return {...prevState, orgs}
//             })
//             return orgs
//           }).catch(err => console.log(err));
//       }
//         const requiredData = async (userName) => {
//           let obj; 
//           userData(userName).then(res => obj = res)
//           let obj2; repoData(userName).then(res => obj2 = res)
//           let orgs; orgCount(userName).then(res => obj = res)
//             // forks_count
//           return {obj2, obj, orgs};
//         }
    
//         return requiredData(userName)
//     }
//     console.log(func('torvalds'))
//     console.log(data)
//     }, [])