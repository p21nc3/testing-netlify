import React, { useEffect } from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, FilterIcon, MinusSmIcon, PlusSmIcon, ViewGridIcon } from '@heroicons/react/solid'
import SlotList from '../components/SlotList'
import Register from '../components/Register'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Analyzer from './Analyzer'
const sortOptions = [
  { name: 'Highest Priority Score', href: '#', current: true },
  { name: 'Lowest Priority Score', href: '#', current: false },
  { name: 'Highest Severity', href: '#', current: false },
  { name: 'Lowest Severity', href: '#', current: false },
]

const filters = [
  {
    id: 'severity',
    name: 'SEVERITY',
    options: [
      { value: 'critical', label: 'Critical', checked: false },
      { value: 'moderate', label: 'Moderate', checked: false },
      { value: 'high', label: 'High', checked: true },
      { value: 'low', label: 'Low', checked: false }
    //   { value: 'green', label: 'Green', checked: false },
    //   { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'status',
    name: 'STATUS',
    options: [
      { value: 'accepted', label: 'Accepted', checked: false },
      { value: 'ignored', label: 'Ignored', checked: false },
      { value: 'patched', label: 'Patched', checked: true }
    ],
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function RepositoryAnalyzer({repoURL = "https://github.com/scala-network/GUI-miner"}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(true)
  const [score, setScore] = useState(100);
  const [show, setShow] = useState(true);
  const [url, setURL] = useState("");
  const [userName, setUserName] = useState([]);
   useEffect(() => {
    if(!show){
      getContributor(getName(url), getUserName(url))
    }
   }, [show])

    if(show)
      return <Register lift={setShow} setURL={setURL} kind={"repo"}/>
      
  const getContributor = async (repoName, name) => {
    const finalURI = `https://api.github.com/repos/${name}/${repoName}/contributors`
    await axios.get(finalURI, {
      headers: {
        'Authorization' : process.env.REACT_APP_GITHUB_TOKEN
      }
    }).then(res => {
      setUserName(prevState => {
        const finalData = res.data;
        let obj = [...prevState]
        finalData.map(user => obj.push(user.login))
        console.log("obj", obj)
        return obj;
      })
    }).catch(err => console.log(err));
  }
  const getSrc = (str) => {
    let slashes = 0;
    let startIndex=-1;
    let endIndex=-1;
    for(let i=0; i<str.length; i++){
      let ch = str[i];
      if(ch === '/') slashes++;
      if(slashes === 4 && startIndex===-1){
        startIndex = i;
      }
      if(slashes === 5 && endIndex===-1){
        endIndex = i;
      }
    }
    console.log(`${startIndex}, end Index ${endIndex}`);
    let ans = str.substring(startIndex, endIndex);
    return `https://github.com${ans}.png`
  }
  const getUserName = (str) => {
      let slashes = 0;
      let startIndex=-1;
      let endIndex=-1;
      for(let i=0; i<str.length; i++){
        let ch = str[i];
        if(ch === '/') slashes++;
        if(slashes === 4 && startIndex===-1){
          startIndex = i;
        }
        if(slashes === 5 && endIndex===-1){
          endIndex = i;
        }
      }
      console.log(`${startIndex}, end Index ${endIndex}`);
      let ans = str.substring(startIndex+1, endIndex);
      return ans
  }
  const getName = (str="https://github.com/scala-network/rod") => {
    let slashes = 0;
    let startIndex=-1;
    let endIndex=-1;
    for(let i=0; i<str.length; i++){
      let ch = str[i];
      if(ch === '/') slashes++;
      if(slashes === 4 && startIndex===-1){
        startIndex = i;
      }
      if(slashes === 5 && endIndex===-1){
        endIndex = i;
      }
    }
    let end;
    for(let i=endIndex+1; i<str.length; i++){
        if(str[i]==='/'){
          end = i;
          break;
        }
    }
    console.log("end", end)
    console.log(`${startIndex}, end Index ${endIndex}`);
    let ans = str.substring(endIndex+1, end);
    return ans;
  }
  // getContributor(getName(url), getUserName(url))
  return (
    <div className="bg-white">
      <div style={{marginLeft: "100px"}}>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                  <div className="px-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    
                    {filters.map((section) => (
                      <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">{section.name}</span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-baseline justify-between pt-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            <img className="h-10 w-10 rounded-full inline mr-5" src = {getSrc(url)}/>
            Repository Details of {getName(url)}
            <br />
            <span className="text-xl font-bold text-center tracking-tight text-gray-600">
              This Repository Scores 
                <span className="text-orange-400"> {score === 0 ? '100' : score} </span>
                out of 
               <span className="text-green-400" > 100 </span>
              </span>

            </h1>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                      <Menu.Item>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button type="button" className="p-2 -m-2 ml-5 sm:ml-7 text-gray-400 hover:text-gray-500">
                <span className="sr-only">View grid</span>
                <ViewGridIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FilterIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
               

                {filters.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
                <h2 className="mt-3 font-semibold">Priority Score</h2>
                <input
                  type="range"
                  name="first-name"
                  className="w-56 bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
                />
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* Replace with your content */}
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 lg:h-full" >
                <SlotList url={url.replace(getUserName(url), "Ashish-AVS")} setScore={setScore}/>
                </div>
                {userName && userName.map(user => <Analyzer userName={user}/>)}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
