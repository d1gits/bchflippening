import React, { Component } from 'react';
import cash from './cash.png';
import legacy from './legacy.png';
import './App.css';
import confetti from './confetti';
const coinmarketcap = require('coinmarketcap')



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
    console.log(this.confettiCanvas)
    // confetti(this.confettiCanvas);
    coinmarketcap.tickerByAsset('bitcoin-cash', {}).then((result)=>{
      self.setState({bch: result})
    })
    coinmarketcap.tickerByAsset('bitcoin', {}).then((result)=>{
      self.setState({btc: result})
    })
  }
  render() {
    const {bch, btc}  = this.state;
    if (!bch || !btc) {
      return (<div>Loading..</div>);
    }
    const totalcap = parseInt(btc.market_cap_usd) + parseInt(bch.market_cap_usd);

    const bch_pct = Math.round(bch.market_cap_usd * 100 / totalcap)
    const btc_pct = Math.round(btc.market_cap_usd * 100 / totalcap)
    // {btc ? btc.market_cap_usd : null}
    return (
      <div className="App">

        <div className="bch" style={ {height: Math.min(Math.max(25,bch_pct),75) + "vh"}}>
          <canvas className="confetti-canvas" ref={(input) => {this.confettiCanvas = input; }} />
          <div className="stats">
            <img className="logo" src={cash} /><br/>
            Marketshare percentage: {bch_pct}
          </div>
        </div>
        <div className="btc" style={ {height: Math.min(Math.max(25,btc_pct),75) + "vh"}}>
          <div className="stats">
            <img className="logo" src={legacy} /> <br/>
            Marketshare percentage: {btc_pct}
          </div>
        </div>

      </div>
    );
  }
}

export default App;
