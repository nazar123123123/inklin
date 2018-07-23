import React from 'react';
import ReactDOM from 'react-dom';
// import { ForceGraph3D } from 'react-force-graph'
// import { ForceGraph2D } from 'react-force-graph'
// import {ForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
import Graph from 'react-graph-vis';
import MenuAppBar from './MenuAppBar'
import SearchField from './SearchField'
import VolumeChart from './VolumeChart';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SearchDialog from './SearchDialog';
import Info from './Info'
import MiniDrawer from './MiniDrawer'
import ProgressIndicator from './ProgressIndicator'
import ReactGA from 'react-ga';
import History from './History'

import './index.css';


// Setup GA
ReactGA.initialize('UA-64729178-1');
ReactGA.pageview(window.location.pathname + window.location.search);


const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

//const  {ForceGraph2D, ForceGraph3D}  = ForceGraph

class Inklin extends React.Component {
  
  static NODE_R = 8;

  constructor(props) {
    
    super(props);
    this.handleLuis = this.handleLuis.bind(this);
    this.handleSpeak = this.handleSpeak.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCloseSearch = this.handleCloseSearch.bind(this);

    this.addData = this.addData.bind(this);
    this.handleContractChooserClose = this.handleContractChooserClose.bind(this);
    this.handleDrawer = this.handleDrawer.bind(this)

    this.state = {
      network: {},
      block_info: {},
      isLive: true,
      numberoftxs: 0,
      streamTimer: 0,
      displayProgress: false,
      address: "0x274F3c32C90517975e29Dfc209a23f315c1e5Fc7",
      previousaddress: "0x274F3c32C90517975e29Dfc209a23f315c1e5Fc7",
      highlightNodes: [],
      highlightLink: null,
      cameraOrbit: 0,
      FG2DIsHidden: false,
      FG3DIsHidden: true,
      volumeIsHidden: false,
      showSearch: false,
      placeholder: 'Search...',
      searchResults: [{ name: "One" }, { name: "two" }, { name: "three" }],
      showContractChooser: false,
      contract: "",
      shouldRedraw: false,
      showSnackbar: true,
      messageSnackbar: "Loading...",
      current_block: 0,
      block_time: new Date(),
      volume_options: {
        animation: false
      },
      volume_data: {
        labels: [],
        datasets: [
          {
            label: 'tx/block',
            backgroundColor: '#40c4ff',
            borderWidth: 1,
            data: []
          }
        ]
      },
      data: {
        nodes: [],
        edges: []
      }
    };

  }

  showContract = (searchTerm, timing) => {

    if (searchTerm !== "") {
      const url = 'http://api.inkl.in/api/inklin/search/' + searchTerm

      console.log(url);

      fetch(url).then(res => res.json()).then(data => {
        if (data.length === 1) {
          this.setState({ contract: data[0]["address"], current_block: 0 })

          console.log(this.state.contract);
          clearInterval(this.state.timer);

          this.setState({
            data: {
              nodes: [{ id: 0 }],
              links: []
            }
          })

          this.componentDidMount()
        } else if (data.length > 1) {
          console.log("Found ", data.length, " opening chooser")
          this.setState({ searchResults: data })
          this.setState({ showContractChooser: true })
        } else if (data.length === 0) {
          console.log("No results");
        }
      });

    }
  }

  showAddress = searchTerm => {

    if (searchTerm !== "") {
      this.setState({ address: searchTerm })
      this.getAll(this.state.address)
    } else {
      console.log("Nothing to find...")
    }
  }

  handleSpeak() {
    console.log("Speak")
    this.setState({ placeholder: "Start Speaking..." })
  }

  handleCloseSearch() {
    console.log("Close Search")
    this.setState({ showSearch: false })
  }

  handleSearch() {
    console.log("Search")
    this.setState({ showSearch: true })
  }

