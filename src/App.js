
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import {
  AccountBox,
  Article,
  Group,
  Home,
  ModeNight,
  Person,
  RestaurantRounded,
  Settings,
  Storefront,
} from "@mui/icons-material";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Card,
  TextField
} from "@mui/material";


import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const pages = ['Browse', 'Search', 'Chart', 'About'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


//ghpages: https://www.pluralsight.com/guides/deploying-github-pages-with-create-react-app
//create your forceUpdate hook. see https://stackoverflow.com/questions/46240647/how-to-force-a-functional-react-component-to-render
function useForceUpdate()
{
  const [value, setValue] = React.useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here 
  // is better than direc tly setting `setValue(value + 1)`
} 


var app={}
app.set_filter=function(val)
{
  app.filter=val.toLowerCase()
  app.forceUpdate()
}


app.set_cur_country=function(val)
{
  app.cur_country=val
  var paths=document.querySelectorAll(`g path, g circle`)
  paths.forEach(function(path)
  {
    path.setAttribute('fill', 'rgb(0,0,0,0.2)')
    path.setAttribute('stroke', 'white')

    //svg <circle> used for microstates/islands within country. should not be highlighted by default.  
    //if(path.tagName=='CIRCLE')
    //  path.setAttribute('stroke', 'transparent')
    
  })

  var paths=document.querySelectorAll(`g#${val} path, g#${val} circle`)
  paths.forEach(function(path)
  {
    path.setAttribute('fill', 'red')
    path.setAttribute('stroke', 'red')
  })

  app.forceUpdate()
}


var country_list=[]
function load_data(cb )
{
    fetch('worldmap.svg')
      .then(response => response.text())
      .then(data =>
      {
        document.getElementById('worldmap_svg').innerHTML=data
       // console.log(data)

        fetch('countries.json')
        .then(response => response.json())
        .then(data =>
        {
          country_list=data
         // console.log(country_list)
          cb()
        })
      })
}


  function makeHnChart(rows)
  {
    return <img style={{display:'block'}} src='https://www.amcharts.com/wp-content/uploads/2013/12/demo_7394_none-7-1024x690.png' />
  }


  function RightPanel(rows)
  {
    var cards=[]
    country_list.forEach(entry =>
    {
      if(app.filter)
      {
        if(!entry.name.toLowerCase().startsWith(app.filter))
          return
      }
      cards.push(
      <Card sx={{display:'flex', cursor:'pointer', p:3, mt:2,  border:app.cur_country==entry.cca2?'2px solid blue':undefined  }  }  onClick={function(e){app.set_cur_country(entry.cca2)} } >
        <div  style={{width:50, height:20, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundImage:'url(flags/'+entry.cca3+'.svg)'}}></div>
         {entry.name}
      </Card> )
    });
    
    return (
    <Box sx={{p:4, height:'100%', overflow:'hidden auto', background:'rgb(0,0,0,0.05)', width:300, display:{xs:'none', md:'block'} }}  >
    <Typography variant="h5" sx={{mb:2}}>  Countries </Typography>
    <TextField id="outlined-basic"   placeholder='Filter countries' size='small' variant="outlined" onChange={function(e){app.set_filter(e.target.value)}} />
      {cards}
    </Box>
    )


     return 
  }




function App() {
  
  //see https://blog.bitsrc.io/fetching-data-in-react-using-hooks-c6fdd71cb24a
  app.forceUpdate = useForceUpdate();
  const [state, setState] = React.useState([])
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

    //todo: use datagrid. 
    React.useEffect(function()
    {
      load_data(app.forceUpdate)
    }, [])


  const [curPage, setCurPage] = React.useState('browse');
  const handle_tab_change = (event, newValue) => {
    setCurPage(newValue);
  };
  const makePage=function()
  {
    if(curPage=='browse')
      return makeHnChart(state)
  }

  const handleOpenNavMenu = (event) => {

    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (e) => {
    console.log('event.currentTarget='+e.target.dataset.val)
    setAnchorElNav(null);
  }
 
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
 
    const theme = createTheme(
    {
      palette:
      {
        primary: {main:'#f36523'}
      }
    });


  return (
    <ThemeProvider theme={theme}> 
    <Box fixed sx={{display:'flex', flexDirection:'column', overflow:'hidden', height:'100%'}}>
      <AppBar sx={{bgcolor: "aliceblue", color:'black', padding:'9px 25px'}} position="static">
        <Toolbar disableGutters>
        <img src='logo.svg' style={{marginRight:10, height:25, display:'inline-block'}} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              paddingRight:'90px'
            }}
          >

            World Atlas
          </Typography>

          <Box sx={{ flexGrow: 1,  display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >


            </Menu>
          </Box>
 
          <Box sx={{ width: '100%'}}>
          <Tabs  value={curPage}  onChange={handle_tab_change} >
                <Tab value="browse"label="Browse"/>
                <Tab value="search" label="Search" />
                <Tab value="chart" label="Chart" />
              </Tabs>
              </Box>
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2,  display: 'block' }}
              >
               About
              </Button>
        </Toolbar>
        
        </AppBar>
      <Box sx={{display:'flex', width:'100%', flexGrow:1 , overflow:'hidden', background:'rgb(0,130,255,0.1)'  }}  >
        <Box  sx={{ pt:5, flexGrow: 1, overflow:'auto auto'}}  >
        <svg id='worldmap_svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" viewBox="0 0 1000 507.209" ></svg>

        </Box>
        <RightPanel/>
       
        
      </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
