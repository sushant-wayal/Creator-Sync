import { ethers } from 'ethers';
import { paymentContractAbi } from '@/constants';

const { PAYMENT_CONTRACT_ADDRESS } = process.env;

export const contract = async () => {
  if (!window.ethereum) {
    throw new Error('No ethereum provider found');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  if (!PAYMENT_CONTRACT_ADDRESS) {
    throw new Error('PAYMENT_CONTRACT_ADDRESS is not defined');
  }
  const contract = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, paymentContractAbi, signer);
  return contract;
}