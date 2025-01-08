"use client";

import { getPayments } from "@/actions/payment";
import { ETHtoUSD } from "@/actions/requestEdit";
import { updateAccountAddress } from "@/actions/user";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Tabs, TabsTrigger } from "@/Components/ui/tabs";
import { connectWallet, paymentDoneEventListener } from "@/helper/contract";
import { Payment as ImportedPayment, PaymentStatus } from "@prisma/client";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { formatDistanceToNow } from "date-fns";
import { ethers } from "ethers";
import { Coins, Loader, Network, Wallet } from "lucide-react"
import { useEffect, useState } from "react";
import { paymentContractAddress } from "@/constants";

interface ConnectWalletButtonProps {
  initialAddress?: string;
}

interface Payment extends ImportedPayment {
  project: {
    title: string;
  },
  user: {
    accountAddress: string | null;
  }
}

const demoPayments: Payment[] = [
  {
    id: "1",
    amount: 1,
    userId: "1",
    projectId: "1",
    type: "CREATE",
    status: PaymentStatus.PENDING,
    penalty: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    currency: "ETH",
    project: {
      title: "Project 1"
    },
    user: {
      accountAddress: "0x1234567890"
    }
  },
  {
    id: "2",
    amount: 2,
    userId: "1",
    projectId: "2",
    type: "EXTEND_DEADLINE",
    status: PaymentStatus.COMPLETED,
    penalty: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    currency: "ETH",
    project: {
      title: "Project 2"
    },
    user: {
      accountAddress: "0x1234567890"
    }
  },
  {
    id: "3",
    amount: 3,
    userId: "1",
    projectId: "3",
    type: "COMPLETE",
    status: PaymentStatus.PENDING,
    penalty: 0,
    updatedAt: new Date(),
    createdAt: new Date(),
    currency: "ETH",
    project: {
      title: "Project 3"
    },
    user: {
      accountAddress: "0x1234567890"
    }
  },
  {
    id: "4",
    amount: 4,
    userId: "1",
    projectId: "4",
    type: "CREATE",
    status: PaymentStatus.COMPLETED,
    penalty: 0,
    updatedAt: new Date(),
    createdAt: new Date(),
    currency: "ETH",
    project: {
      title: "Project 4"
    },
    user: {
      accountAddress: "0x1234567890"
    }
  },
  {
    id: "5",
    amount: 5,
    userId: "1",
    projectId: "5",
    type: "EXTEND_DEADLINE",
    status: PaymentStatus.PENDING,
    penalty: 0,
    updatedAt: new Date(),
    createdAt: new Date(),
    currency: "ETH",
    project: {
      title: "Project 5"
    },
    user: {
      accountAddress: "0x1234567890"
    }
  },
  {
    id: "6",
    amount: 6,
    userId: "1",
    projectId: "6",
    type: "COMPLETE",
    status: PaymentStatus.COMPLETED,
    penalty: 0,
    updatedAt: new Date(),
    createdAt: new Date(),
    currency: "ETH",
    project: {
      title: "Project 6"
    },
    user: {
      accountAddress: "0x1234567890"
    }
  },
]

const paymentComponent = (payment: Payment) => {
  const fromAddress = payment.amount > 0 ? paymentContractAddress : payment.user.accountAddress;
  const toAddress = payment.amount > 0 ? payment.user.accountAddress : paymentContractAddress;
  return (
    <div key={payment.id} className="w-full flex flex-col gap-1 items-start justify-center border-gray-200 rounded-lg p-3 border-[1px]">
      <div className="w-full flex items-center justify-between">
        <div>
          <p className="font-semibold">{payment.project.title}</p>
          <p className="text-muted-foreground text-xs">{formatDistanceToNow(payment.updatedAt)} ago</p>
        </div>
        <Badge variant={payment.status == PaymentStatus.COMPLETED ? "default" : payment.status == PaymentStatus.PENDING ? "secondary" : "destructive"}>
          <p className="text-xs">{payment.status.split('_').map(word => word[0] + word.slice(1).toLowerCase()).join(' ')}</p>
        </Badge>
      </div>
      <div className="flex items-center justify-between w-full">
        {fromAddress && toAddress && <p className="text-sm font-semibold text-gray-400">{fromAddress.slice(0, 7)}...{fromAddress.slice(-5)} → {toAddress.slice(0, 7)}...{toAddress.slice(-5)}</p>}
        <Badge variant={payment.amount > 0 ? "default" : "secondary"}>
          <p className="text-xs">{payment.amount} {payment.currency}</p>
        </Badge>
      </div>
      <Badge variant="outline">
        <p className="text-xs">{payment.type.split('_').map(word => word[0] + word.slice(1).toLowerCase()).join(' ')}</p>
      </Badge>
    </div>
  )
}

