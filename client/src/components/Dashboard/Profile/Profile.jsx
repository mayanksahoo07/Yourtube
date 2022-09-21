import React from 'react'
import {Box, Center, Text,Avatar,Button,Spinner, SkeletonText, Skeleton, Image, Link as ChakraLink, Tooltip, useColorMode} from "@chakra-ui/react"
import {Link} from "react-router-dom"
import {getUser} from "../../../services/usersService";
import {getUserVideos} from '../../../services/videoService'
import {getAllUserCreatedNfts} from "../../../services/nftService"
import logo from '../../../assets/logo.png'
import { useMoralis } from 'react-moralis';
import { FiExternalLink } from 'react-icons/fi';

function Profile() {
     
    const {Moralis} = useMoralis()

    const [about, setAbout] = React.useState("Hello, welcome to my Yourtube channel!")
    const [username,setUsername] =  React.useState(Moralis.User.current().get("ethAddress").toLowerCase().slice(0,12))
    const [avatar, setAvatar] = React.useState("https://bafybeifgsujzqhmwznuytnynypwg2iaotji3d3whty5ymjbi6gghwcmgk4.ipfs.dweb.link/profile-avatar.png")
    const [followersCount, setFollowersCount] = React.useState(0)
    const [cover, setCover] = React.useState("https://bafybeie3mniojsxcxbvruv4hcfadymzl3c7dioj7jvffyr53rtelduys3a.ipfs.dweb.link/meta.jpeg")
    const [tab,setTab] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true)
    const [showSkeleton,setShowSkeleton] = React.useState(true)
    const skeletons = [0,1,2,3]
    const [nftsCreated,setNftsCreated] = React.useState([])
    document.title = `Profile`
    const [videos,setVideos] = React.useState([])
    const {colorMode} = useColorMode()

const getVideos = async(id) => {
  try {
    const data = await getUserVideos(id)
    if(data?.data){
        setVideos(data?.data)
    }
  }
catch (e){}
}

const getNfts = async(id) => {
  try {
    const data = await getAllUserCreatedNfts(id)
    if(data?.data){
      setNftsCreated(data?.data)
    }
  }
catch (e){}
}


  const GetUser = async() => {
    try {
      const result = await getUser(localStorage.getItem('user').toLowerCase());
      if(result.data){
           setCover(result.data.ProfileCover)
           setUsername(result.data.username.slice(0,20))
           setAvatar(result.data.ProfileAvatar)
           setFollowersCount(result.data.followers.length)
           setAbout(result.data.about)
           setIsLoading(false)
           await getVideos(result.data._id)
           setShowSkeleton(false)
           await getNfts(result?.data?.userId)
      }

    }catch {
           console.log("")
         }
        
         }
      
          ;
      

          function numFormatter(num) {
            if(num > 999 && num < 1000000){
                return (num/1000).toFixed(1) + 'K'; 
            }else if(num > 1000000){
                return (num/1000000).toFixed(1) + 'M';
            }else if(num < 900){
                return num; 
            }
        }