  handleLuis = (data, lookup) => {

    if (lookup === "Address") {
      if (data !== "") {
        ReactGA.event({
          category: 'Search',
          action: 'Address',
          value: data
        });

        this.setState({ address: data })
        this.getAll(data)
      } else {
        console.log("Nothing to find...")
      }

    }

    if (lookup === "Block") {
      ReactGA.event({
        category: 'Search',
        action: 'Block',
        value: data
      });

      console.log(data)
      this.getBlock(data)
    }

    if (lookup === "Natural") {


      if (data["topScoringIntent"]["intent"] === "Show Contract") {
        var token = ""
        var timing = ""

        for (var i in data["entities"]) {
          if (data["entities"][i]["type"] === "token") {
            token = data["entities"][i]["entity"].toUpperCase()
          }


          if (data["entities"][i]["type"] === "builtin.datetimeV2.date") {
            timing = data["entities"][i]["resolution"]["values"][0]["value"]
          }

          if (data["entities"][i]["type"] === "builtin.datetimeV2.datetimerange" || data["entities"][i]["type"] === "builtin.datetimeV2.daterange") {
            timing = data["entities"][i]["resolution"]["values"][0]["start"]
          }

          ReactGA.event({
            category: 'Search',
            action: 'Luis',
            value: `${token} within ${timing}`
          });
          this.showContract(token, timing)

        }
      } else {
        this.setState({ messageSnackbar: "Sorry I don't understand" });
        ReactGA.event({
          category: 'Search',
          action: 'Luis',
          value: "Don't Understand"
        });
      }
    }
  }

  addData(data) {
    var vd = this.state.volume_data

    vd.labels.push("")
    vd.datasets[0].data.push(data)
    // {
    //   labels: this.state.volume_data.labels,
    //   datasets: [
    //     {
    //       label: 'tx/block',
    //       backgroundColor: '#40c4ff',
    //       borderWidth: 1,
    //       data: this.state.volume_data.datasets[0].data
    //     }
    //   ]
    // }


    // vd.datasets[0].data.push(data)
    // vd.labels.push("")

    //  if (vd.labels.length > 100) {
    //   vd.datasets[0].data.shift();
    //   vd.labels.shift();
    //  }

    this.setState({ volume_data: vd, shouldRedraw: true })

  }

  handleContractChooserClose = val => {
    this.setState({ contract: val.address, current_block: 0 })


    clearInterval(this.state.timer);

    this.setState({
      data: {
        nodes: [],
        links: []
      }
    })


    this.componentDidMount()
    this.setState({ showContractChooser: false })



  }

  getAll(address) {

    clearInterval(this.state.streamTimer)

    this.setState({
      data: {
        nodes: [],
        edges: []
      }, displayProgress: true, isLive: false, volumeIsHidden: false
    })

    const data_url = `${process.env.REACT_APP_API_SERVER}/api/inklin/txaddress/${address}`

    const nodes = []
    const links = []

    console.log(data_url)
    fetch(data_url).then(res => res.json()).then(data => {
      this.setState({ data: data.docs, displayProgress: false, numberoftxs: data.length })

    });

    const histogram_url = `${process.env.REACT_APP_API_SERVER}/api/inklin/histogram/${address}`

    console.log(histogram_url)
    fetch(histogram_url).then(res => res.json()).then(data => {

      const dates = []
      const counts = []


      for (var i in data) {
        dates.push(`${data[i]._id.year}-${data[i]._id.month}-${data[i]._id.day}`)
        counts.push(data[i].count)
      }

      const vd = {
        labels: dates,
        datasets: [
          {
            label: 'tx/day',
            backgroundColor: '#40c4ff',
            borderWidth: 1,
            data: counts
          }
        ]
      }

      this.setState({ volume_data: vd })
    });

  }


  getBlock(block) {

    console.log("In getBlock")
    clearInterval(this.state.streamTimer)

    this.setState({
      data: {
        nodes: [],
        edges: []
      }, displayProgress: true, isLive: false, volumeIsHidden: true
    })

    const data_url = `${process.env.REACT_APP_API_SERVER}/api/inklin/transactions/${block}`
    console.log(data_url)
    const nodes = []
    const links = []

    fetch(data_url).then(res => res.json()).then(data => {
      this.setState({ data: data, displayProgress: false, current_block: data.block_number, numberoftxs: data.edges.length })
    });

  }