export const ConnectWalletButton : React.FC<ConnectWalletButtonProps> = ({ initialAddress }) => {

  const [address, setAddress] = useState(initialAddress);
  const [chainName, setChainName] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [balanceInUsd, setBalanceInUsd] = useState<number | undefined>(undefined);
  const [loadingBalanceInUsd, setLoadingBalanceInUsd] = useState<boolean>(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(true);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    if (initialAddress) {
      const getBalance = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(initialAddress);
        const balanceInEth = ethers.formatEther(balance);
        setBalance(Number(balanceInEth));
      }
      getBalance();
    }
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setAddress(undefined);
        setBalance(undefined);
        await updateAccountAddress(null);
        return;
      }
      setAddress(accounts[0]);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const balanceInEth = ethers.formatEther(balance);
      setBalance(Number(balanceInEth));
      await updateAccountAddress(accounts[0]);
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.off('accountsChanged', handleAccountsChanged);
    }
  }, [])

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    paymentDoneEventListener();
  }, [])

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    const getChainName = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainName(network.name);
    }
    getChainName();
  }, [])

  useEffect(() => {
    if (balance) {
      const getBalanceInUsd = async () => {
        setLoadingBalanceInUsd(true);
        const balanceInUsd = await ETHtoUSD(balance);
        setBalanceInUsd(Number(balanceInUsd));
        setLoadingBalanceInUsd(false);
      }
      getBalanceInUsd();
    }
  }, [balance])

  const handleOpenChange = async (open : boolean) => {
    if (open) {
      setLoadingPayments(true);
      const payments = await getPayments();
      // const payments = demoPayments;
      setPayments(payments);
      setLoadingPayments(false);
    }
  }

  return (
    <>
      {address ?
      <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="flex justify-center items-center gap-2 font-semibold w-fit"
          >
            <Wallet className="h-5 w-5"/>
            {address.slice(0, 7)}...{address.slice(-5)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[400px] mx-5 z-[999] p-3">
          <DropdownMenuLabel className="w-full flex justify-between items-center">
            <div className="flex flex-col justify-between items-start">
              <p className="text-sm font-medium">Wallet Connected</p>
              <p className="text-xs text-muted-foreground">{address.slice(0, 7)}...{address.slice(-5)}</p>
            </div>
            <Badge variant="outline" className="flex gap-1 items-center">
              <Network size={16}/>
              <p className="text-sm">{chainName}</p>
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-3"/>
          <div className="rounded-lg border bg-gray-100 p-3 flex justify-between items-center">
            <div className="flex gap-1 justify-center items-center">
              <Coins className="h-5 w-5"/>
              <p className="font-medium">Balance</p>
            </div>
            <div className="flex flex-col items-center justify-between gap-1">
              <p className="font-semibold text-2xl">{balance?.toFixed(3)} ETH</p>
              {loadingBalanceInUsd ? 
                <Loader className="h-5 w-5 animate-spin"/>
              :
                <p className="text-muted-foreground">≈ ${balanceInUsd} USD</p>
              }
            </div>
          </div>
          <DropdownMenuSeparator className="my-3"/>
          <Tabs defaultValue="all">
            <TabsList className="w-full flex gap-2 justify-center items-center mb-3 bg-gray-100 py-2 rounded-lg">
              <TabsTrigger value="all" className="font-semibold">All</TabsTrigger>
              <TabsTrigger value="create" className="font-semibold">Create</TabsTrigger>
              <TabsTrigger value="extend_deadline" className="font-semibold">Extend Deadline</TabsTrigger>
              <TabsTrigger value="complete" className="font-semibold">Complete</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="px-3 flex flex-col gap-2 max-h-[350px] overflow-y-auto">
              {loadingPayments ?
                <Loader className="h-5 w-5 animate-spin"/>
              :
                payments.length > 0 ?
                  payments.map(paymentComponent)
                :
                  <p className="text-muted-foreground w-full text-center text-xl">No payments</p>
              }
            </TabsContent>
            <TabsContent value="create" className="px-3 flex flex-col gap-2 max-h-[350px] overflow-y-auto">
              {loadingPayments ?
                <Loader className="h-5 w-5 animate-spin"/>
              :
                payments.filter(payment => payment.type === "CREATE").length > 0 ?
                  payments.filter(payment => payment.type === "CREATE").map(paymentComponent)
                :
                  <p className="text-muted-foreground w-full text-center text-xl">No create payments</p>
              }
            </TabsContent>
            <TabsContent value="extend_deadline" className="px-3 flex flex-col gap-2 max-h-[350px] overflow-y-auto">
              {loadingPayments ?
                <Loader className="h-5 w-5 animate-spin"/>
              :
                payments.filter(payment => payment.type === "EXTEND_DEADLINE").length > 0 ?
                  payments.filter(payment => payment.type === "EXTEND_DEADLINE").map(paymentComponent)
                :
                  <p className="text-muted-foreground w-full text-center text-xl">No extend deadline payments</p>
              }
            </TabsContent>
            <TabsContent value="complete" className="px-3 flex flex-col gap-2 max-h-[350px] overflow-y-auto">
              {loadingPayments ?
                <Loader className="h-5 w-5 animate-spin"/>
              :
                payments.filter(payment => payment.type === "COMPLETE").length > 0 ?
                  payments.filter(payment => payment.type === "COMPLETE").map(paymentComponent)
                :
                  <p className="text-muted-foreground w-full text-center text-xl">No complete payments</p>
              }
            </TabsContent>
          </Tabs>
        </DropdownMenuContent>
      </DropdownMenu>
        :        
      <Button
        variant="default"
        className="flex justify-center items-center gap-2 font-semibold w-fit"
        onClick={async () => setAddress(await connectWallet())}
      >
        <Wallet className="h-5 w-5"/>
        Connect Wallet
      </Button>}
    </>
  )
}