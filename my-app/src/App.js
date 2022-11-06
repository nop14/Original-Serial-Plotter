import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useInterval } from './useInterval';
import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer} from "recharts"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';

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
  // x軸の範囲制限を行うかどうかのフラグ
  const [ xEnable, setXEnable ] = useState(false);
  // x軸の下限と上限
  const [ xMin, setXMin ] = useState(0);
  const [ xMax, setXMax ] = useState(100);
  // x軸分解能
  const [ xStep, setXStep ] = useState(1);
  // x軸範囲
  const [ xRange, setXRange ] = useState([0, 100]);
  // y軸の範囲制限を行うかどうかのフラグ
  const [ yEnable, setYEnable ] = useState(false);
  // y軸の下限と上限
  const [ yMin, setYMin ] = useState(0);
  const [ yMax, setYMax ] = useState(1);
  // y軸分解能
  const [ yStep, setYStep ] = useState(0.01);
  // y軸範囲
  const [ yRange, setYRange ] = useState([0, 1]);
  useInterval({ onUpdate: () => {
    // TODO: receivedDataが配列なのかどうかを見てvalue1,value2,...と入れる値を増やす
    if(data.length === 1){
      setData([{name: 0,value: receivedData} ,{name: data.length,value: receivedData}]);
    }else{
      setData([...data,{name: data.length,value: receivedData}]);
    }
  }});

  const updateData = (e) => {
    // TODO: xEnable/yEnableによって処理の分岐を作る
    // DONE: 下限上限に応じてグラフの表示範囲を変更する処理を追加
    setDisplayData(data.map(({name, value}) => {
      if(xEnable){
        if(name >= xRange[0] && name <=xRange[1]){
          if(yEnable){
            if(value <= yRange[0]){
              return {name: name, value: yRange[0]};
            }
            if(value >= yRange[1]){
              return {name: name, value: yRange[1]};
            }
          }
          return {name: name, value: value};
        }
      }else{
        if(yEnable){
          if(value <= yRange[0]){
            return {name: name, value: yRange[0]};
          }
          if(value >= yRange[1]){
            return {name: name, value: yRange[1]};
          }
        }
        return {name: name, value: value};
      }
      
    }).filter(Boolean));
    console.log(displayData);
  }

  const updateXEnable = (e) => {
    setXEnable(e.target.checked);
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

  const updateXStep = (e) => {
    let val = e.target.valueAsNumber;
    if(e.target.valueAsNumber<0){
      val = 0;
    }
    setXStep(val);
  }

  const updateYStep = (e) => {
    let val = e.target.valueAsNumber;
    if(e.target.valueAsNumber<0){
      val = 0;
    }
    setYStep(val);
  }

  const updateYEnable = (e) => {
    setYEnable(e.target.checked);
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

  const handleXRangeChange = (event, newValue) => {
    setXRange(newValue);
  };

  const handleYRangeChange = (event, newValue) => {
    setYRange(newValue);
  };


  return (
    <div className="App">
      <header className="App-header">
        <div width="100%">
          <LineChart
          width={730}
          height={250}
          data={displayData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis domain={[]}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" dot={<></>}/>
          </LineChart>
        </div>
        <div>
          <Button variant="contained" onClick={updateData}>Update</Button>
        </div>
        <Box>
          <Box sx={{ width: "100vw" }}>
            <FormControlLabel control={<Checkbox onChange={updateXEnable}/>} label="X range" sx={{width: "6em"}}/>
            <TextField
              id="x-min"
              label="X-min"
              type="number"
              min={0}
              disabled={!xEnable}
              onChange={updateXMin}
              value={xMin}
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
              sx={{ width: "5em", mr: 2 }}
            />
            <TextField
              id="x-max"
              label="X-max"
              type="number"
              min={1}
              disabled={!xEnable}
              onChange={updateXMax}
              value={xMax}
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
              sx={{ width: "5em", mr: 2 }}
            />
            <TextField
              id="x-step"
              label="X-step"
              type="number"
              min={0}
              disabled={!xEnable}
              onChange={updateXStep}
              value={xStep}
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
              sx={{ width: "5em"}}
            />
          </Box>
          <Box>
            <Slider
              aria-label="Always visible"
              min={xMin}
              max={xMax}
              step={xStep}
              value={xRange}
              onChange={handleXRangeChange}
              valueLabelDisplay="auto"
              sx = {{width: "30vw", mr: 2, verticalAlign: "bottom"}}
              disabled={!xEnable}
              disableSwap
            />
          </Box>
        </Box>
        <Box>
          <Box sx={{ width: "100vw" }}>
            <FormControlLabel control={<Checkbox onChange={updateYEnable}/>} label="Y range" sx={{width: "6em", verticalAlign: "middle"}}/>
            <TextField
              id="y-min"
              label="Y-min"
              type="number"
              min={0}
              disabled={!yEnable}
              onChange={updateYMin}
              value={yMin}
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
              sx={{ width: "5em", mr: 2 }}
            />
            <TextField
              id="y-max"
              label="Y-max"
              type="number"
              min={0}
              disabled={!yEnable}
              onChange={updateYMax}
              value={yMax}
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
              sx={{ width: "5em", mr: 2}}
            />
            <TextField
              id="y-step"
              label="Y-step"
              type="number"
              min={0}
              disabled={!yEnable}
              onChange={updateXStep}
              value={yStep}
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
              sx={{ width: "5em"}}
            />
          </Box>
          <Box>
            <Slider
              aria-label="Always visible"
              min={yMin}
              max={yMax}
              step={yStep}
              value={yRange}
              onChange={handleYRangeChange}
              valueLabelDisplay="auto"
              sx = {{width: "30vw", mr: 2, verticalAlign: "bottom"}}
              disabled={!yEnable}
              disableSwap
            />
          </Box>
        </Box>
      </header>
    </div>
  );
}

export default App;
