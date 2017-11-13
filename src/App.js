import React, { Component } from 'react';
import cash from './cash.png';
import legacy from './legacy.png';
import bar from './bar.svg';
import './App.css';
// import confetti from './confetti';
import axios from 'axios';

const toUsd = function (value) {
  return '$ ' + value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}
const toBrokenNumber = function (value) {
  return '' + value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}
const toPhash = function (value) {
  value = value / 1000000000;
  return '' + value.toFixed(3).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

class App extends Component {
  constructor(){
    super()
    this.state = {
      bch: null,
      btc: null
    }
  }
  componentDidMount(){
    let self = this;

    axios.get('https://api.blockchain.info/stats?cors=true').then((result)=>{
      console.log(result.data)
      self.setState({stats: result.data})
    });
    axios.get('https://api.blockchain.info/q/unconfirmedcount?cors=true').then((result)=>{
      console.log(result.data)
      self.setState({unconfirmedcount: result.data})
    });
    axios.get('https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/').then((result)=>{
      console.log(result.data[0])
      self.setState({bch: result.data[0]})
    })
    axios.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/').then((result)=>{
      self.setState({btc: result.data[0]})
    })

    function updateCrypto() {
      setTimeout(function(){
        axios.get('https://api.blockchain.info/stats?cors=true').then((result)=>{
          console.log(result.data)
          self.setState({stats: result.data})
        });
        axios.get('https://api.blockchain.info/q/unconfirmedcount?cors=true').then((result)=>{
          console.log(result.data)
          self.setState({unconfirmedcount: result.data})
        });
        axios.get('https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/').then((result)=>{
          console.log(result.data[0])
          self.setState({bch: result.data[0]})
        })
        axios.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/').then((result)=>{
          self.setState({btc: result.data[0]})
        })
        updateCrypto();
      }, 30000);
    }

    updateCrypto();



  }

  render() {
    const {bch, btc, unconfirmedcount, stats}  = this.state;
    if (!bch || !btc || !stats || !unconfirmedcount) {
      return (<div>Loading..</div>);
    }
    const totalcap = parseInt(btc.market_cap_usd,10) + parseInt(bch.market_cap_usd,10);

    const bch_pct = Math.round(bch.market_cap_usd * 100 / totalcap)
    const btc_pct = Math.round(btc.market_cap_usd * 100 / totalcap)
    const flippening_pct = Math.round( bch.market_cap_usd * 100 / (totalcap/2));
    // {btc ? btc.market_cap_usd : null}
    return (
      <div className="App">
        <div className="bar"><img src={bar} /></div>
        <div className="title">Bitcoin Legacy ft. Cash - "Flippening" </div>
        <div className="flippening_pct">{flippening_pct}%</div>
        <div className="stats">
          <table className="table table-striped">
              <thead>
                <tr>
                  <th> </th>
                  <th><img className="logo" alt="" src={cash} /></th>
                  <th><img className="logo" alt="" src={legacy} /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Marketshare pct:</td>
                  <td>{bch_pct} %</td>
                  <td>{btc_pct} %</td>
                </tr>
                <tr>
                  <td>Market cap:</td>
                  <td>{toUsd(parseInt(bch.market_cap_usd,10))}</td>
                  <td>{toUsd(parseInt(btc.market_cap_usd,10))}</td>
                </tr>
                <tr>
                  <td>Trading volume:</td>
                  <td>{toUsd(parseInt(bch['24h_volume_usd'],10))}</td>
                  <td>{toUsd(parseInt(btc['24h_volume_usd'],10))}</td>
                </tr>

                <tr>
                  <td>Price per coin:</td>
                  <td>{toUsd(parseInt(bch['price_usd'],10))}</td>
                  <td>{toUsd(parseInt(btc['price_usd'],10))}</td>
                </tr>
                <tr>
                  <td>Unconfirmed tx's:</td>
                  <td>n.a.</td>
                  <td>{toBrokenNumber(unconfirmedcount)}</td>
                </tr>
                <tr>
                  <td>Hashrate:</td>
                  <td>n.a.</td>
                  <td>{toPhash(stats.hash_rate)}EH/s</td>
                </tr>

              </tbody>
            </table>
            <div className="footer">
              Made by <a href="https://www.reddit.com/user/Kas_per/" rel="noopener noreferrer" target="_blank">kas_per</a>.
            </div>
        </div>

        <div className="bch" style={ {height: flippening_pct + "%"}}>
          <canvas className="confetti-canvas" ref={(input) => {this.confettiCanvas = input; }} />
        </div>
        <div className="btc" style={ {height: 100 - flippening_pct + "%"}}>
        </div>

      </div>
    );
  }
}

export default App;
