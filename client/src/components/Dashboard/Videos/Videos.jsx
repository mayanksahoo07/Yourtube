import React from 'react'
import {Box, Text,Skeleton, Avatar, SkeletonCircle, SkeletonText, Center,useColorMode} from "@chakra-ui/react"
import {AiFillCheckCircle} from "react-icons/ai"
import {getVideos} from '../../../services/videoService'
import { Link , useParams} from 'react-router-dom'

function Videos() {

  document.title = "Dicover Videos"

  const [videos,setVideos] = React.useState([])
  const {title} = useParams()
  const [showSkeleton,setShowSkeleton] = React.useState(true)
  const [found,setFound] = React.useState(false)
  const [skip, setSkip] = React.useState(0)
  const [loader, setLoader] = React.useState(false)
  const limit = 20
  const {colorMode} = useColorMode()
  
  const skeletons = [0,1,2,3,4,5,6,7,8,9,10,11]

  const getAllVideos = async() =>{
    setShowSkeleton(true)
    try {
      const data = await getVideos(skip,limit)
      const values = []
      
        if(data?.data && !title){
          var sorted = data.data.sort((a, b) => a.views - b.views);
          setVideos(sorted)
          setShowSkeleton(false)
          setFound(true)

        }else {
          const datas = await getVideos(0,200)
          setFound(false)
          await datas?.data?.map((datass) => {
            
            if(datass.title.toLowerCase().includes(title.toLowerCase()) || datass.tags.includes(title.toLowerCase()) || datass.category.toLowerCase().includes(title.toLowerCase())) {
              values.push(datass)
              setFound(true)
            }
          
          })
          setVideos(values)
          setShowSkeleton(false)
        }
    }catch{}
      
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


function getInnerHeight( elm ){
  var computed = getComputedStyle(elm),
      padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

  return elm.clientHeight - padding
}
const handleScroll = () => {
  var b = document.getElementById('videos')
    var height =  b.scrollHeight
    var top = b.scrollTop
    var innerHeight = getInnerHeight(b)

    if(innerHeight + top + 33 >= height) {
      setSkip((prev) => prev + 1)
      setLoader(true)
      }
  }

  const getNext = async () => {
    const data = await getVideos(skip,limit)
      if(data?.data && !title && skip > 0) {
        setVideos(videos => [...videos, ...data?.data])
        setLoader(false)
      }
  }

React.useEffect(() => {
  getNext()
},[skip])


  React.useEffect(() => {
    getAllVideos()
    
  },[title])


React.useEffect(() => {
  document.getElementById("videos").addEventListener("scroll" ,handleScroll)
},[])



  return (
    <>
    <Box h="88%" maxHeight="88%" overflowY="auto" pt={8} id="videos"> 
    {!title && <Box d="grid" gridTemplateColumns="4fr 4fr 4fr 4fr" rowGap={32} columnGap={5} mr={3}>
      {!showSkeleton && <> {videos?.map((video) => (
          
            <Box  borderRadius="5px" height="10.3rem" cursor="pointer" className={colorMode === "light" ? "stream-light" : 'stream'}>
          {
          /* Main Player box */
          
          }
                <Link to={`/video/${video?.videoId}`}>
                              <Box className={colorMode === "light" ? "stream-light__thumbnail" : "stream__thumbnail"} cursor="pointer" d="flex" height="10.3rem" bgPosition="center" bgSize="cover" justifyContent="right" bgImage={`url(${video.thumbnail})`} borderRadius="5px">
                                      
                                      <Text borderRadius="2px" as="h3" w="auto" color="white" bg="rgb(0,0,0,0.3)" flex="0 1 auto" alignSelf="flex-end" mr={1}>{video.duration}</Text>
                                                
                                </Box>

                </Link>
                    <Box d="flex" mt={3}>
                                    <Box mt={1} label="Studio" cursor="pointer"  width="2.3rem" height="2.3rem" borderRadius="50%">
                                      <Link to={`/profile/${video?.creator?.userId}`}>
                                          <Avatar src={video.creator.ProfileAvatar} alt={video?.creator?.username.slice(0,20)} width="2.3rem" height="2.3rem" borderRadius="50%" />
                                      </Link>
                                    </Box>

                                    <Box pl={5}>
                                        <Box d="flex">
                                        <Link to={`/profile/${video?.creator?.userId}`}><Text as="h3" fontSize="0.9rem" color={colorMode==="light" ? "#101011" : "#FFD600"} fontWeight="600" cursor="pointer">{video?.creator?.username.slice(0,20)}</Text></Link>
                                          {video.creator.isVerified && <Box pl={2} pt={1}><AiFillCheckCircle fill={colorMode==="light" ? "#5B61FB" : "#FFD600"} /></Box>}
                                          
                                        </Box>
                                        <Link to={`/video/${video?.videoId}`}><Text noOfLines={2} lineHeight="1.25rem" fontWeight="500" as="h2" pt={1} color={colorMode==="light" ? "rgb(5,0,0,0.85)" : "rgb(255,255,255,0.85)"}  fontSize="1rem">{video.title}</Text></Link>
                                      <Text as="h2" color={colorMode === "light" ? "#595B5D":"#595B5D"} fontSize="0.8rem">{numFormatter(video.views)} Views</Text>

                                     
                                    </Box>
                     </Box>
            </Box>
          
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
                                    <Skeleton borderRadius="5px" height="100%" w="100%" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  />
                                        
                                    </Box>
                          
                                        
                                              <Box d="flex" mt={3}>
                                                              <Box mt={1} label="Studio" cursor="pointer"  width="2.3rem" height="2.3rem" borderRadius="50%">
                                                                <SkeletonCircle startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  size='10' />
                          
                                                              </Box>
                          
                                                              <Box pl={5}>
                                                              <Box >
                                                              <SkeletonText w="10rem" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  noOfLines={3} spacing='3' />
                                                              </Box>
                                                                    
                          
                                                               
                                                              </Box>
                                               </Box>
                                    </Box>
                        ))}
                            
                     </>
                     }

                     {loader && <>
                      {[0,1,2,3,4,5,6,7].map(() => (
                                  <Box   height="10.3rem" >
                                  {
                                  /* Main Player box */
                                  
                                  }
                                  <Box cursor="pointer"  height="10.3rem" >
                                  <Skeleton borderRadius="5px" height="100%" w="100%" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  />
                                      
                                  </Box>
                        
                                      
                                            <Box d="flex" mt={3}>
                                                            <Box mt={1} label="Studio" cursor="pointer"  width="2.3rem" height="2.3rem" borderRadius="50%">
                                                              <SkeletonCircle startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  size='10' />
                        
                                                            </Box>
                        
                                                            <Box pl={5}>
                                                            <Box >
                                                            <SkeletonText w="10rem" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  noOfLines={3} spacing='3' />
                                                            </Box>
                                                                  
                        
                                                             
                                                            </Box>
                                             </Box>
                                  </Box>
                      ))}
                          
                   </>}
                        

      </Box>}
      
      {title && 
      <Box d="grid" gridTemplateColumns="4fr 4fr 4fr 4fr" rowGap={32} columnGap={5} mr={3}>
      {found && <>{!showSkeleton && <> {videos?.map((video) => (
          <Link to={`/video/${video?.videoId}`}>
            <Box  borderRadius="10px" height="10.3rem" cursor="pointer">
          {
          /* Main Player box */
          
          }
                         <Link to={`/video/${video?.videoId}`}>
                              <Box cursor="pointer" d="flex" height="10.3rem" bgPosition="center" bgSize="cover" justifyContent="right" bgImage={`url(${video.thumbnail})`} borderRadius="10px">
                                      
                                      <Text borderRadius="2px" as="h3" w="auto" color="white" bg="rgb(0,0,0,0.3)" flex="0 1 auto" alignSelf="flex-end" mr={1}>{video.duration}</Text>
                                                
                                </Box>
                          </Link>
              
                    <Box d="flex" mt={3}>
                                    <Box mt={1} label="Studio" cursor="pointer"  width="2.3rem" height="2.3rem" borderRadius="50%">
                                      <Link to={`/profile/${video?.creator?.userId}`}>
                                          <Avatar src={video.creator.ProfileAvatar} alt={video?.creator?.username.slice(0,20)} width="2.3rem" height="2.3rem" borderRadius="50%" />
                                      </Link>
                                    </Box>

                                    <Box pl={5}>
                                        <Box d="flex">
                                        <Link to={`/profile/${video?.creator?.userId}`}><Text as="h3" fontSize="0.9rem" color={colorMode==="light" ? "#101011" : "#FFD600"} fontWeight="600" cursor="pointer">{video?.creator?.username.slice(0,20)}</Text></Link>
                                          {video.creator.isVerified && <Box pl={2} pt={1}><AiFillCheckCircle fill={colorMode==="light" ? "#5B61FB" : "#FFD600"} /></Box>}
                                          
                                        </Box>
                                        <Link to={`/video/${video?.videoId}`}><Text noOfLines={2} lineHeight="1.25rem" as="h2" pt={1} color={colorMode==="light" ? "rgb(5,0,0,0.85)" : "rgb(255,255,255,0.85)"}  fontSize="1rem">{video.title}</Text></Link>
                                      <Text as="h2" color={colorMode === "light" ? "#595B5D":"#595B5D"} fontSize="0.8rem">{numFormatter(video.views)} {video.views > 1 ? "View" : "Views"}</Text>

                                     
                                    </Box>
                     </Box>
            </Box>
          </Link>
        ))}
        </>
        }
      </>}
      

                    {showSkeleton && <>
                        {skeletons.map(() => (
                                    <Box   height="10.3rem" >
                                    {
                                    /* Main Player box */
                                    
                                    }
                                    <Box cursor="pointer"  height="10.3rem" >
                                    <Skeleton borderRadius="10px" height="100%" w="100%" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  />
                                        
                                    </Box>
                          
                                        
                                              <Box d="flex" mt={3}>
                                                              <Box mt={1} label="Studio" cursor="pointer"  width="2.3rem" height="2.3rem" borderRadius="50%">
                                                                <SkeletonCircle startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  size='10' />
                          
                                                              </Box>
                          
                                                              <Box pl={5}>
                                                              <Box >
                                                              <SkeletonText w="10rem" startColor={colorMode === "light" ? "#5B61FB" : '#FB5B78'}  noOfLines={3} spacing='3' />
                                                              </Box>
                                                                    
                          
                                                               
                                                              </Box>
                                               </Box>
                                    </Box>
                        ))}
                            
                     </>
                        }

      </Box>
      
      
      }
      {(!found && !showSkeleton) && 
      <Center w="100%" pt={5}><Text as="h1" color={colorMode === "light" ? "black" : "white"} fontSize="1.25rem">No results found</Text></Center>
      }
      
                      
              
          </Box>
    
    </>
  )
}

export default Videos