# Week 12 Report – Amine GADDAH  
**January 12–18, 2026**

# What I Did
- Worked on the **creation of the smart contract** using **TypeScript**.
- Completed and validated the contract logic after running the **mock tests**.
- Created the **genesis_counter_cell** for contract initialization.
- Implemented the transaction logic in **sendTx.cjs**.
- Deployed and tested the contract on **Devnet**.

# What I Learned
- How to create and structure a smart contract using **TypeScript**.
- The importance of **mock tests** before deployment.
- How **genesis cells** are created and used.
- How to send transactions programmatically.
- How to identify and debug wallet connector integration issues.

# Important Files
- [`index.js`](./index.js)
- [`my-first-contract.mock.test.js`](./my-first-contract.mock.test.js)
- [`index2.js`](./index2.js)
- [`counter.mock.test.js`](./counter.mock.test.js)
- [`sendTx.cjs`](./sendTx.cjs)

# Results
![Building](./W09-BuildContract.png)

![Deployment](./W09-DeployContract.png)

Tests ran successfully:  
![TestResults](./W09-TestContract.png)

![TestResults](./W09-InkrementInputTest.png)

# Goals for Next Week
- Use **CCC wallet connector** instead of **JoyID wallet connector**.
- Start building the **UI**.
- Integrate the UI with the wallet and smart contract.
