import { getNotifications } from "@/actions/notification";
import { Notifications } from "@/Components/MyComponents/Client/Notifications";
import { websiteName } from "@/constants";
import { NotificationType, UserProjectRole } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Notifications | ${websiteName}`,
  description: "View your notifications.",
};

const demoNotifications = 
[
  {
    id: "1",
    title: "Project Update",
    message: "Your project has been updated.",
    type: NotificationType.PROJECT_UPDATE,
    senderProjectRole: UserProjectRole.EDITOR,
    createdAt: new Date(),
    read: false,
    from: {
      name: "John Doe",
      profilePicture: null,
    },
    project: {
      title: "Project Alpha",
    },
    projectId: "project-1",
  },
  {
    id: "2",
    title: "Instruction Update",
    message: "New instructions have been added to your project.",
    type: NotificationType.INSTRUCTION_UPDATE,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: false,
    from: {
      name: "Jane Smith",
      profilePicture: "https://example.com/profile.jpg",
    },
    project: {
      title: "Project Beta",
    },
    projectId: "project-2",
  },
  {
    id: "3",
    title: "Deadline Extended",
    message: "The deadline for your project has been extended.",
    type: NotificationType.DEADLINE_EXTENDED,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: true,
    from: {
      name: "Alice Johnson",
      profilePicture: null,
    },
    project: {
      title: "Project Gamma",
    },
    projectId: "project-3",
  },
  {
    id: "4",
    title: "Request Deadline Extension",
    message: "User Bob Brown has requested a deadline extension of 3 days.",
    type: NotificationType.REQUEST_DEADLINE_EXTENSION,
    senderProjectRole: UserProjectRole.EDITOR,
    createdAt: new Date(),
    read: false,
    from: {
      name: "Bob Brown",
      profilePicture: "https://example.com/profile2.jpg",
    },
    project: {
      title: "Project Delta",
    },
    projectId: "project-4",
  },
  {
    id: "5",
    title: "Request Edit",
    message: "User Charlie Davis has requested an edit.",
    type: NotificationType.REQUEST_EDIT,
    senderProjectRole: UserProjectRole.EDITOR,
    createdAt: new Date(),
    read: true,
    from: {
      name: "Charlie Davis",
      profilePicture: null,
    },
    project: {
      title: "Project Epsilon",
    },
    projectId: "project-5",
  },
  {
    id: "6",
    title: "Request Editor",
    message: "User Diana Evans has requested to be an editor.",
    type: NotificationType.REQUEST_EDITOR,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: false,
    from: {
      name: "Diana Evans",
      profilePicture: "https://example.com/profile3.jpg",
    },
    project: {
      title: "Project Zeta",
    },
    projectId: "project-6",
  },
  {
    id: "7",
    title: "Accept Request Edit",
    message: "User Evan Foster has accepted your edit request.",
    type: NotificationType.ACCEPT_REQUEST_EDIT,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: true,
    from: {
      name: "Evan Foster",
      profilePicture: null,
    },
    project: {
      title: "Project Eta",
    },
    projectId: "project-7",
  },
  {
    id: "8",
    title: "Accept Request Editor",
    message: "User Fiona Green has accepted your editor request.",
    type: NotificationType.ACCEPT_REQUEST_EDITOR,
    senderProjectRole: UserProjectRole.EDITOR,
    createdAt: new Date(),
    read: false,
    from: {
      name: "Fiona Green",
      profilePicture: "https://example.com/profile4.jpg",
    },
    project: {
      title: "Project Theta",
    },
    projectId: "project-8",
  },
  {
    id: "9",
    title: "Completed Project",
    message: "Your project has been completed.",
    type: NotificationType.COMPLETED_PROJECT,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: true,
    from: {
      name: "George Harris",
      profilePicture: null,
    },
    project: {
      title: "Project Iota",
    },
    projectId: "project-9",
  },
  {
    id: "10",
    title: "Rating",
    message: "You have received a rating.",
    type: NotificationType.RATING,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: false,
    from: {
      name: "Hannah Johnson",
      profilePicture: "https://example.com/profile5.jpg",
    },
    project: {
      title: "Project Kappa",
    },
    projectId: "project-10",
  },
  {
    id: "11",
    title: "Payment",
    message: "You have received a payment.",
    type: NotificationType.PAYMENT,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: true,
    from: {
      name: "Ian King",
      profilePicture: null,
    },
    project: {
      title: "Project Lambda",
    },
    projectId: "project-11",
  },
  {
    id: "12",
    title: "Email Verification",
    message: "Please verify your email address.",
    type: NotificationType.EMAIL_VERIFICATION,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: false,
    from: {
      name: "Jack Lee",
      profilePicture: "https://example.com/profile6.jpg",
    }
  },
  {
    id: "13",
    title: "Password Reset",
    message: "Your password has been reset.",
    type: NotificationType.PASSWORD_RESET,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: true,
    from: {
      name: "Karen Miller",
      profilePicture: null,
    }
  },
  {
    id: "14",
    title: "YouTube Refresh",
    message: "Your YouTube data has been refreshed.",
    type: NotificationType.YOUTUBE_REFRESH,
    senderProjectRole: UserProjectRole.CREATOR,
    createdAt: new Date(),
    read: false,
    from: {
      name: "Liam Nelson",
      profilePicture: "https://example.com/profile7.jpg",
    },
  },
]

const NotificationsPage = async () => {
  const notifications = await getNotifications();
  // const notifications = demoNotifications;
  return (
    <Notifications notifications={notifications} />
  );
};

export default NotificationsPage;