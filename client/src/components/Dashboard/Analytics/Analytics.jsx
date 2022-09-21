import React from 'react'
import { Box, Center, Text,FormControl,Select,Tabs, TabList, TabPanels, Tab, TabPanel, Spinner, useColorMode} from "@chakra-ui/react"
import {BiCheckCircle} from 'react-icons/bi'
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts';
import {getUserVideos} from '../../../services/videoService'
import {getUser} from '../../../services/usersService'
import {useMoralis} from 'react-moralis'



function Analytics() {

  const [userData, setUserData] = React.useState([])
  const [latestvideo, setLatestvideo] = React.useState({})
  const [isLoading,setIsLoading] = React.useState(true)
  const [views,setViews] = React.useState(0)
  const [followers,setFollowers] = React.useState(0)
  const {Moralis} = useMoralis();
  const account = Moralis.User.current().get("ethAddress")
  const user = account.toLowerCase()
  const {colorMode} = useColorMode()


  document.title = `Analytics`
 

  const data1 = [

    {
      name: 'Apr',
      views: 0,
    },
    {
      name: 'Mai',
      views: 0,
    },
    {
      name: 'Jun',
      views: views,
    },

  ];

  const data3 = [

    {
      name: 'Apr',
      followers: 0,
    
    },
    {
      name: 'Mai',
      followers: 0,
    
    },
    {
      name: 'Jun',
      followers: followers,
    
    },

  ];

  const data2 = [

    {
      name: 'Apr',
      watchtime: 0,
    
    },
    {
      name: 'Mai',
      watchtime: 0,
    
    },
    {
      name: 'Jun',
      watchtime: 0,
    
    },

  ];

  const getAllData = async() => {
    const userdata = await getUser(user)
    setUserData(userdata.data)
    setFollowers(userdata.data.followers.length)
    const videos = await getUserVideos(userdata.data._id)
    if(videos.data.length > 1) {
      const sortedActivities = videos.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      var lastvideo = sortedActivities[sortedActivities.length - 1]
      var views = videos.data.map((video) => {
        setViews(views => views + video.views)
      })
      setLatestvideo(lastvideo);
    }
    setIsLoading(false)
  }


  React.useEffect(() => {
    getAllData()
  },[])

    

  return (
    <Box width="100%" height="88%" bg={colorMode === 'light' ? "#F2F2F2" : "#111315"} fontFamily="heading" >
          <Center w="100%" h="100%">
            <Box width="95%" height="100%" >
                    <Box width="100%">
                        <Text width="100%" as="h1" fontSize="1.7rem" color={colorMode === "light" ? "black" : "rgb(255,255,255,0.90)" } fontFamily="sans-serif" pt={3} pb={5}  fontWeight="bold">Channel analytics</Text>
                    </Box>
                    {isLoading ? <Center w="100%" h="70vh"><Spinner 
                                    thickness='4px'
                                    color='#3EA6FF'
                                    size='xl'
                                    ariaLabel='loading'
                                    speed='0.65s'
                                    emptyColor='grey'
                                /></Center> :
                    <Box bg={colorMode === "light" ? "#2D2D2E" :"#242627"} borderRadius="5px">
                      <Center w="100%">
                        <Box d="flex" w="95%" borderBottom="1px solid rgb(255,255,255,0.2)" pt={1} pb={1} >
                          <Box w="70%" pt={2}>
                            <Text as="h3" w="10%" fontSize="1rem" pb={2} borderBottom="2px solid #3EA6FF" fontWeight="bold" color="#3EA6FF">Overview</Text>
                          </Box>
                          <Box w="30%" height="auto">
                            {colorMode === "dark" &&
                              <FormControl p="0 auto" >
                        
                                <Select bg="#242627" defaultValue='Last 7 days' fontSize="0.95rem" fontFamily="sans-serif" size="lg" border="none" _focus={{border: 'none'}} color="white" cursor="pointer">
                                <option value='Last 7 days' style={{backgroundColor : '#111315'}}>&nbsp;Last 7 days</option>
                                  <option value='Last 28 days' style={{backgroundColor : '#111315'}}>&nbsp;Last 28 days</option>
                                  <option value='Last 90 days' style={{backgroundColor : '#111315'}}>&nbsp;Last 90 days</option>
                                  <option value='Last 365 days' style={{backgroundColor : '#111315'}}>&nbsp;Last 365 days</option>
                                  <option value='Lifetime' style={{backgroundColor : '#111315'}}>&nbsp;Lifetime</option>
                                 
                                </Select>
                            </FormControl>}


                            {colorMode === "light" &&
                              <FormControl p="0 auto" >
                        
                                <Select bg="#242627" defaultValue='Last 7 days' fontSize="0.95rem" fontFamily="sans-serif" size="lg" border="none" _focus={{border: 'none'}} color="white" cursor="pointer">
                                <option value='Last 7 days' style={{backgroundColor: 'grey'}}>&nbsp;Last 7 days</option>
                                  <option value='Last 28 days' style={{backgroundColor: 'grey'}}>&nbsp;Last 28 days</option>
                                  <option value='Last 90 days' style={{backgroundColor: 'grey'}}>&nbsp;Last 90 days</option>
                                  <option value='Last 365 days' style={{backgroundColor: 'grey'}}>&nbsp;Last 365 days</option>
                                  <option value='Lifetime' style={{backgroundColor: 'grey'}}>&nbsp;Lifetime</option>
                                 
                                </Select>
                            </FormControl>}
                          </Box>
                      </Box>
                      </Center>
                      
                          <Box w="100%" h="100%" d="flex" pt={5}>
                            <Box w="70%" height="100%">
                              <Center w="100%" height="auto" pt={2}>
                                <Box w="70%">
                                    <Text as="h2" fontSize="1.45rem" fontWeight="bold" color="white">
                                      {views > 0 ? `Your channel got ${views} views in the last 7 days`:'Your channel didn’t get any views in the last 7 days'}
                                      
                                      </Text>
                                </Box>
                              </Center>
                                <Tabs pt={7} ml={8} mr={8} >
                                  <TabList border="none" >
                                    <Tab _focus={{outline : 'none'}}  pt={10} pb={10} borderRadius="5px 0px 0px 0px" _selected={{borderBottom: 'none',borderTop: '3px solid #3EA6FF', bg:"none"}} bg="#1F1F1F" border="1px solid rgb(255,255,255,0.2)" w="33%" >
                                      <Box>
                                           <Text as="h4" color="rgb(255,255,255,0.5)" fontSize="0.85rem">Views</Text>
                                          <Text as="p" fontWeight="bold" fontSize="1.2rem" color="white">{views > 1 ? views : "___" }</Text>
                                      </Box>
                                   
                                    </Tab>
                                    <Tab  _focus={{outline : 'none'}}  pt={10} pb={10} _selected={{borderBottom: 'none',borderTop: '3px solid #3EA6FF' , bg: 'none'}} w="33%" border="1px solid rgb(255,255,255,0.2)" bg="#1F1F1F">
                                      <Box>
                                           <Text as="h4" color="rgb(255,255,255,0.5)" fontSize="0.85rem">Watch time (hours)</Text>
                                          <Text as="p" fontWeight="bold" color="white">___</Text>
                                      </Box>
                                    </Tab>
                                    <Tab  _focus={{outline : 'none'}}  borderRadius="0px 5px 0px 0px" pt={10} pb={10} _selected={{borderBottom: 'none',borderTop: '3px solid #3EA6FF' , bg: 'none'}} w="33%" border="1px solid rgb(255,255,255,0.2)" bg="#1F1F1F">
                                      <Box>
                                           <Text as="h4" color="rgb(255,255,255,0.5)" fontSize="0.85rem">Followers</Text>
                                          <Text as="p" fontWeight="bold" fontSize="1.2rem" color="white">{userData?.followers.length < 1 ? "___" : <Box d="flex"> <Text>+ {userData?.followers.length}</Text> <Box pt={2} pl={3}><BiCheckCircle size="1.1rem" color="green" /></Box> </Box>}</Text>
                                      </Box>
                                    </Tab>
                                  </TabList>

                                  <TabPanels>
                                    <TabPanel>
                                    <Box>
                                      <AreaChart
                                        width={765}
                                        height={200}
                                        data={data1}
                                        margin={{
                                          top: 5,
                                          right: 30,
                                          left: 0,
                                          bottom: 0,
                                        }}
                                      >
                                        <CartesianGrid strokeDasharray="1 3" />
                                        <XAxis dataKey="name" />
                                        
                                        <Tooltip />
                                        <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                  </Box>
                                    </TabPanel>
                                    <TabPanel>
                                    <Box>
                                    <AreaChart
                                      width={765}
                                      height={200}
                                      data={data2}
                                      margin={{
                                        top: 5,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="1 3" />
                                      <XAxis dataKey="name" />
                                      
                                      <Tooltip />
                                      <Area type="monotone" dataKey="watchtime" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                  </Box>
                                    </TabPanel>
                                    <TabPanel>
                                    <Box>
                                    <AreaChart
                                      width={765}
                                      height={200}
                                      data={data3}
                                      margin={{
                                        top: 5,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="1 3" />
                                      <XAxis dataKey="name" />
                                      
                                      <Tooltip />
                                      <Area type="monotone" dataKey="followers" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                  </Box>
                                    </TabPanel>
                                  </TabPanels>
                                </Tabs>

                              
                            </Box>

                            <Box w="30%" height="100%" >
                                <Box w="90%" bg="#1F1F1F" borderRadius="10px" mt={1.5}>
                                      <Box pl={5} pt={2} pb={2} borderBottom="1px solid rgb(255,255,255,0.05)">
                                          <Text fontWeight="bold" fontSize="1.2rem" color="white">{userData?.followers.length}</Text>
                                          <Text color="rgb(255,255,255,0.5)" fontSize="0.8rem">Followers</Text>
                                       </Box>

                                       <Box pl={5} pt={2} pb={2} borderBottom="1px solid rgb(255,255,255,0.05)">
                                          <Text fontWeight="bold" fontSize="1.2rem" color="white">{views}</Text>
                                          <Text color="rgb(255,255,255,0.5)" fontSize="0.8rem">Views · Last 48 hours</Text>
                                       </Box>
                                       <Box pl={5} pt={2} pb={2} >
                                          <Text fontWeight="bold" fontSize="1.2rem" color="green" >{userData?.rewards}</Text>
                                          <Text color="rgb(255,255,255,0.5)" fontSize="0.8rem" >$YTC Earnings · Last 28 days</Text>
                                       </Box>
                                </Box>
                                <Box w="90%" bg="#1F1F1F" borderRadius="10px" mt={5}>
                                  <Center>
                                    <Box width="100%" textAlign="left" pb={2}>
                                          <Text as="h3" pt={1} pl={5} color="white">Latest video</Text>
                                          <Box height={155} >
                                            <Center width="100%" pt={2}>
                                              <Box width="85%" d="flex" justifyContent="left" bg={!latestvideo?.thumbnail ? 'black' : ''} bgImage={`url(${latestvideo?.thumbnail})`} height={135} bgSize="cover">
                                                
                                                <Box flex="1 0 auto" alignSelf="flex-end" bg="rgb(0,0,0,0.4)" w="100%" pt={2} pb={2}>
                                                
                                                        <Text pl={1} fontSize="0.75rem" fontWeight="bold" color="white" noOfLines={2}> {latestvideo?.title} </Text>
                                                     
                                                  
                                                </Box>
                                                
                                              </Box>
                                              
                                            </Center>
                                            
                                          </Box>
                                          
                                    </Box>
                                  </Center>
                                </Box>
                            </Box>
                          </Box>
                    </Box>
                      }
                

                
                    
            </Box>
            </Center>
    </Box>
  )
}

export default Analytics