React.useEffect(() => {
  GetUser()
},[])

    return (
      <Box width="100%" height="88%" bg={colorMode === 'light' ? "#F2F2F2" : "#111315"} fontFamily="heading" >
            <Center w="100%" h="100%">
              <Box width="95%" height="100%" >
                      <Box width="100%">
                          <Text width="100%" as="h1" fontSize="1.7rem" color={colorMode === "light" ? "#1C1F20":"rgb(255,255,255,0.90)"} fontFamily="sans-serif" pt={3} pb={5}  fontWeight="bold">Profile</Text>
                      </Box>
                      {isLoading ? <Center w="100%" h="70vh"><Spinner 
                                    thickness='4px'
                                    color='#3EA6FF'
                                    size='xl'
                                    ariaLabel='loading'
                                    speed='0.65s'
                                    emptyColor='grey'
                                /></Center> :
                    <Box maxHeight="70vh" width="100%" overflowY="auto">
                        <Box height="20vh" width="100%" borderRadius="5px" bgImage={`url(${cover})`} bgSize="cover" bgPosition="center center">
                           
                            
                        </Box>
                        
                        <Box height="50vh">
                            <Box d="flex" pl={2} pt={2} >
                                <Box w="80%" d="flex">
                                    <Avatar src={avatar} w="4rem" h="4rem" />
                                    <Box pl={5} pt={2}>
                                        <Text as="h3" color={colorMode === "light" ? "#1C1F20" : "#D5BD31"} fontSize="1.2rem" fontWeight="bold">{username}</Text>
                                        <Text as="h4" color={colorMode === "light" ? "#595B5D" : "rgb(255,255,255,0.5)"} fontSize="0.9rem">{followersCount} Followers</Text>
                                    </Box>
                                </Box>
                                <Box w="20%" pr={2}>
                                    <Link to="/content">
                                        <Button  fontSize="1.2rem" height="75%" pb={0.5} color="white" w="100%" mt={2} bg={colorMode === "light" ? "radial-gradient(circle at top, #5B61FB , #1C1F20)" : "radial-gradient(circle at top, #7154E6 , #FB5B78)"} _hover={{bg : "radial-gradient(circle at top, #7154E6 , #FB5B78)"}} _active={{bg : 'radial-gradient(circle at top, #7154E6 , #FB5B78)'}}>Manage Videos</Button>
                                    </Link>
                                </Box>
                                
                                
                            </Box> 
                            {colorMode === "dark" && <Box d="flex" >
                                <Text onClick={() => setTab(1)} cursor="pointer" color="rgb(255,255,255,0.85)" as="h2" fontSize="1.2rem" fontWeight="bold" pt={5} pb={2} w="6%" borderBottom={tab===1 ? "2px solid rgb(255,255,255,0.85)" : ""}>Videos</Text>
                                <Text onClick={() => setTab(2)} ml={5} cursor="pointer" color="rgb(255,255,255,0.85)" as="h2" fontSize="1.2rem" fontWeight="bold" pt={5} pb={2} w="4%" borderBottom={tab===2 ? "2px solid rgb(255,255,255,0.85)" : ""}>NFTs</Text>
                                <Text onClick={() => setTab(3)} ml={5} cursor="pointer" color="rgb(255,255,255,0.85)" as="h2" fontSize="1.2rem" fontWeight="bold" pt={5} pb={2} w="5%" borderBottom={tab===3 ? "2px solid rgb(255,255,255,0.85)" : ""}>About</Text>
                            </Box>}

                            {colorMode === "light" && <Box d="flex" >
                                <Text onClick={() => setTab(1)} cursor="pointer" borderBottom={tab === 1 ? "2px solid #5B61FB" : ""} color={tab === 1 ? "#5B61FB" : "#5A5A5B"} as="h2" fontSize="1.2rem" fontWeight="bold" pt={5} pb={2} w="6%" >Videos</Text>
                                <Text onClick={() => setTab(2)} ml={5} cursor="pointer" borderBottom={tab === 2 ? "2px solid #5B61FB" : ""} color={tab === 2 ? "#5B61FB" : "#5A5A5B"} as="h2" fontSize="1.2rem" fontWeight="bold" pt={5} pb={2} w="4%" >NFTs</Text>
                                <Text onClick={() => setTab(3)} ml={5} cursor="pointer" borderBottom={tab === 3 ? "2px solid #5B61FB" : ""} color={tab === 3 ? "#5B61FB" : "#5A5A5B"} as="h2" fontSize="1.2rem" fontWeight="bold" pt={5} pb={2} w="5%" >About</Text>
                            </Box>}

                            {tab === 1  && <Box d="grid" gridTemplateColumns="4fr 4fr 4fr 4fr" rowGap={28} columnGap={5} mt={5} mr={2.5}>
                            {!showSkeleton && <>
                            {videos?.map((video) => (
                              <Link to={`/video/${video?.videoId}`}>
                                  <Box borderRadius="5px" height="10.3rem" className={colorMode === "light" ? "stream-light" : 'stream'} cursor="pointer">
                                  {
                                  /* Main Player box */
                                  
                                  }
                                <Box className={colorMode === "light" ? "stream-light__thumbnail" : "stream__thumbnail"} cursor="pointer" d="flex" height="10.3rem" bgPosition="center" bgSize="cover" justifyContent="right" bgImage={`url(${video.thumbnail})`} borderRadius="5px">
                                      
                                <Text color="white" borderRadius="2px" as="h3" w="auto" bg="rgb(0,0,0,0.3)" flex="0 1 auto" alignSelf="flex-end" mr={1}>{video.duration}</Text>
                                          
                                </Box>

                                      
                                              <Box d="flex" pt={2}>
                                                          

                                                              <Box pl={5}>
                                                                  
                                                              <Text as="h2"  color={colorMode==="light" ? "rgb(5,0,0,0.85)" : "rgb(255,255,255,0.85)"} fontWeight="500" noOfLines={2} lineHeight="1.25rem" fontSize="1rem" >{video.title}</Text>
                                                              <Text as="h2" color={colorMode === "light" ? "#595B5D":"#595B5D"} fontSize="0.8rem">{numFormatter(video.views)} views</Text>

                                                              
                                                              </Box>
                                              </Box>
                                  </Box>
                                </Link>
                            ))}
                            
                            </>
                            }

                            {showSkeleton && <>
                                {skeletons.map(() => (
                                          <Box   height="10.3rem" >
                                          {
                                          /* Main Player box */
                                          
                                          }
                                          <Box cursor="pointer"  height="10.3rem" >
                                          <Skeleton borderRadius="5px" height="100%" w="100%" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'} />
                                              
                                          </Box>
                                
                                              
                                                    <Box d="flex" mt={3}>
                                                                    
                                
                                                                    <Box pl={5}>
                                                                    <Box >
                                                                    <SkeletonText w="10rem" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'} noOfLines={3} spacing='3' />
                                                                    </Box>
                                                                          
                                
                                                                    
                                                                    </Box>
                                                    </Box>
                                          </Box>
                              ))}
                                  
                          </>
                          
                        }
                        {(!showSkeleton && videos.length < 1) &&
                            <Text pt={2} fontSize="1.1rem">You didn't publish any content yet!</Text>
                          }
      
                            </Box>}

                            {tab === 2 && <>
                            
                              {nftsCreated?.length < 1 ? <Text fontSize="1.1rem" pt={5}>You didn't create an NFT collection yet.</Text> : 
                                    
                                    <Box mt={5} d="grid" gridTemplateColumns="4fr 4fr 4fr 4fr" columnGap={5} rowGap={28} mr={3}>
                                        {nftsCreated?.map((nft) => (
                                            <Box >
                                                
                                                <Box position="relative">
                                                <Link to={`/video/${nft?.videoId?.videoId}`} >
                                                  <Box position="absolute" zIndex={20} pl={1} pt={140} textAlign="center" d="flex">
                                                    <Center>
                                                      <Text color="white" fontSize="1rem" fontWeight="bold" pr={1}>
                                                        {nft?.price}
                                                      </Text>
                                                      <Image src={logo} w="1.5rem" h="1.5rem" alt="logo" />
                                                    </Center>
                                                      
                                                  </Box>
                                                      <Box _hover={{opacity : '0.8'}} h="10.3rem" opacity="0.9" cursor="pointer" justifyContent="right" d="flex" borderRadius="5px"  bgImage={`url(${nft?.videoId?.thumbnail})`} bgSize="cover" bgPosition="center">
                                                      <Text borderRadius="2px" as="h3" w="auto" bg="rgb(0,0,0,0.3)" flex="0 1 auto" alignSelf="flex-end" mr={1}>{nft?.videoId?.duration}</Text>
                                                      </Box>
                                                </Link>
                                                    <Text pt={2} noOfLines={2}><Link to={`/video/${nft?.videoId?.videoId}`}>{nft?.name}</Link></Text>
                                                    <Box pt={0.5} w="100%" d="flex">
                                                        <Box w="45%"><Text w="100%" color={colorMode === "light" ? "#5A5A5B":"rgb(255,255,255,0.5)"} fontSize="0.8rem">{nft?.available} Available</Text></Box>
                                                        <Box w="45%"><Text w="100%" color={colorMode === "light" ? "#5A5A5B":"rgb(255,255,255,0.5)"} fontSize="0.8rem">{nft?.minted} Minted</Text></Box>
                                                        <Box w="10%">
                                                          <Tooltip label='Contract'>
                                                            <ChakraLink isExternal href={`https://polygonscan.com/address/${nft?.contract}`}>
                                                              <FiExternalLink size="1.15rem" color={colorMode === "light" ? "#5A5A5B":"rgb(255,255,255,0.5)"} />
                                                            </ChakraLink>
                                                          </Tooltip>
                                                        </Box>
                                                        
                                                      </Box>
                                                    
                                                </Box>
                                            
                                            </Box>
                                        ))}

                                    </Box> 
                                    }
                            </>}

                            {tab === 3 && <Box mt={5} w="80%"><Text fontSize="1.1rem" as="h1" fontFamily="sans-serif">{about}</Text></Box>}

                        </Box>
                    </Box>
                  }
                </Box>
            </Center>
        </Box>
  )
}

export default Profile