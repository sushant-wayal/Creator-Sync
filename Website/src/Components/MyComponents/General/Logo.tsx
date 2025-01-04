import { Handshake } from "lucide-react"

interface LogoProps {
  size: number;
  className?: string;
}

export const Logo : React.FC<LogoProps> = ({ size, className }) => {
  return (
    <Handshake size={size} className={className}/>
  )
}