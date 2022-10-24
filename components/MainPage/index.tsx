import { useEffect, useState } from "react";
import {
  Select,
  Button,
  Spin,
  Collapse,
  Switch,
  Empty,
  Statistic,
  Card,
  Row,
  Col,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import BuyTable from "../BuyTable";
import "antd/dist/antd.css";

const { Panel } = Collapse;

const MainPage = () => {
  const [buys, setBuys] = useState(0);
  const [sells, setSells] = useState(0);
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("2");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const getData = () => {
      setTransactions([]);
      setData([]);
      fetch("https://api.blockchair.com/bitcoin/addresses?limit=100&offset=0")
        .then((res) => res.json())
        .then(
          (result) => {
            setData(result.data ? [...result.data] : []);
            if (!result.data) {
              setTransactions([]);
            }
          },
          (error) => {}
        );
    };
    // getData();
  }, []);

  const getData = () => {
    setTransactions([]);
    setData([]);
    fetch("https://api.blockchair.com/bitcoin/addresses?limit=100&offset=0")
      .then((res) => res.json())
      .then(
        (result) => {
          setData(result.data ? [...result.data] : []);
          if (!result.data) {
            setTransactions([]);
          }
        },
        (error) => {}
      );
  };

  useEffect(() => {
    const getSellsBuys = async () => {
      let tempTransactions = [];
      setLoading(true);
      let addresses1 = "";
      let addresses2 = "";
      let addresses3 = "";
      let addresses4 = "";
      let addresses5 = "";
      let addresses6 = "";
      let addresses7 = "";
      let addresses8 = "";
      let addresses9 = "";
      let addresses10 = "";
      for (let i = 0; i < data.length; i++) {
        if (i < 10) addresses1 = addresses1.concat(data[i].address).concat("|");
        if (9 < i && i < 20)
          addresses2 = addresses2.concat(data[i].address).concat("|");
        if (19 < i && i < 30)
          addresses3 = addresses3.concat(data[i].address).concat("|");
        if (29 < i && i < 40)
          addresses4 = addresses4.concat(data[i].address).concat("|");
        if (39 < i && i < 50)
          addresses5 = addresses5.concat(data[i].address).concat("|");
        if (49 < i && i < 60)
          addresses6 = addresses6.concat(data[i].address).concat("|");
        if (59 < i && i < 70)
          addresses7 = addresses7.concat(data[i].address).concat("|");
        if (69 < i && i < 80)
          addresses8 = addresses8.concat(data[i].address).concat("|");
        if (79 < i && i < 90)
          addresses9 = addresses9.concat(data[i].address).concat("|");
        if (89 < i && i < 100)
          addresses10 = addresses10.concat(data[i].address).concat("|");
      }
      const t1 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses1}`
      );
      const t2 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses2}`
      );
      const t3 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses3}`
      );
      const t4 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses4}`
      );
      const t5 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses5}`
      );
      const t6 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses6}`
      );
      const t7 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses7}`
      );
      const t8 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses8}`
      );
      const t9 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses9}`
      );
      const t10 = await fetch(
        `https://blockchain.info/multiaddr?active=${addresses10}`
      );
      const resp1 = await t1.json();
      const resp2 = await t2.json();
      const resp3 = await t3.json();
      const resp4 = await t4.json();
      const resp5 = await t5.json();
      const resp6 = await t6.json();
      const resp7 = await t7.json();
      const resp8 = await t8.json();
      const resp9 = await t9.json();
      const resp10 = await t10.json();
      const resp = {
        addresses: [
          ...resp1.addresses,
          ...resp2.addresses,
          ...resp3.addresses,
          ...resp4.addresses,
          ...resp5.addresses,
          ...resp6.addresses,
          ...resp7.addresses,
          ...resp8.addresses,
          ...resp9.addresses,
          ...resp10.addresses,
        ],
        txs: [
          ...resp1.txs,
          ...resp2.txs,
          ...resp3.txs,
          ...resp4.txs,
          ...resp5.txs,
          ...resp6.txs,
          ...resp7.txs,
          ...resp8.txs,
          ...resp9.txs,
          ...resp10.txs,
        ],
      };
      resp.addresses.forEach((el) => {
        tempTransactions.push({
          address: el.address,
          balance: Number(el.final_balance) / 100000000,
          total_received: Number(el.total_received) / 100000000,
          total_sent: Number(el.total_sent) / 100000000,
          transactions: [],
        });
      });
      tempTransactions.forEach((el) => {
        resp.txs.forEach((tx) => {
          // for (let i = 0; i < tx.inputs.length; i++) {
          //   if (tx.inputs[i].prev_out.addr === el.address) {
          //     el.transactions.push({
          //       tx_hash: tx.hash,
          //       result: Number(tx.result) / 100000000,
          //       time: tx.time,
          //     });
          //     break;
          //   }
          // }
          for (let i = 0; i < tx.out.length; i++) {
            if (tx.out[i].addr === el.address) {
              el.transactions.push({
                tx_hash: tx.hash,
                result: Number(tx.result) / 100000000,
                time: tx.time,
              });
              break;
            }
          }
        });
      });
      tempTransactions.forEach((el) => {
        el.transactions.sort(function (x, y) {
          return y.time - x.time;
        });
      });
      tempTransactions.sort(function (x, y) {
        return y.balance - x.balance;
      });
      setTransactions([...tempTransactions]);
    };
    data.length && getSellsBuys();
  }, [data]);

  useEffect(() => {
    const calculate = () => {
      let tempSells = 0;
      let tempBuys = 0;
      let d = new Date();
      period !== "all" && d.setDate(d.getDate() - Number(period));
      transactions.forEach((e) => {
        e.transactions.forEach((tx) => {
          if (period === "all") {
            if (tx.result < 0) {
              tempSells = tempSells + Number(tx.result);
            } else {
              tempBuys = tempBuys + Number(tx.result);
            }
          } else {
            let d = new Date();
            d.setDate(d.getDate() - period);
            if (new Date(tx.time * 1000) > d.getTime()) {
              if (tx.result < 0) {
                tempSells = tempSells + Number(tx.result);
              } else {
                tempBuys = tempBuys + Number(tx.result);
              }
            }
          }
        });
      });
      setLoading(false);
      setSells(tempSells);
      setBuys(tempBuys);
    };
    calculate();
  }, [period, transactions]);

  const onMenuClicked = (key) => {
    setPeriod(key);
  };

  const getPeriodLabel = (period) => {
    return Number(period) < 7
      ? `Last ${period} days:`
      : period === "7"
      ? "Last week:"
      : period === "30"
      ? "Last month:"
      : "All time:";
  };

  return (
    <div
      className="App"
      style={
        darkMode ? { backgroundColor: "#0d0d0d" } : { backgroundColor: "white" }
      }
    >
      <div
        style={{ marginTop: "30px", marginRight: "30px", marginLeft: "30px" }}
      >
        <div>
          <Select
            defaultValue="2"
            style={{
              width: "120px",
              marginRight: "20px",
              backgroundColor: "black",
            }}
            onChange={onMenuClicked}
            disabled={loading}
          >
            <Select.Option key="1">1 Day</Select.Option>
            <Select.Option key="2">2 Days</Select.Option>
            <Select.Option key="3">3 Days</Select.Option>
            <Select.Option key="4">4 Days</Select.Option>
            <Select.Option key="5">5 Days</Select.Option>
            <Select.Option key="6">6 Days</Select.Option>
            <Select.Option key="7">1 Week</Select.Option>
            <Select.Option key="30">1 Month</Select.Option>
            <Select.Option key="all">All</Select.Option>
          </Select>
          <Button
            onClick={() => getData()}
            type="primary"
            icon={<ReloadOutlined />}
            style={{
              marginRight: "20px",
              backgroundColor: "#3f8600",
              width: "120px",
            }}
            loading={loading}
          >
            Load Data
          </Button>
          <Switch
            className={darkMode ? "switch-color" : ""}
            checkedChildren="🌞"
            unCheckedChildren="🌙"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                style={
                  darkMode
                    ? { backgroundColor: "#0d0d0d" }
                    : { backgroundColor: "white" }
                }
              >
                <Statistic
                  title={
                    <span
                      style={
                        darkMode ? { color: "white" } : { color: "#0d0d0d" }
                      }
                    >
                      Sells
                    </span>
                  }
                  value={sells}
                  valueStyle={{ color: "#cf1322" }}
                  suffix="(₿)"
                  formatter={(value) => {
                    return loading ? <Spin size="small" /> : value.toFixed(4);
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                style={
                  darkMode
                    ? { backgroundColor: "#0d0d0d" }
                    : { backgroundColor: "white" }
                }
              >
                <Statistic
                  title={
                    <span
                      style={
                        darkMode ? { color: "white" } : { color: "#0d0d0d" }
                      }
                    >
                      Buys
                    </span>
                  }
                  value={buys}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={loading ? "" : "+"}
                  suffix="(₿)"
                  formatter={(value) => {
                    return loading ? <Spin size="small" /> : value.toFixed(4);
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
        {data.length ? (
          <BuyTable
            data={transactions}
            period={period}
            loading={loading}
            getPeriodLabel={getPeriodLabel}
            darkMode={darkMode}
          />
        ) : (
          <div style={{ overflow: "auto", height: "300px", marginTop: "30px" }}>
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
