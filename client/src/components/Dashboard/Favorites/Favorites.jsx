import React from 'react'
import {Box, Center,Text,Avatar, Tooltip, Skeleton, SkeletonCircle, SkeletonText, useColorMode} from "@chakra-ui/react";
import {AiFillCheckCircle, AiOutlineStar} from 'react-icons/ai'
import {getUserVideolikes} from '../../../services/likesService'
import {getUser} from '../../../services/usersService'
import {deleteUserVideolikes} from '../../../services/likesService'
import {getVideos} from '../../../services/videoService'
import { Link } from 'react-router-dom';
import {FaSmileWink} from 'react-icons/fa'
import {useMoralis} from 'react-moralis'

function Favorites() {
  const {Moralis} = useMoralis();
  const account = Moralis.User.current().get("ethAddress")
  const user = account.toLowerCase()
  const {colorMode} = useColorMode()
  const [userVideoLiked,setUserVideoLiked] = React.useState([])
  const [isLoading, setIsloading] = React.useState(true)
  const [recommendedVideos, setRecommendedVideos] = React.useState([])
  const skeletons = [0,1,2,3]
  document.title = `Favorites`

  const getData = async()=>{
    try{
      const userData = await getUser(user)
      const videos = await getUserVideolikes({userId : userData?.data?._id})
      if(videos?.data) {
        videos?.data.map((video) => {
          if(video?.videoId) {
            setUserVideoLiked(userVideoLiked => [...userVideoLiked, video])
          }
        })
        
        if(userVideoLiked.length < 1) {
          const videos = await getVideos(0,20)
          if(videos.data) {
            var sorted = videos.data.sort((a, b) => a.views - b.views);
            setRecommendedVideos(sorted)
          }
        }
        setIsloading(false)
      }



    }catch(e){
      console.log(e)
    }
  }
  

function numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; 
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M';
    }else if(num < 900){
        return num; 
    }
}
const handleDelete = async(id) => {
  try {
    var removeIndex = userVideoLiked.map(item => item._id).indexOf(id);
    var likes = userVideoLiked[removeIndex]
    setUserVideoLiked(userVideoLiked.filter(video => video._id !== likes._id));
    await deleteUserVideolikes({videoId : id})
  }catch(e) {}
}

  React.useEffect(() => {
    getData()
  },[])
  
  return (
    <>

    <Box width="100%" height="88%" bg={colorMode === "light" ? "#F2F2F2" : "#111315"} fontFamily="heading" >
          <Center w="100%" h="100%">
            <Box width="95%" height="100%" >
                    <Box width="100%" borderBottom={colorMode === "light" ? "1px solid #2D2D2E":"1px solid rgb(255,255,255,0.15)"}>
                        <Text width="100%" as="h1" fontSize="1.7rem" color={colorMode === "light" ? "#1C1F20" : "rgb(255,255,255,0.90)"} fontFamily="sans-serif" pt={3} pb={5}  fontWeight="bold">Favorites</Text>
                    </Box>
                    <Box overflowY="auto" height="70vh" pt={8} maxHeight="70vh" maxWidth="100%">

                      {!isLoading && <Box d="grid" gridTemplateColumns="4fr 4fr 4fr 4fr" gap={7} mr={3}>
                        {userVideoLiked?.map((video) => (
                          <Box >     
                                                   
                                <Box cursor="pointer" >
                                  <Link to={`/video/${video?.videoId?.videoId}`} >
                                    <Box  w="100%" cursor="pointer" d="flex" height="10.3rem" bgPosition="center" bgSize="cover" justifyContent="right" bgImage={`url(${video?.videoId?.thumbnail})`} borderRadius="10px">
                                      
                                      <Text color="white" borderRadius="2px" as="h3" w="auto" bg="rgb(0,0,0,0.3)" flex="0 1 auto" alignSelf="flex-end" mr={1}>{video?.videoId?.duration}</Text>
                                                
                                      </Box>
                                  
                                  <Text pt={2} noOfLines={2}>{video?.videoId?.title}</Text>
                                  </Link>
                                  <Box d="flex" pt={2}>
                                                   
                                  <Link to={`/profile/${video?.creator?.userId}`}>
                                    <Avatar src={video?.videoId?.creator?.ProfileAvatar} h="2rem" w="2rem"/></Link>
                                      <Box pl={3}>
                                          <Box d="flex">
                                            <Text as="h3" fontSize="0.9rem" color={colorMode==="light" ? "#101011" : "#FFD600"} fontWeight="600" cursor="pointer"><Link to={`/profile/${video?.videoId?.creator?.userId}`}>{video?.videoId?.creator?.username?.slice(0,20)}</Link></Text>
                                            {video?.videoId?.creator?.isVerified && <Box pl={2} pt={1}><AiFillCheckCircle fill={colorMode==="light" ? "#5B61FB" : "#FFD600"} /></Box>}
                                            
                                          </Box>
                          
                                        <Text as="h2" color="#595B5D" fontSize="0.8rem">{(video?.videoId?.creator?.followers.length)} Followers</Text>

                                      </Box>
                                      
                                      
                                      <Tooltip label="Delete" ><Box pl={5} color="#FB5B78" onClick={() => handleDelete(video._id)}><AiOutlineStar onClick={() => handleDelete(video._id)} fill={colorMode === "light" ? "#D2BB31" : '#fb5b78'} cursor="pointer" size="1.7rem" /></Box></Tooltip>
                                          
                                      
                                                            
                                </Box>
                                                
                        </Box>
                        
                        </Box>
                        ))}
                        
                      </Box>}

                      {isLoading && <Box d="grid" gridTemplateColumns="4fr 4fr 4fr 4fr" gap={7} >
                        {skeletons.map(() => (
                                    <Box   height="10.3rem" >
                                    {
                                    /* Main Player box */
                                    
                                    }
                                    <Box cursor="pointer"  height="10.3rem" >
                                    <Skeleton borderRadius="10px" height="100%" w="100%" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'} />

                                              <Box mt={3}>
                                                        <SkeletonText w="15rem" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'} noOfLines={1} spacing='3' />
                                                        <Box d="flex" pt={3}>
                                                              <Box mt={1} label="Studio" cursor="pointer"  width="2.3rem" height="2.3rem" borderRadius="50%">
                                                                <SkeletonCircle startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'} size='10' />
                    
                                                              </Box>
                          
                                                              <Box pl={5}>
                                                              <SkeletonText w="10rem" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'} noOfLines={2} spacing='3' />
                                                              </Box>
                                                              </Box>
                                                                    
                          
                                                               
                                                              </Box>
                                               </Box>
                                    </Box>
                        ))}
                            
                     </Box>
                        }

                        {!isLoading && userVideoLiked.length < 1 && 
                        <Box w="100%">
                            <Text fontSize="1.2rem" pb={5} d="flex">
                              No liked videos yet! Alright here are some videos you may like <Box pl={4} pt={0.5}><FaSmileWink size="1.6rem" fill='#CFB830' /></Box>
                            </Text>
                            <Box d="grid" gridTemplateColumns="4fr 4fr 4fr 4fr"  rowGap={32} columnGap={5} mr={3}>
                                {recommendedVideos?.map((video) => (
                                  <Box>
                                  <Link to={`/video/${video?.videoId}`}>
                                    <Box  borderRadius="10px" height="10.3rem" cursor="pointer">
                                    {
                                    /* Main Player box */
                                    
                                    }
                                     <Box cursor="pointer"  d="flex" height="10.3rem" bgPosition="center" bgSize="cover" justifyContent="right" bgImage={`url(${video.thumbnail})`} borderRadius="10px">
                                      
                                      <Text borderRadius="2px" as="h3" w="auto" bg="rgb(0,0,0,0.3)" flex="0 1 auto" alignSelf="flex-end" mr={1}>{video.duration}</Text>
                                                
                                      </Box>

                                        
                                              <Box d="flex" mt={3} >
                                                              <Box mt={1} label="Studio" cursor="pointer"  width="2.3rem" height="2.3rem" borderRadius="50%">
                                                                  <Avatar src={video.creator.ProfileAvatar} alt={video.creator.username} width="2.3rem" height="2.3rem" borderRadius="50%" />

                                                              </Box>

                                                              <Box pl={5}>
                                                                  <Box d="flex">
                                                                    <Text as="h3" fontSize="0.9rem" color="#FFD600" fontWeight="600" cursor="pointer">{video?.creator?.username?.slice(0,20)}</Text>
                                                                    {video.creator.isVerified && <Box pl={2} pt={1}><AiFillCheckCircle fill="#FFD600" /></Box>}
                                                                    
                                                                  </Box>
                                                                <Text noOfLines={2} lineHeight="1.25rem" as="h2" pt={1} color="rgb(255,255,255,0.85)"  fontSize="1rem">{video.title}</Text>
                                                                <Text as="h2" pt={0.5} color="#595B5D" fontSize="0.8rem">{numFormatter(video.views)} Views</Text>

                                                              
                                                              </Box>
                                              </Box>
                                    </Box>
                                    </Link>
                                    </Box>
                                  ))}
                                
                                  

                                            

                                </Box>
                          
                          </Box>}
                    </Box>
                    

              </Box>
            </Center>
      </Box>


    </>
  )
}

export default Favorites