import React from 'react';
import ReactDOM from 'react-dom';
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
import { Helmet } from "react-helmet";

import './index.css';


// Setup GA
ReactGA.initialize('UA-64729178-1');
ReactGA.pageview(window.location.pathname + window.location.search);

var ReactAI  = require('react-appinsights');
ReactAI.init({instrumentationKey:'99956a9b-a5c8-41f0-a252-087872ffaf03'});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});


class Inklin extends React.Component {


  constructor(props) {

    super(props);
    this.handleLuis = this.handleLuis.bind(this);
    this.handleSpeak = this.handleSpeak.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCloseSearch = this.handleCloseSearch.bind(this);

    this.addData = this.addData.bind(this);
    this.handleContractChooserClose = this.handleContractChooserClose.bind(this);

    this.state = {
      pagetitle: "Inklin Ethereum - ETH - Blockchain Visualisation",
      pagedescription: "Ethereum - ETH - Blockchain Visualisation and Analysis tool",
      network: {},
      block_info: {},
      isLive: true,
      numberoftxs: 0,
      zoomTimer: 0,
      streamTimer: 0,
      displayProgress: false,
      address: "0x274F3c32C90517975e29Dfc209a23f315c1e5Fc7",
      previousaddress: "0x274F3c32C90517975e29Dfc209a23f315c1e5Fc7",
      volumeIsHidden: false,
      searchIsHidden: false,
      statsIsHidden: false,
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

    this.setState({ pagetitle: `Ethereum Address ${address} visualisation` })

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
      this.setState({ data: data.docs, displayProgress: false, numberoftxs: data.length, pagedescription: `Analysis of Ethereum address ${address} with ${data.length} transactions associated with it` })
      const zoomTimer = setInterval(() => {
        this.state.network.fit({ animation: true })
        clearInterval(this.state.zoomTimer)
      }, 2000);
  
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
    this.setState({ pagetitle: `Ethereum Block ${block} visualisation` })
    console.log("In getBlock")
    clearInterval(this.state.streamTimer)

    this.setState({
      data: {
        nodes: [],
        edges: []
      }, displayProgress: true, isLive: false
    })

    const data_url = `${process.env.REACT_APP_API_SERVER}/api/inklin/transactions/${block}`

    fetch(data_url).then(res => res.json()).then(data => {
      this.setState({ data: data, displayProgress: false, current_block: data.block_number, numberoftxs: data.edges.length, pagedescription: `Analysis of Ethereum Block ${block} containing ${data.edges.length} transactions` })
    });


    const zoomTimer = setInterval(() => {
      this.state.network.fit({ animation: true })
      clearInterval(this.state.zoomTimer)
    }, 2000);

    this.setState({ zoomTimer: zoomTimer })

    if (this.state.volumeIsHidden) {
      const history_url = `${process.env.REACT_APP_API_SERVER}/api/inklin/history/${block}`

      fetch(history_url).then(res => res.json()).then(data => {


        const vd = {
          labels: [],
          datasets: [
            {
              label: 'tx/block',
              backgroundColor: '#40c4ff',
              borderWidth: 1,
              data: []
            }
          ]
        }

        for (var i in data) {
          vd.labels.push(data[i]._id.block_number)
          vd.datasets[0].data.push(data[i].no)
        }


        this.setState({ volume_data: vd, shouldRedraw: true, volumeIsHidden: false })
      });
    }


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

      const zoomTimer = setInterval(() => {
        this.state.network.fit({ animation: true })
        clearInterval(this.state.zoomTimer)
      }, 2000);
      this.setState({ zoomTimer: zoomTimer })

      const streamTimer = setInterval(() => {
        this.stream()
      }, 5000);

      this.setState({ streamTimer: streamTimer })
    });

  }



  hideVolume = () => {
    this.setState({ volumeIsHidden: !this.state.volumeIsHidden })
  }

  hideSearch = () => {
    this.setState({ searchIsHidden: !this.state.searchIsHidden })
  }

  hideStats = () => {
    this.setState({ statsIsHidden: !this.state.statsIsHidden })
  }

  handleLive = () => {
    console.log("Handling Live");
    this.state.isLive ? clearInterval(this.state.streamTimer) : this.stream()
    this.setState({ isLive: !this.state.isLive })
  }



  componentDidMount() {



    const myURL = new URL(window.location.href);
    console.log(myURL);

    if (myURL.hash === "#share") {
      this.setState({ volumeIsHidden: true, menuIsHidden: true, infoIsHidden: true, searchIsHidden: true, statsIsHidden: true })
    }

    const searchTerm = myURL.pathname.slice(1);
    if (searchTerm.length === 42) {
      this.setState({ address: searchTerm })
      this.getAll(searchTerm)
    } else if (!isNaN(parseFloat(searchTerm)) && isFinite(searchTerm)) {
      this.setState({ current_block: searchTerm })
      this.getBlock(searchTerm)
    } else {
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
      select: function (event) {
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
        maxVelocity: 50,
        solver: 'forceAtlas2Based',
        timestep: 1,
        stabilization: false
      }
    };
    return (



      <MuiThemeProvider theme={theme}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{this.state.pagetitle}</title>
          <meta name="keywords" content="ethereum, explorer, eth, search, blockchain, crypto, currency, visualisation" />
        </Helmet>

        <div className="leftpanel">
          {!this.state.volumeIsHidden && <VolumeChart data={this.state.volume_data} options={this.state.volume_options} shouldRedraw={this.state.shouldRedraw} />}
        </div>

        {/* {!this.state.menuIsHidden && <MenuAppBar onLuis={this.handleLuis} onSpeak={this.handleSpeak} placeholder={this.state.placeholder} />} */}
        {!this.state.menuIsHidden && <MiniDrawer handleLive={this.handleLive} handleVolume={this.hideVolume} handleSearch={this.hideSearch} handleStats={this.hideStats} showVolume={!this.state.volumeIsHidden} showStats={!this.state.statsIsHidden} showSearch={!this.state.searchIsHidden} isLive={this.state.isLive} currentBlock={this.state.current_block} />}

        {this.state.data.edges.length > 0 && <Graph getNetwork={network => this.setState({ network })} graph={this.state.data} events={events} options={options} />}

        {this.state.displayProgress && <ProgressIndicator />}

        <SearchDialog open={this.state.showSearch} closeDrawer={this.handleCloseSearch} />
        <div className="rightpanel">
          {!this.state.searchIsHidden && <SearchField handleFocus={this.props.handleFocus} handleLuis={this.handleLuis} />}
          {!this.state.statsIsHidden && <Info block_time={this.state.block_time} block_info={this.state.block_info} address={this.state.address} numberoftxs={this.state.numberoftxs} blocknumber={this.state.current_block} />}
          {!this.state.statsIsHidden && this.state.current_block > 0 && <History current_block={this.state.current_block} />}
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
