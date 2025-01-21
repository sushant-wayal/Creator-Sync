# Creator-Sync

Creator-Sync is a decentralized application built with Next.js and Solidity that connects video creators with editors for efficient collaboration and streamlined payments. Leveraging blockchain technology, it ensures secure transactions and transparent project management.

## Features

* **Project Creation:** Creators can easily create projects, specifying details like title, description, type, budget, deadline, and upload raw footage.
* **Editor Discovery:** A platform for discovering and selecting editors based on their ratings, skills, and availability.  Creators can also search for editors based on their username or skills.
* **Detailed Instructions:**  Creators provide detailed instructions, categorized as compulsory or optional, ensuring clear communication with the editor.
* **Secure Payments:**  Payments are handled securely using smart contracts, guaranteeing timely compensation for editors upon project completion.  The contract enforces penalties for late submissions and manages refunds as needed.
* **Deadline Management:** Creators can extend project deadlines, and the system automatically calculates penalties for overdue projects.
* **Project Tracking:** Monitor project progress, manage revisions, and communicate with the editor directly through the platform.
* **Annotation System:** Creators can add time-stamped annotations to their videos allowing for precise feedback and easier collaboration with editors.
* **YouTube Integration:**  Streamlined YouTube upload process directly from the platform after payment completion.


## Tech Stack

* **Frontend:** Next.js 14
* **Styling:** Tailwind CSS, Radix UI
* **Database:** PostgreSQL, Prisma
* **Blockchain:** Solidity, Forge, Hardhat, Ethers.js
* **State Management:** Zustand, Jotai, React Query, React Hook Form
* **Authentication:** NextAuth.js
* **Testing:** Foundry
* **File Storage:** Cloudflare EdgeStore

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/creator-sync.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables: Refer to `.env.example` for required variables.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome!  Please open an issue or submit a pull request.


## License

MIT
