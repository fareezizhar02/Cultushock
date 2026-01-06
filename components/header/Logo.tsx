import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  isHovered: boolean;
}

export default function Logo({ isHovered }: LogoProps) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src={isHovered ? "/images/logocs.png" : "/images/logocswhite.png"}
        alt="Cultushock"
        width={280}
        height={50}
        priority
        style={{
          height: '50px',
          width: 'auto',
          objectFit: 'contain',
          transition: 'opacity 0.3s'
        }}
      />
    </Link>
  );
}