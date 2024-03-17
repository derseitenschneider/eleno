import Logo from './logo/Logo.component'

export default function LogoText() {
  return (
    <a
      href="https://eleno.net"
      target="_blank"
      className="flex items-center justify-start gap-1 "
    >
      <div className="aspect-auto h-[32px]">
        <Logo />
      </div>
      <p className=" text-xl font-medium tracking-tight text-primary">eleno</p>
    </a>
  )
}