  stream() {
    const url = process.env.REACT_APP_API_SERVER + "/api/inklin/live/" + this.state.current_block
    console.log(url)
    clearInterval(this.state.streamTimer)

    fetch(url).then(res => res.json()).then(data => {
      if (parseInt(data.block_number) !== parseInt(this.state.current_block)) {

        this.setState({ shouldRedraw: true })
        this.setState({ block_info: data.stats, viewedID: data.block_number, block_time: data.block_time, current_block: data.block_number, numberoftxs: `${data.edges.length}/block` })
        this.addData(data.edges.length)

        this.setState({ shouldRedraw: false })

        console.log(`Got ${data.edges.length} results`);
        this.setState({ data: data })
      } else {
        console.log("Still Waiting");
      }

//         const streamTimer = setInterval(() => {
//           this.stream()
// //  //        this.state.network.fit({animation:true})
//         }, 5000);

   //   this.setState({ streamTimer: streamTimer })
    });

  }



  hideVolume = () => {
    this.setState({ volumeIsHidden: !this.state.volumeIsHidden })
  }

  handleLive = () => {
    console.log("Handling Live");
    this.state.isLive ? clearInterval(this.state.streamTimer) : this.stream()
    this.setState({ isLive: !this.state.isLive })
  }

 

  componentDidMount() {



    const myURL = new URL(window.location.href);
    console.log(myURL);

    const searchTerm = myURL.pathname.slice(1);
    if (searchTerm.length === 42) {
      this.setState({ address: searchTerm })
      this.getAll(searchTerm)
    } else {
      if (myURL.hash === "#share") {
        this.setState({ volumeIsHidden: true, menuIsHidden: true, infoIsHidden: true })
      }

      this.stream()
    }

  }

 


  closeSnackbar = () => {
    console.log("Close trigger...")
    this.setState({ showSnackbar: false })
  }

  render() {
    //    const { data } = this.state;
    const { data, highlightLink } = this.state;
    
    
    var events = {
      select: function(event) {
          var { nodes, edges } = event;
          console.log(nodes);
          console.log(edges);
      }
  }

    const options = {
      nodes: {
          shape: 'dot',
          size: 16
      },
      physics: {
        enabled: true,
          forceAtlas2Based: {
              gravitationalConstant: -106,
              centralGravity: 0.005,
              springLength: 230,
              springConstant: 0.18
          },
          maxVelocity: 16,
          solver: 'forceAtlas2Based',
          timestep: 0.35,
          stabilization: {iterations: 10}
      }
  };    
    return (


 
        <MuiThemeProvider theme={theme}>
          {/* {!this.state.menuIsHidden && <MenuAppBar onLuis={this.handleLuis} onSpeak={this.handleSpeak} placeholder={this.state.placeholder} />} */}
          {!this.state.menuIsHidden && <MiniDrawer handleLive={this.handleLive} handleVolume={this.hideVolume} switchTo3d={this.switchTo3d} perspective2d={!this.state.FG3DIsHidden} showVolume={!this.state.volumeIsHidden} isLive={this.state.isLive} currentBlock={this.state.current_block} />}

         {this.state.data.edges.length > 0 && <Graph getNetwork={network => this.setState({network}) } graph={this.state.data} events={events} options={options}  />}

          {this.state.displayProgress && <ProgressIndicator />}

          <SearchDialog open={this.state.showSearch} closeDrawer={this.handleCloseSearch} />
          {/* <div className="leftpanel">

          </div> */}
          <div className="rightpanel">
          {!this.state.volumeIsHidden &&<VolumeChart data={this.state.volume_data} options={this.state.volume_options} shouldRedraw={this.state.shouldRedraw} />}
            <SearchField handleFocus={this.props.handleFocus} handleLuis={this.handleLuis} />
            <Info block_time={this.state.block_time} block_info={this.state.block_info} address={this.state.address} numberoftxs={this.state.numberoftxs} blocknumber={this.state.current_block} />
           {this.state.current_block > 0 && <History current_block={this.state.current_block}/>}
          </div>
          {!this.state.menuIsHidden && <div className="buildInfo">
            Build: {process.env.REACT_APP_SHA}
          </div>}
        </MuiThemeProvider>

    );
  }
}


ReactDOM.render(
  <Inklin />,
  document.getElementById('root')
);
