import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useInterval } from './useInterval';
import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from "recharts"
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

// WebSocket通信の確立
const sock = new WebSocket("ws://localhost:3001");
var receivedData;

// WebSocket通信が確立された時に呼び出される処理
sock.addEventListener("open", e => {
});

// WebSocket通信でサーバーからデータが送られてきた時に呼び出される処理
sock.addEventListener("message", e => {
  console.log("サーバーからメッセージを受信したときに呼び出されるイベント");
  // TODO: e.dataが配列なのかに応じて処理を分ける
  receivedData = Number(e.data);
});

// WebSocket通信が閉じられたときに呼び出される処理
sock.addEventListener("close", e => {
  console.log("接続が閉じられたときに呼び出されるイベント");
});

// WebSocket通信でエラーが生じたときに呼び出される処理
sock.addEventListener("error", e => {
  console.log("エラーが発生したときに呼び出されるイベント");
});

function App() {
  // 送られてきたデータを全て時系列順に格納する配列
  const [ data, setData ] = useState([{name: 0, value: 0}]);
  // グラフに表示するために整形したデータ配列
  const [ displayData, setDisplayData ] = useState([{name: 0, value: 0}]);
  // x軸の範囲制限を行うかどうかのフラグ(デフォルトでは0で行わない)
  const [ xEnable, setXEnable ] = useState(0);
  // x軸の下限と上限
  const [ xMin, setXMin ] = useState(0);
  const [ xMax, setXMax ] = useState(100);
  // y軸の範囲制限を行うかどうかのフラグ(デフォルトでは0で行わない)
  const [ yEnable, setYEnable ] = useState(0);
  // y軸の下限と上限
  const [ yMin, setYMin ] = useState(0);
  const [ yMax, setYMax ] = useState(1);
  useInterval({ onUpdate: () => {
    // TODO: receivedDataが配列なのかどうかを見てvalue1,value2,...と入れる値を増やす
    if(data.length === 1){
      setData([{name: 0,value: receivedData} ,{name: data.length,value: receivedData}])
    }else{
      setData([...data,{name: data.length,value: receivedData}])
    }
  }});

  const updateData = (e) => {
    // TODO: xEnable/yEnableによって処理の分岐を作る
    // TODO: 下限上限に応じてグラフの表示範囲を変更する処理を追加
    setDisplayData(data.map(({name, value}) => {
      if(name >= xMin && name <=xMax){
        if(value <= yMin){
          return {name: name, value: yMin};
        }
        if(value >= yMax){
          return {name: name, value: yMax};
        }
        return {name: name, value: value};
      }
    }).filter(Boolean));
    console.log(displayData);
  }

  const updateXEnable = (e) => {
  }

  const updateXMin = (e) => {
    let val = e.target.valueAsNumber;
    if(e.target.valueAsNumber<1){
      val = 0;
    }
    if(val >= xMax){
      setXMax(val+1);
    }
    setXMin(val);
  }

  const updateXMax = (e) => {
    let val = e.target.valueAsNumber;
    if(e.target.valueAsNumber<1){
      val = 1;
    }
    if(val <= xMin){
      setXMin(val-1);
    }
    setXMax(val);
  }

  const updateYMin = (e) => {
    let val = e.target.valueAsNumber;
    if(e.target.valueAsNumber<1){
      val = 0;
    }
    if(val >= yMax){
      setYMax(val+1);
    }
    setYMin(val);
  }

  const updateYMax = (e) => {
    let val = e.target.valueAsNumber;
    if(e.target.valueAsNumber<1){
      val = 1;
    }
    if(val <= yMin){
      setYMin(val-1);
    }
    setYMax(val);
  }



  return (
    <div className="App">
      <header className="App-header">
        <h1>Serial Plotter</h1>
        <LineChart
        width={730}
        height={250}
        data={displayData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" domain={[]}/>
          <YAxis domain={[]}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={<></>}/>
        </LineChart>
        <div>
          <Button variant="contained" onClick={updateData}>Update</Button>
        </div>
        <div>
          <Checkbox {...{ inputProps: { 'aria-label': 'xEnable' } }} />
          <label>time range</label>
          <span>
            <input type={"number"} min={0} onChange={updateXMin} value={xMin}></input>
            ~
            <input type={"number"} min={0} onChange={updateXMax} value={xMax}></input>
          </span>
        </div>
        <div>
          <Checkbox {...{ inputProps: { 'aria-label': 'yEnable' } }} />
          <span>
            <input type={"number"} min={0} onChange={updateYMin} value={yMin}></input>
            ~
            <input type={"number"} min={0} onChange={updateYMax} value={yMax}></input> 
          </span>
        </div>
      </header>
    </div>
  );
}

export default App;
