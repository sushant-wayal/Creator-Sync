import { ethers } from 'ethers';
import { paymentContractAbi } from '@/constants';
import { updateAccountAddress } from '@/actions/user';
import { toast } from 'sonner';
import { USDtoETH } from '@/actions/requestEdit';
import { paymentContractAddress } from '@/constants';
import { createCompleteTypePayment, createPayment, updateStatus } from '@/actions/payment';
import { PaymentStatus, PaymentType } from '@prisma/client';

export const connectWallet = async () => {
  if (!window.ethereum) {
    toast.error('No ethereum provider found');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const account = accounts[0];

  await updateAccountAddress(account);
  return account;
}

export const getContract = async () => {
  if (!window.ethereum) {
    toast.error('No ethereum provider found');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  if (!paymentContractAddress) {
    throw new Error('paymentContractAddress is not defined');
  }
  const contract = new ethers.Contract(paymentContractAddress, paymentContractAbi, signer);
  return contract;
}

export const paymentCreate = async (projectId: string, budget: number, deadline: Date, accountAddress: string) => {
  const contract = await getContract();
  const budgetInEth = await USDtoETH(budget);
  const paymentId = await createPayment(projectId, -1*Number(budgetInEth), PaymentType.CREATE);
  try {
    const unixDeadline = Math.floor(deadline.getTime()/1000);
    const tx = await contract.create(projectId, budget, unixDeadline, accountAddress, { value: ethers.parseEther(budgetInEth.toString()) });
    await tx.wait();
    await updateStatus(paymentId, PaymentStatus.COMPLETED);
  } catch (e) {
    await updateStatus(paymentId, PaymentStatus.FAILED);
    throw e;
  }
}

export const paymentExtendDeadline = async (projectId: string, days: number) => {
  const paymentId = await createPayment(projectId, 0, PaymentType.EXTEND_DEADLINE);
  try {
    const contract = await getContract();
    const tx = await contract.extendDeadline(projectId, days);
    await tx.wait();
    await updateStatus(paymentId, PaymentStatus.COMPLETED);
  } catch (e) {
    await updateStatus(paymentId, PaymentStatus.FAILED);
    throw e;
  }
}

export const paymentComplete = async (projectId: string) => {
  const contract = await getContract();
  const tx = await contract.complete(projectId);
  await tx.wait();
  // const receipt = await tx.wait();
  // console.log('paymentComplete done', receipt);
  // const logs = await contract.queryFilter(
  //   "PaymentDone",
  //   receipt.blockNumber,
  //   receipt.blockNumber
  // );
  // console.log('logs', logs);
  // logs.forEach((log) => {
  //   const args = (log as ethers.EventLog).args;
  //   if (args) {
  //     console.log("Indexed Project ID:", args._projectId); // Indexed
  //     console.log("Amount (USD):", args.amount.toString());
  //     console.log("Refund (USD):", args.refund.toString());
  //     console.log("Project ID:", args.projectId); // Non-indexed
  //   }
  // });
}

export const paymentDoneEventListener = async () => {
  console.log('paymentDoneEventListener');
  const contract = await getContract();
  contract.on('PaymentDone', async (indexedProjectId, amount, refund, projectId, _event) => {
    console.log('PaymentDone event');
    amount = Number(amount) / 10**18;
    refund = Number(refund) / 10**18;
    console.log("Indexed Project ID:", indexedProjectId);
    console.log("Amount (USD):", amount);
    console.log("Refund (USD):", refund);
    console.log("Project ID:", projectId);
    await createCompleteTypePayment(projectId, Number(amount), Number(refund));
  });
}