import './Chart.css'
import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

function Chart() {

    const priceChart = 400;
    const priceIncrease = 10;
    const priceDecrease = 0.2;
    const priceIncreaseAmount = React.useRef(0);
    const intervalIDRef = React.useRef(true);
    const time = React.useRef(0);
    const data = React.useRef([{ seconds: 0, price: 0.05 }]);
    const minPrice = React.useRef(0);
    const maxPrice = React.useRef(400);
    const ticksCount = React.useRef(6);
    const zeroReached = React.useRef(false);
    const [value, setValue] = React.useState(0);
    const [valueTwo, setValueTwo] = React.useState(0);
    const xTime = React.useRef(10);
    const startTimer = () => {
        if (!intervalIDRef.current) {
            intervalIDRef.current = setInterval(() => {

                let copyData = data.current.slice();
                let price = priceChart + priceIncrease * priceIncreaseAmount.current - time.current * priceDecrease;
                if (price <= minPrice.current && !zeroReached.current) {
                    minPrice.current = minPrice.current - 80;
                    ticksCount.current = ticksCount.current + 1;
                    zeroReached.current = true;
                }
                if (price > maxPrice.current) {
                    maxPrice.current = maxPrice.current + 80;
                    ticksCount.current = ticksCount.current + 1;
                }
                copyData.push({ seconds: time.current, price: price <= 0 ? 0 : price });
                data.current = copyData;
                time.current = time.current + Number.parseInt(xTime.current);
                if (time.current > 7000) {
                    data.current = [{ seconds: 0, price: priceChart }];
                    time.current = 0;
                    priceIncreaseAmount.current = 0;
                    minPrice.current = 0;
                    maxPrice.current = 400;
                    zeroReached.current = false;
                    ticksCount.current = 6;

                }
                setValue(value + 1);
                clearInterval(intervalIDRef.current);
                intervalIDRef.current = undefined;
            }, 100);
        }
    }

    const increaseChart = () => {
        priceIncreaseAmount.current = priceIncreaseAmount.current + 1;
        setValueTwo(valueTwo + 1);
    }

    const restartChart = () => {
        clearInterval(intervalIDRef.current);
        intervalIDRef.current = undefined;
        data.current = [{ seconds: 0, price: priceChart }];
        time.current = 0;
        priceIncreaseAmount.current = 0;
        minPrice.current = 0;
        maxPrice.current = 400;
        zeroReached.current = false;
        ticksCount.current = 6;
        startTimer();
    }

    const stopChart = () => {
        clearInterval(intervalIDRef.current);
        intervalIDRef.current = true;
    }

    const startChart = () => {
        if (intervalIDRef.current === true) {
            intervalIDRef.current = undefined;
            startTimer();
        }
    }

    React.useEffect(() => {
        startTimer();
    }, [value])

    return (
        <div id="chart" className="mainChart">
            <button className="button buttonStart" onClick={startChart}>Start</button>
            <button className="button buttonStop" onClick={stopChart}>Stop</button>
            <button className="button buttonRestart" onClick={restartChart}>Restart</button>
            <div className="textChart selectTextMain">Speed</div>
            <div className='selectSpeedMain'><select className="selectCustom" id="sel" name="hero[]" onChange={() => {
                xTime.current = document.getElementById("sel").value;
            }}>
                <option selected value="10">x100</option>
                <option value="25">x250</option>
                <option value="50">x500</option>
                <option value="75">x750</option>
                <option value="100">x1000</option>
            </select></div>
            <button className="button buttonChartMain" onClick={increaseChart}>Increase</button>
            <div className="priceIncreaseAmount">{priceIncreaseAmount.current}</div>
            <div className="chartChartMain">
                <LineChart width={window.innerWidth * 0.573 > 1100 ? 1100 : window.innerWidth * 0.573} height={window.innerWidth * 0.3125 > 600 ? 600 : window.innerWidth * 0.3125} data={data.current} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                    <XAxis
                        stroke="#ffffff"
                        strokeWidth="4"
                        domain={[0, 8000]}
                        type="number"
                        dataKey="seconds"
                        interval={0}
                        tickCount={6}
                        allowDataOverflow={true} />
                    <YAxis
                        stroke="#ffffff"
                        strokeWidth="4"
                        domain={[minPrice.current, maxPrice.current]}
                        interval={0}
                        tickCount={ticksCount.current}
                        type="number"
                        allowDataOverflow={true} />
                    <Line isAnimationActive={false} connectNulls type="monotone" dataKey="price" stroke="#F5DEB3FF" strokeWidth="5" dot={false} />
                </LineChart>
                <p className="textChart priceLabel">Price</p>
                <p className="textChart secondsLabel">Seconds</p>
            </div>
        </div>
    );
}


export default Chart;