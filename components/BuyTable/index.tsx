import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tooltip } from "antd";
import {
  SearchOutlined,
  CopyOutlined,
  ExportOutlined,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import copy from "copy-to-clipboard";

const BuyTable = ({ data, period, loading, getPeriodLabel, darkMode }) => {
  const [dataSource, setDataSource] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const tempData = [];
    if (data.length) {
      if (period === "all") {
        setDataSource(data);
      } else {
        let d = new Date();
        d.setDate(d.getDate() - Number(period));
        data.forEach((f, i) => {
          let tx = f.transactions[0] ? f.transactions[0] : {};
          let sum = 0;
          const filterdTransaction = [];
          let d = new Date();
          d.setDate(d.getDate() - period);
          f.transactions.forEach((t) => {
            if (new Date(t.time * 1000) > d.getTime()) {
              sum = Number(sum) + t.result;
              filterdTransaction.push(t);
            }
          });
          tempData.push({
            id: i,
            address: f.address,
            total_received: f.total_received.toFixed(6),
            total_sent: f.total_sent.toFixed(6),
            balance: f.balance.toFixed(6),
            last_tx_balance_diff: Number(tx.result).toFixed(6),
            last_tx_timestamp: tx.time,
            transactions: filterdTransaction,
            sum: sum.toFixed(6),
          });
        });
        const filterData = tempData.filter((e) => {
          return new Date(e.last_tx_timestamp * 1000) > d.getTime();
        });
        setDataSource(filterData);
      }
    }
  }, [period, data]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            // setSearchInput(node);
          }}
          placeholder={
            dataIndex === "address" ? `Search address` : `Search tx hash`
          }
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, backgroundColor: "green" }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <div style={{ display: "flex", width: "100%" }}>
          <span style={{ width: "80%" }}>{text}</span>
          <div style={{ width: "20%" }}>
            <Tooltip placement="top" title="Copy to clipboard">
              <Button
                style={{ marginLeft: "20px", color: "green" }}
                icon={<CopyOutlined />}
                onClick={() => copy(text)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Open address">
              <a
                href={
                  dataIndex === "address"
                    ? `https://blockchair.com/bitcoin/address/${text}`
                    : `https://blockchair.com/bitcoin/transaction/${text}`
                }
              >
                <Button
                  style={{ marginLeft: "10px", color: "#80b3ff" }}
                  icon={<ExportOutlined />}
                  onClick={() => copy(text)}
                />
              </a>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", width: "100%" }}>
          <span style={{ width: "80%" }}>{text}</span>
          <div style={{ width: "20%" }}>
            <Tooltip placement="top" title="Copy to clipboard">
              <Button
                style={{ marginLeft: "20px", color: "green" }}
                icon={<CopyOutlined />}
                onClick={() => copy(text)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Open address">
              <a href={`https://blockchair.com/bitcoin/address/${text}`}>
                <Button
                  style={{ marginLeft: "10px", color: "#80b3ff" }}
                  icon={<ExportOutlined />}
                  onClick={() => copy(text)}
                />
              </a>
            </Tooltip>
          </div>
        </div>
      ),
  });

  const columns = [
    {
      title: "Rank",
      dataIndex: "id",
      render: (text) => Number(text) + 1,
      key: "id",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "550px",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
    {
      title: "Total Received",
      dataIndex: "total_received",
      key: "total_received",
    },
    {
      title: "Total Sent",
      dataIndex: "total_sent",
      key: "total_sent",
    },
    {
      title: "Last Volume (₿)",
      dataIndex: "last_tx_balance_diff",
      key: "last_tx_balance_diff",
      sorter: (a, b) =>
        Number(a.last_tx_balance_diff) - Number(b.last_tx_balance_diff),
      render: (text) => (
        <span
          style={{
            color: Number(text) > 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Last Tx Time",
      dataIndex: "last_tx_timestamp",
      key: "ilast_tx_timestampd",
      render: (text) => getDate(text),
      sorter: (a, b) => {
        return Number(a.last_tx_timestamp) - Number(b.last_tx_timestamp);
      },
    },
    {
      title: `${getPeriodLabel(period).split(":")[0]} sum`,
      dataIndex: "sum",
      key: "sum",
      render: (text) => (
        <span
          style={{
            color: Number(text) > 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },
  ];

  const getDate = (text) => {
    const d = new Date(text * 1000);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const time = d.toTimeString().split(" ")[0];
    return <span>{day + "/" + month + "/" + year + " " + time}</span>;
  };

  const expandedRowRender = (transactions, index) => {
    const columns = [
      {
        title: "Tx Hash",
        dataIndex: "tx_hash",
        key: "tx_hash",
        ...getColumnSearchProps("tx_hash"),
      },
      {
        title: "Tx Volume (₿)",
        dataIndex: "result",
        key: "result",
        render: (text) => (
          <span
            style={{
              color: Number(text) > 0 ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {text}
          </span>
        ),
      },
      {
        title: "Tx Time",
        dataIndex: "time",
        key: "time",
        render: (text) => getDate(text),
        sorter: (a, b) => {
          return Number(a.time) - Number(b.time);
        },
      },
    ];

    return (
      <Table
        rowKey={(record) => Math.random()}
        columns={columns}
        dataSource={transactions}
        pagination={false}
      />
    );
  };

  return (
    <div style={{ overflow: "auto", height: "700px", marginTop: "20px" }}>
      <Table
        className={
          darkMode
            ? "table-style table-style-hover table-con table-head table-expand"
            : ""
        }
        pagination={false}
        rowKey={(record) => record.id}
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        expandable={{
          expandedRowRender: (record, index) =>
            expandedRowRender(record.transactions, index),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <MinusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ) : (
              <PlusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ),
        }}
      />
    </div>
  );
};

export default BuyTable;
