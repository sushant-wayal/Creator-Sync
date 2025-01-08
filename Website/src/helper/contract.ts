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
}

export const paymentDoneEventListener = async () => {
  console.log('paymentDoneEventListener');
  const contract = await getContract();
  contract.on('PaymentDone', async (amount, refund, projectId, _event) => {
    console.log('PaymentDone', amount, refund, projectId);
    await createCompleteTypePayment(projectId, Number(amount), Number(refund));
  });
}