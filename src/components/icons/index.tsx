export const Icons = {
  reactLogo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      data-testid="react-logo-svg"
      className={`animate-spin-slow-5s ${props.className}`}
      width={props.width}
      height={props.height}
      viewBox={props.viewBox || '0 0 64 64'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="32" cy="32" r="8" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="3" fill="none">
        <ellipse rx="24" ry="10" cx="32" cy="32" />
        <ellipse rx="24" ry="10" cx="32" cy="32" transform="rotate(60 32 32)" />
        <ellipse rx="24" ry="10" cx="32" cy="32" transform="rotate(120 32 32)" />
      </g>
    </svg>
  ),
  mail: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={props.viewBox || '0 0 20 20'} {...props}>
      <title>Mail</title>
      <path
        fill="currentColor"
        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
      ></path>
      <path fill="currentColor" d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
    </svg>
  ),
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={props.viewBox || '0 0 24 24'} {...props}>
      <title>Gmail</title>
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  ),
};
