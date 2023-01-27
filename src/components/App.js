import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { ethers } from "ethers";
import rewardAbi from "./rewardAbi.json";
import tokenAbi from "./tokenAbi.json";

const ZoneToken = "0xDd3699049C369e0aCa21faA29972b9BFA7593278";
const ZoneRewards = "0xef5702a3E3dECB3467E941FeB611e01483656d52";

function App() {
  const [wallet1, setWallet1] = useState();
  const [wallet2, setWallet2] = useState();
  const [wallet3, setWallet3] = useState();
  const [wallet4, setWallet4] = useState();
  const [REWARDCONTRACT, setREWARDCONTRACT] = useState();
  const [TOKENCONTRACT, setTOKENCONTRACT] = useState();
  const [wallet1Tickets, setWallet1Tickets] = useState(0);
  const [wallet2Tickets, setWallet2Tickets] = useState(0);
  const [wallet3Tickets, setWallet3Tickets] = useState(0);
  const [wallet1Rewards, setWallet1Rewards] = useState(0);
  const [wallet2Rewards, setWallet2Rewards] = useState(0);
  const [wallet3Rewards, setWallet3Rewards] = useState(0);
  const [wallet1Tokens, setWallet1Tokens] = useState(0);
  const [wallet2Tokens, setWallet2Tokens] = useState(0);
  const [wallet3Tokens, setWallet3Tokens] = useState(0);
  const [submitWallet1Rewards, setSubmitWallet1Rewards] = useState();
  const [submitWallet2Rewards, setSubmitWallet2Rewards] = useState();
  const [submitWallet3Rewards, setSubmitWallet3Rewards] = useState();
  useEffect(() => {
    if (!REWARDCONTRACT || !TOKENCONTRACT) return;

    const fetchData = async () => {
      setWallet1Rewards(
        ethers.utils.formatEther(
          await REWARDCONTRACT.availableRewards(
            "0x6F9b44c7a86F8e01c85B76d4B6146E2b3f85d419"
          )
        )
      );
      setWallet1Tickets(
        ethers.utils.formatUnits(
          await REWARDCONTRACT.availableTickets(
            "0x6F9b44c7a86F8e01c85B76d4B6146E2b3f85d419"
          ),
          0
        )
      );
      setWallet1Tokens(
        ethers.utils.formatEther(
          await TOKENCONTRACT.balanceOf(
            "0x6F9b44c7a86F8e01c85B76d4B6146E2b3f85d419"
          )
        )
      );

      setWallet2Rewards(
        ethers.utils.formatEther(
          await REWARDCONTRACT.availableRewards(
            "0x6e13Bae8db59F0A9e226C6a654E57121a10659A1"
          )
        )
      );
      setWallet2Tickets(
        ethers.utils.formatUnits(
          await REWARDCONTRACT.availableTickets(
            "0x6e13Bae8db59F0A9e226C6a654E57121a10659A1"
          ),
          0
        )
      );
      setWallet2Tokens(
        ethers.utils.formatEther(
          await TOKENCONTRACT.balanceOf(
            "0x6e13Bae8db59F0A9e226C6a654E57121a10659A1"
          )
        )
      );
      setWallet3Rewards(
        ethers.utils.formatEther(
          await REWARDCONTRACT.availableRewards(
            "0x95e326CAD91aa9D4417433a08f9f19AC2708156b"
          )
        )
      );
      setWallet3Tickets(
        ethers.utils.formatUnits(
          await REWARDCONTRACT.availableTickets(
            "0x95e326CAD91aa9D4417433a08f9f19AC2708156b"
          ),
          0
        )
      );
      setWallet3Tokens(
        ethers.utils.formatEther(
          await TOKENCONTRACT.balanceOf(
            "0x95e326CAD91aa9D4417433a08f9f19AC2708156b"
          )
        )
      );
    };
    fetchData();
  }, [TOKENCONTRACT, REWARDCONTRACT]);

  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(ZoneToken, tokenAbi, signer);
    setTOKENCONTRACT(tokenContract);
    const rewardContract = new ethers.Contract(ZoneRewards, rewardAbi, signer);
    setREWARDCONTRACT(rewardContract);
  };

  const buyTicket = async () => {
    if (!REWARDCONTRACT || !TOKENCONTRACT) return;
    const approve = await TOKENCONTRACT.approve(
      ZoneRewards,
      ethers.utils.parseEther("1000")
    );
    await approve.wait();
    await REWARDCONTRACT.buyTicket();
  };

  const endGame = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:3000/", {
          addressArray: [wallet1, wallet2, wallet3],
        })
        .then((res) => console.log(res));
    } catch (error) {
      console.log(error);
    }
  };

  const submitRewards = async (e) => {
    e.preventDefault();
    const addressArray = [wallet1, wallet2, wallet3];
    const rewardArray = [
      Number(submitWallet1Rewards),
      Number(submitWallet2Rewards),
      Number(submitWallet3Rewards),
    ];
    try {
      await axios.post("http://localhost:3000/rewards", {
        addressArray,
        rewardArray,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const claimRewards = async () => {
    await REWARDCONTRACT.claimRewards();
  };

  return (
    <div className='App'>
      <div className='connect'>
        <button onClick={() => connect()}>Connect</button>
      </div>
      <div className='buyticket'>
        Price of 1 Ticket: 1000
        <button onClick={() => buyTicket()}>Buy Ticket</button>
      </div>
      <div className='walletinfo'>
        <div className='wallet'>
          Wallet: 0x6F9b44c7a86F8e01c85B76d4B6146E2b3f85d419
          <div className='walletstats'>
            <div className='wallet-tokens'>
              Tokens Availalbe: {wallet1Tokens}
            </div>
            <div className='wallet-tickets'>
              Tickets Availalbe: {wallet1Tickets}
            </div>
            <div className='wallet-rewards'>
              Rewards Available: {wallet1Rewards}
            </div>
          </div>
        </div>
        <div className='wallet'>
          Wallet: 0x6e13Bae8db59F0A9e226C6a654E57121a10659A1
          <div className='walletstats'>
            <div className='wallet-tokens'>
              Tokens Availalbe: {wallet2Tokens}
            </div>
            <div className='wallet-tickets'>
              Tickets Availalbe: {wallet2Tickets}
            </div>
            <div className='wallet-rewards'>
              Rewards Available: {wallet2Rewards}
            </div>
          </div>
        </div>
        <div className='wallet'>
          Wallet: 0x95e326CAD91aa9D4417433a08f9f19AC2708156b
          <div className='walletstats'>
            <div className='wallet-tokens'>
              Tokens Availalbe: {wallet3Tokens}
            </div>
            <div className='wallet-tickets'>
              Tickets Availalbe: {wallet3Tickets}
            </div>
            <div className='wallet-rewards'>
              Rewards Available: {wallet3Rewards}
            </div>
          </div>
        </div>
      </div>

      <div className='endgame-container'>
        End Game
        <form>
          <input
            onChange={(e) => setWallet1(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />
          <input
            onChange={(e) => setWallet2(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />
          <input
            onChange={(e) => setWallet3(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />

          <button onClick={(e) => endGame(e)}>End Game</button>
        </form>
      </div>

      <div className='endgame-container'>
        Submit Rewards
        <form>
          <input
            onChange={(e) => setWallet1(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
            placeholder={"Wallet"}
          />
          <input
            onChange={(e) => setSubmitWallet1Rewards(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
            placeholder={"Rewards"}
          />
          <input
            onChange={(e) => setWallet2(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
            placeholder={"Wallet"}
          />
          <input
            onChange={(e) => setSubmitWallet2Rewards(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
            placeholder={"Rewards"}
          />
          <input
            onChange={(e) => setWallet3(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
            placeholder={"Wallet"}
          />
          <input
            onChange={(e) => setSubmitWallet3Rewards(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
            placeholder={"Rewards"}
          />

          <button onClick={(e) => submitRewards(e)}>End Game</button>
        </form>
      </div>
      <div>
        <button onClick={() => claimRewards()}>Claim Rewards</button>
      </div>
    </div>
  );
}

export default App;
