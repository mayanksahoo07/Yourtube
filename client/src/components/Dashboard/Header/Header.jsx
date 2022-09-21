import React from 'react'
import {Box, Text, Avatar,Center, Input, Button, Stack, InputGroup, AvatarBadge,
        InputLeftElement, InputRightElement,Menu,MenuList,MenuItem,MenuButton,useColorMode} from '@chakra-ui/react'
import {FiSearch, FiSettings} from 'react-icons/fi';
import {AiOutlineDown,AiOutlineVideoCameraAdd,AiOutlineLogout} from "react-icons/ai"
import {IoIosNotificationsOutline} from "react-icons/io"
import {FaRegUser} from "react-icons/fa"
import {Link,useNavigate } from 'react-router-dom'
import {getUser, addUser, editUser} from "../../../services/usersService";
import {getUserNotifications,deleteUserNotifications,updateUserNotifications} from '../../../services/notificationsService'
import {RiUserFollowLine} from 'react-icons/ri'
import {AiOutlineMessage} from 'react-icons/ai'
import {MdOutlineAttachMoney} from 'react-icons/md'
import { SiMediamarkt } from 'react-icons/si';
import {useMoralis} from 'react-moralis'


function Header() {

  const {Moralis,logout} = useMoralis()
  const user = Moralis.User.current().get("ethAddress").toLowerCase()
  const navigate = useNavigate()
  const [username,setUsername] = React.useState(user)
  const [avatar, setAvatar] = React.useState("https://bafybeifgsujzqhmwznuytnynypwg2iaotji3d3whty5ymjbi6gghwcmgk4.ipfs.dweb.link/profile-avatar.png")
  const [balance,setBalance] = React.useState(0)
  const [notifications,setNotifications] = React.useState([])
  const [notifClickBell, setNotifClickBell] = React.useState(false)
  const [search, setSearch] = React.useState("")
  
  const { colorMode } = useColorMode()

  const hadleLogout = () => {

    localStorage.removeItem('user');
    editUser(user,{isOnline : false})
    logout()
    window.location.reload()
  }


    const Search = () => {
        return(
          <Box >
            <Button onClick={searchResult} _hover={{bg : 'rgb(89, 91, 93,0.36)'}} height="2.5rem" width="5rem" bg={colorMode === "light" ? "#5A5A5B" :"rgb(89, 91, 93,0.36)"} color="rgb(255,255,255,0.63)" borderRadius="50px" fontSize="0.9rem">Search</Button>
          </Box>
        )
      }
    
      const AiCamera = () => {
        return(
          <Box borderRadius="50%" bg={colorMode === "light" ? "#5A5A5B" :"rgb(145, 92, 228, 0.83)"} height="2rem" width="2rem" mt={1}>
              <Center height="100%">
                <AiOutlineVideoCameraAdd  size="1.3rem"  />
              </Center>
          </Box>
        )
      }
    
const handleUser = async() => {
  const result = await getUser(user);
    if(result.data.status == 'not found') {
      
      try {
       const data =  await addUser({userId : user, username : user , isOnline : true})
        setUsername(username)
        setAvatar(avatar)
        setBalance(0)
      
      }catch (error) {
        console.log(error);
      }
    }
   else {
     setUsername(result.data.username)
     setAvatar(result.data.ProfileAvatar)
     setBalance(result.data.rewards)

   }

    ;
}

const handelNotifBell = async() => {
  try {
    const data = await updateUserNotifications(user)
    setNotifClickBell(true)
  }catch {

  }
    
}

const handleNotifications = async() => {
  try {
    const data = await getUserNotifications(user)
    if(data.data) {
      var uniqueNotifications = data.data.reduce((filter, current) => {
        var dk = filter.find(item => item.from === current.from || (item.from === current.from&& item.type === current.type));
        if (!dk) {
          return filter.concat([current]);
        } else {
          return filter;
        }
      }, []);
      setNotifications(uniqueNotifications)
    }
  }catch(e) {
      console.log(e)
  }
}

const handleClearNotifications = async() => {
    setNotifications([])
    const data = await deleteUserNotifications(user)

}

const handleSearch = (e) => {
  e.preventDefault()
  setSearch(e.target.value)
}


React.useEffect(() => {
  handleNotifications()
},[])


React.useEffect(() => {
    handleUser();
},[])

const keyDownHandler = event => {
        
  
  if (event.key === 'Enter') {
    event.preventDefault();

    searchResult();
  }
};


const searchResult = () => {
if(search.length > 2) {
  navigate(`/videos/${search}`);
}
}

  return (
    <>
    <Box width="100%" height="12%" d="flex" position="sticky" zIndex={100}>
                  <Stack width="35%" alignContent="center" textAlign="center" justifyContent="center" ml={8} >
                      <InputGroup >
                        <InputLeftElement pt={2} pl={4} children={<FiSearch color={colorMode === "light" ? "white":"#595B5D"} size="1.5rem" />}  />
                        <Input _placeholder={colorMode === "light" ? {color : 'white'} : {}} onKeyDown={keyDownHandler} onChange={handleSearch} value={search} _focus={{outline: "1px solid #595B5D "}} border="none" bg={colorMode === "light" ? "#2D2D2E" :"#242627"} pb={1} color={colorMode === "light" ? "white" :"rgb(255,255,255,0.63)"} type="text" pl={12} placeholder="Search"  borderRadius="50px" h="3.125rem"  />
                        <InputRightElement pt={2.5} pr={12} children={<Search/>} />
                      </InputGroup>
                </Stack>
                

                
                <Stack alignContent="center" textAlign="center" justifyContent="center" ml={24}>
                <Link to="/stream">
                    {colorMode === 'dark' && 
                      <Button pb={1} _hover={{
                      bg: "rgb(38, 29, 55,0.89)"
                    }} _active={{
                      bg: "rgb(38, 29, 55,0.89)"
                    }} bg="#261D37" h="3.125rem" leftIcon={<AiCamera />} color="rgb(255,255,255,0.85)" borderRadius="50px">
                    
                          Start Stream
                      </Button>}

                      {colorMode === 'light' && 
                        <Button pb={1} _hover={{
                        bg: "black"
                      }} _active={{
                        bg: "black"
                      }} bg="#111315" h="3.125rem" leftIcon={<AiCamera />} color="white" borderRadius="50px">
                      
                            Start Stream
                        </Button>}
                  </Link>
                </Stack>
                
                <Stack alignContent="center" textAlign="center" justifyContent="center" ml={28} >
                  <Link to="/settings">
                    <FiSettings size="1.4rem" color={colorMode==="light" ? "black" : '#595B5D'} cursor="pointer" />
                  </Link>
                  
                </Stack>
                <Stack alignContent="center" textAlign="center" justifyContent="center" ml={8} overflowY="auto" maxHeight="25vh">
                    <Menu isLazy>
                      <MenuButton d="flex" onClick={() => {handelNotifBell()}}>
                        <Avatar bg="transparent"  icon={<IoIosNotificationsOutline size='1.8rem' cursor="pointer" color={colorMode==="light" ? "black" : '#595B5D'} />}>
                          {(notifications.length > 0 && notifClickBell===false && notifications[0].isRead === false)  ?<AvatarBadge mb={5}  mr={1.5} textAlign="center" fontWeight="bold" borderColor="transparent" color="white" w="1rem" h="1rem" bg="red" fontSize="0.65rem">{notifications.length > 9 ? `${notifications.length}+` : `${notifications.length}`}</AvatarBadge> : <></>}
                        </Avatar></MenuButton>
                      <MenuList bg="#37393A">
                        {/* MenuItems are not rendered unless Menu is open */}
                        {notifications.length > 0 ? <>
                          {notifications.map(({username , type,from}) => (
                            <>
                             {type == 'message' && <Link to="/messages"><MenuItem borderBottom="1px solid rgb(255,255,255,0.1)" color="white"><Box pr={2}><AiOutlineMessage /></Box>You received a new message from {username?.slice(0,12)}</MenuItem></Link>}
                             {type == 'nft creation' && <Link to={`/profile/${from}`}><MenuItem borderBottom="1px solid rgb(255,255,255,0.1)" color="white"><Box pr={2}><SiMediamarkt /></Box>{username?.slice(0,12)} created a new NFT Collection</MenuItem></Link>}
                             {type == 'follow' && <Link to={`/profile/${from}`}><MenuItem borderBottom="1px solid rgb(255,255,255,0.1)" color="white"><Box pr={2}><RiUserFollowLine /></Box>{username?.slice(0,12)} started following you</MenuItem></Link>}
                             {type == 'donate' && <Link to={`/profile/${from}`}><MenuItem borderBottom="1px solid rgb(255,255,255,0.1)" color="white"><Box pr={2}><MdOutlineAttachMoney /></Box>You received a new donation from {username?.slice(0,12)}</MenuItem></Link>}
                             {type == 'nft purchase' && <Link to={`/profile/${from}`}><MenuItem borderBottom="1px solid rgb(255,255,255,0.1)" color="white"><Box pr={2}><SiMediamarkt /></Box>{username?.slice(0,12)} purchased your NFT</MenuItem></Link>}
                            </>
                            
                          ))}
                          <MenuItem fontSize="1.1rem" color="#E4A101" onClick={handleClearNotifications}><Center w="100%">Clear notifications</Center></MenuItem>

                        </> 
                        : <MenuItem isDisabled={true} color={colorMode === "light" ? "white" : ""} borderBottom="1px solid rgb(255,255,255,0.1)">You don't have any new notifications</MenuItem>}
                        
                        
          
                      </MenuList>
                    </Menu>
                
                </Stack>
                
                <Stack>
                    <Box pt={4} pl={6} d="flex">
                      <Menu isLazy >
                        <MenuButton >
                          <Center>
                      
                                  <Box ml={20} label="Studio" cursor="pointer" width="3rem" height="3rem" borderRadius="50%">
                                        {/* <Image src={img5} alt="John" width="3rem" height="3rem" borderRadius="50%" /> */}
                                        
                      
                            <Avatar name={`${username}`} src={avatar} />
                        
                      
                    
                                        
                                          
                                    
                                    </Box>

                                    <Box pl={5}>
                                      
                                      <Text as="h3" color={colorMode === "light" ?  "#050505": "rgb(255,255,255,0.90)"} fontWeight="600" cursor="pointer">{username?.slice(0,7)}</Text>
                                      <Text as="h2" fontWeight={colorMode=== "light" ? "bold" :""} color={colorMode === "light" ? "#D2BB31" : "#E4A101"} fontSize="0.8rem">Online</Text>
                                    </Box>
                                    <Center  pl={12} pb={2} cursor="pointer">
                                      <AiOutlineDown size="1.2rem" />
                                    </Center>

                    </Center>
                    </MenuButton>
                            {colorMode === "dark" &&
                              <MenuList ml={20} bg="#242627">
                              {/* MenuItems are not rendered unless Menu is open */}
                              <MenuItem  borderBottom="1px solid rgb(255,255,255,0.1)" fontSize="1.1rem">
                                
                                  <Center w="100%"><Box>
                                    <Text pl={2} pb={2} fontWeight="bold" color="#FFD600">{balance} $YTC</Text> 
                                      <Button isDisabled={balance === 0} _hover={{bg : "rgb(62, 166, 255,0.89)"}} _active={{bg : "rgb(62, 166, 255,0.89)"}} bg="#3EA6FF" mb={2} color="#111315">Withdraw</Button></Box>
                                  </Center>
                                      
                                
                              </MenuItem>
                              <Link to="/profile">
                                 <MenuItem  borderBottom="1px solid rgb(255,255,255,0.1)" fontSize="1.1rem">
                                     <Box pr={3} color="rgb(255,255,255,0.5)"><FaRegUser /></Box>Profile
                                  </MenuItem>
                                </Link>
                                <Link to="/settings">
                                  <MenuItem  borderBottom="1px solid rgb(255,255,255,0.1)" fontSize="1.1rem"><Box pr={3} color="rgb(255,255,255,0.5)"><FiSettings /></Box>Settings</MenuItem>
                                </Link>
                              
                              <MenuItem onClick={hadleLogout} borderBottom="1px solid rgb(255,255,255,0.1)" fontSize="1.1rem"><Box pr={3} color="rgb(255,255,255,0.5)"><AiOutlineLogout /></Box>Logout</MenuItem>
                              </MenuList>}


                              {colorMode === "light" &&
                              <MenuList ml={20} bg="#DAD9D9">
                              {/* MenuItems are not rendered unless Menu is open */}
                              <MenuItem _hover={{bg: '#c9c9c9'}} borderBottom="1px solid rgb(0,0,0,0.2)" fontSize="1.1rem">
                                
                                  <Center w="100%">
                                    <Box>
                                    <Text pl={2} pb={2} fontWeight="bold" color="#1C1F20">{balance} $YTC</Text> 
                                      <Button isDisabled={balance === 0} _hover={{bg : "rgb(62, 166, 255,0.89)"}} _active={{bg : "rgb(62, 166, 255,0.89)"}} bg="#3EA6FF" mb={2} color="#111315">Withdraw</Button>
                                      </Box>
                                  </Center>
                                      
                                
                              </MenuItem>
                              <Link to="/profile">
                                 <MenuItem _hover={{bg: '#c9c9c9'}} borderBottom="1px solid rgb(0,0,0,0.2)" fontSize="1.1rem">
                                     <Box pr={3} color="rgb(255,255,255,0.5)"><FaRegUser fill="black"/></Box>Profile
                                  </MenuItem>
                                </Link>
                                <Link to="/settings">
                                  <MenuItem _hover={{bg: '#c9c9c9'}} borderBottom="1px solid rgb(0,0,0,0.2)" fontSize="1.1rem"><Box pr={3} color="rgb(255,255,255,0.5)"><FiSettings color="black" /></Box>Settings</MenuItem>
                                </Link>
                              
                              <MenuItem _hover={{bg: '#c9c9c9'}} onClick={hadleLogout} borderBottom="1px solid rgb(0,0,0,0.2)" fontSize="1.1rem"><Box pr={3} color="rgb(255,255,255,0.5)"><AiOutlineLogout color="black" /></Box>Logout</MenuItem>
                              </MenuList>}
                    </Menu>
                    
                  </Box>
                </Stack>

                  

            </Box>


    </>
  )
}

export default Header