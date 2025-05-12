import Image from 'next/image';
import React from 'react'

type LogoProps = {
  size: "sm" | "md" | "lg";
  color?: "white" | "black";
  withoutText?: boolean;
}

function AppLogo({ size, color = 'white', withoutText = false }: LogoProps) {
  const sizeMap = {
    sm: { width: 24, height: 24, fontSize: '1rem' },
    md: { width: 48, height: 48, fontSize: '2rem' },
    lg: { width: 72, height: 72, fontSize: '3rem' },
  };

  const { width, height, fontSize } = sizeMap[size];

  return (
    <div className='flex gap-3 items-center'>
        <Image
            width={width}
            height={height}
            src="/images/logo/shuttlecock_new_bg.png"
            alt="Logo"
        />
        {!withoutText && <div style={{ fontSize, color }}>{'ShuttleTime'}</div>}
    </div>
  )
}

export default AppLogo;