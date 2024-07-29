import { cn } from "@/lib/utils";

export const GoogleIcon = (props: { className?: string }) => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="-3 0 262 262"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      className={cn("size-4", props.className)}
    >
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  );
};

export const GithubIcon = (props: { className?: string }) => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={cn("size-4", props.className)}
    >
      <path
        fill="#000000"
        fillRule="evenodd"
        d="M8 1C4.133 1 1 4.13 1 7.993c0 3.09 2.006 5.71 4.787 6.635.35.064.478-.152.478-.337 0-.166-.006-.606-.01-1.19-1.947.423-2.357-.937-2.357-.937-.319-.808-.778-1.023-.778-1.023-.635-.434.048-.425.048-.425.703.05 1.073.72 1.073.72.624 1.07 1.638.76 2.037.582.063-.452.244-.76.444-.935-1.554-.176-3.188-.776-3.188-3.456 0-.763.273-1.388.72-1.876-.072-.177-.312-.888.07-1.85 0 0 .586-.189 1.924.716A6.711 6.711 0 018 4.381c.595.003 1.194.08 1.753.236 1.336-.905 1.923-.717 1.923-.717.382.963.142 1.674.07 1.85.448.49.72 1.114.72 1.877 0 2.686-1.638 3.278-3.197 3.45.251.216.475.643.475 1.296 0 .934-.009 1.688-.009 1.918 0 .187.127.404.482.336A6.996 6.996 0 0015 7.993 6.997 6.997 0 008 1z"
        clipRule="evenodd"
      />
    </svg>
  );
};

const Chart = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 2C3.55228 2 4 2.44772 4 3V19C4 19.5523 4.44772 20 5 20H21C21.5523 20 22 20.4477 22 21C22 21.5523 21.5523 22 21 22H5C3.34315 22 2 20.6569 2 19V3C2 2.44772 2.44772 2 3 2Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 8C7.55228 8 8 8.44772 8 9V17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17V9C6 8.44772 6.44772 8 7 8Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 14C11.5523 14 12 14.4477 12 15V17C12 17.5523 11.5523 18 11 18C10.4477 18 10 17.5523 10 17V15C10 14.4477 10.4477 14 11 14Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 4C15.5523 4 16 4.44772 16 5V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V5C14 4.44772 14.4477 4 15 4Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 10C19.5523 10 20 10.4477 20 11V17C20 17.5523 19.5523 18 19 18C18.4477 18 18 17.5523 18 17V11C18 10.4477 18.4477 10 19 10Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
    </svg>
  );
};

const Calendar = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="4"
        width="20"
        height="18"
        rx="3"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M2 7C2 5.34315 3.34315 4 5 4H19C20.6569 4 22 5.34315 22 7V10H2V7Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2C7.55228 2 8 2.44772 8 3V5C8 5.55228 7.55228 6 7 6C6.44772 6 6 5.55228 6 5V3C6 2.44772 6.44772 2 7 2Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 2C17.5523 2 18 2.44772 18 3V5C18 5.55228 17.5523 6 17 6C16.4477 6 16 5.55228 16 5V3C16 2.44772 16.4477 2 17 2Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
    </svg>
  );
};

const CheckCircle = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M19.3608 5.23093C19.8156 5.7253 20.2213 6.26561 20.5701 6.84411L12.4142 15C11.6332 15.7811 10.3668 15.7811 9.58579 15L6.79289 12.2071C6.40237 11.8166 6.40237 11.1834 6.79289 10.7929C7.18342 10.4024 7.81658 10.4024 8.20711 10.7929L11 13.5858L19.2929 5.2929C19.3148 5.27101 19.3374 5.25036 19.3608 5.23093Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Chip = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="3"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 16C2 15.4477 2.44772 15 3 15H4C4.55228 15 5 15.4477 5 16C5 16.5523 4.55228 17 4 17H3C2.44772 17 2 16.5523 2 16Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 16C19 15.4477 19.4477 15 20 15H21C21.5523 15 22 15.4477 22 16C22 16.5523 21.5523 17 21 17H20C19.4477 17 19 16.5523 19 16Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 11.4477 2.44772 11 3 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H3C2.44772 13 2 12.5523 2 12Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 12C19 11.4477 19.4477 11 20 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H20C19.4477 13 19 12.5523 19 12Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 8C2 7.44772 2.44772 7 3 7H4C4.55228 7 5 7.44772 5 8C5 8.55228 4.55228 9 4 9H3C2.44772 9 2 8.55228 2 8Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 8C19 7.44772 19.4477 7 20 7H21C21.5523 7 22 7.44772 22 8C22 8.55228 21.5523 9 21 9H20C19.4477 9 19 8.55228 19 8Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 2C16.5523 2 17 2.44772 17 3V4C17 4.55228 16.5523 5 16 5C15.4477 5 15 4.55228 15 4V3C15 2.44772 15.4477 2 16 2Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 19C16.5523 19 17 19.4477 17 20V21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V20C15 19.4477 15.4477 19 16 19Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C12.5523 2 13 2.44772 13 3V4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4V3C11 2.44772 11.4477 2 12 2Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 19C12.5523 19 13 19.4477 13 20V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V20C11 19.4477 11.4477 19 12 19Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2C8.55228 2 9 2.44772 9 3V4C9 4.55228 8.55228 5 8 5C7.44772 5 7 4.55228 7 4V3C7 2.44772 7.44772 2 8 2Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 19C8.55228 19 9 19.4477 9 20V21C9 21.5523 8.55228 22 8 22C7.44772 22 7 21.5523 7 21V20C7 19.4477 7.44772 19 8 19Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Clipboard = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="19"
        rx="3"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M14 3C14 1.89543 13.1046 1 12 1C10.8954 1 10 1.89543 10 3H8V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3H14Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 11C7 10.4477 7.44772 10 8 10L16 10C16.5523 10 17 10.4477 17 11C17 11.5523 16.5523 12 16 12L8 12C7.44772 12 7 11.5523 7 11Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 15C7 14.4477 7.44772 14 8 14L12 14C12.5523 14 13 14.4477 13 15C13 15.5523 12.5523 16 12 16L8 16C7.44772 16 7 15.5523 7 15Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Compass = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M10.3512 9.1808L15.4401 7.27247C16.244 6.97101 17.029 7.75604 16.7275 8.55992L14.8192 13.6488C14.6164 14.1896 14.1896 14.6164 13.6488 14.8192L8.55992 16.7275C7.75604 17.029 6.97101 16.244 7.27247 15.4401L9.1808 10.3512C9.38361 9.81036 9.81036 9.38361 10.3512 9.1808Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Database = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16C17.0495 16 21 14.2723 21 12V7H3V12C3 14.2723 6.95053 16 12 16Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 12C21 14.2723 17.0495 16 12 16C6.95053 16 3 14.2723 3 12V17C3 19.2723 6.95053 21 12 21C17.0495 21 21 19.2723 21 17V12Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M21 7.11429C21 9.38654 16.9706 11 12 11C7.02944 11 3 9.38654 3 7.11429C3 4.84203 7.02944 3 12 3C16.9706 3 21 4.84203 21 7.11429Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
    </svg>
  );
};

const Flag = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H10.0263C10.6712 3 11.3119 3.10397 11.9237 3.3079L13.0763 3.6921C13.6881 3.89603 14.3288 4 14.9737 4H18C19.6569 4 21 5.34315 21 7V13C21 14.6569 19.6569 16 18 16H14.9737C14.3288 16 13.6881 15.896 13.0763 15.6921L11.9237 15.3079C11.3119 15.104 10.6712 15 10.0263 15H4C3.44772 15 3 14.5523 3 14V4Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2C4.55228 2 5 2.44772 5 3V21C5 21.5523 4.55228 22 4 22C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const FunnelPagePlaceholder = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      zoomAndPan="magnify"
      viewBox="0 0 1440 809.999993"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
    >
      <defs>
        <clipPath id="f19aabff22">
          <path
            d="M 24.410156 237.574219 L 267.410156 237.574219 L 267.410156 786.273438 L 24.410156 786.273438 Z M 24.410156 237.574219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="774fba0edd">
          <path
            d="M 24.40625 17.925781 L 1418.949219 17.925781 L 1418.949219 211.273438 L 24.40625 211.273438 Z M 24.40625 17.925781 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="c14bc46e9b">
          <path
            d="M 951.316406 237.574219 L 1418.953125 237.574219 L 1418.953125 447.5625 L 951.316406 447.5625 Z M 951.316406 237.574219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="fc27728001">
          <path
            d="M 951.316406 473.8125 L 1418.953125 473.8125 L 1418.953125 511.925781 L 951.316406 511.925781 Z M 951.316406 473.8125 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="51fb5d13a0">
          <path
            d="M 951.316406 528.871094 L 1263.949219 528.871094 L 1263.949219 554.0625 L 951.316406 554.0625 Z M 951.316406 528.871094 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="ee285f2161">
          <path
            d="M 951.316406 571.3125 L 1263.949219 571.3125 L 1263.949219 596.507812 L 951.316406 596.507812 Z M 951.316406 571.3125 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="f0ea2710d2">
          <path
            d="M 300.710938 237.574219 L 917.667969 237.574219 L 917.667969 596.507812 L 300.710938 596.507812 Z M 300.710938 237.574219 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="47018aba58">
          <path
            d="M 320.597656 256.882812 L 468.714844 256.882812 L 468.714844 405 L 320.597656 405 Z M 320.597656 256.882812 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="a9cfaa9a53">
          <path
            d="M 394.65625 256.882812 C 353.753906 256.882812 320.597656 290.039062 320.597656 330.941406 C 320.597656 371.84375 353.753906 405 394.65625 405 C 435.558594 405 468.714844 371.84375 468.714844 330.941406 C 468.714844 290.039062 435.558594 256.882812 394.65625 256.882812 Z M 394.65625 256.882812 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="08a9aa736e">
          <path
            d="M 369.988281 358.6875 L 848.375 358.6875 L 848.375 571.3125 L 369.988281 571.3125 Z M 369.988281 358.6875 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="f7b7fea623">
          <path
            d="M 609.183594 358.6875 L 369.988281 571.3125 L 848.375 571.3125 Z M 609.183594 358.6875 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="cd184ededd">
          <path
            d="M 300.710938 631.613281 L 451.769531 631.613281 L 451.769531 786.273438 L 300.710938 786.273438 Z M 300.710938 631.613281 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b8b7be316d">
          <path
            d="M 484.769531 631.613281 L 743.480469 631.613281 L 743.480469 786.273438 L 484.769531 786.273438 Z M 484.769531 631.613281 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="623e45c433">
          <path
            d="M 766.609375 631.613281 L 917.667969 631.613281 L 917.667969 786.273438 L 766.609375 786.273438 Z M 766.609375 631.613281 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="f118308c68">
          <path
            d="M 950.667969 631.613281 L 1418.300781 631.613281 L 1418.300781 669.726562 L 950.667969 669.726562 Z M 950.667969 631.613281 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="d0cc3d7cb9">
          <path
            d="M 950.667969 686.671875 L 1263.296875 686.671875 L 1263.296875 711.863281 L 950.667969 711.863281 Z M 950.667969 686.671875 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="57697b4ead">
          <path
            d="M 950.667969 729.113281 L 1263.296875 729.113281 L 1263.296875 754.308594 L 950.667969 754.308594 Z M 950.667969 729.113281 "
            clipRule="nonzero"
          />
        </clipPath>
      </defs>
      <g clipPath="url(#f19aabff22)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 24.410156 237.574219 L 267.410156 237.574219 L 267.410156 786.277344 L 24.410156 786.277344 Z M 24.410156 237.574219 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#774fba0edd)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 1418.949219 17.925781 L 1418.949219 211.273438 L 24.40625 211.273438 L 24.40625 17.925781 Z M 1418.949219 17.925781 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#c14bc46e9b)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 951.316406 237.574219 L 1418.953125 237.574219 L 1418.953125 447.5625 L 951.316406 447.5625 Z M 951.316406 237.574219 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#fc27728001)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 951.316406 473.8125 L 1418.953125 473.8125 L 1418.953125 511.925781 L 951.316406 511.925781 Z M 951.316406 473.8125 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#51fb5d13a0)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 951.316406 528.871094 L 1263.949219 528.871094 L 1263.949219 554.0625 L 951.316406 554.0625 Z M 951.316406 528.871094 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#ee285f2161)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 951.316406 571.3125 L 1263.949219 571.3125 L 1263.949219 596.507812 L 951.316406 596.507812 Z M 951.316406 571.3125 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#f0ea2710d2)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 300.710938 237.574219 L 917.667969 237.574219 L 917.667969 596.507812 L 300.710938 596.507812 Z M 300.710938 237.574219 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#47018aba58)">
        <g clipPath="url(#a9cfaa9a53)">
          <path
            className="fill-[#bfbfbf] dark:fill-background"
            d="M 320.597656 256.882812 L 468.714844 256.882812 L 468.714844 405 L 320.597656 405 Z M 320.597656 256.882812 "
            fillOpacity="1"
            fillRule="nonzero"
          />
        </g>
      </g>
      <g clipPath="url(#08a9aa736e)">
        <g clipPath="url(#f7b7fea623)">
          <path
            className="fill-[#bfbfbf] dark:fill-background"
            d="M 848.375 571.3125 L 369.988281 571.3125 L 369.988281 358.6875 L 848.375 358.6875 Z M 848.375 571.3125 "
            fillOpacity="1"
            fillRule="nonzero"
          />
        </g>
      </g>
      <g clipPath="url(#cd184ededd)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 300.710938 631.613281 L 451.769531 631.613281 L 451.769531 786.277344 L 300.710938 786.277344 Z M 300.710938 631.613281 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#b8b7be316d)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 484.769531 631.613281 L 743.480469 631.613281 L 743.480469 786.277344 L 484.769531 786.277344 Z M 484.769531 631.613281 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#623e45c433)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 766.609375 631.613281 L 917.667969 631.613281 L 917.667969 786.277344 L 766.609375 786.277344 Z M 766.609375 631.613281 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#f118308c68)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 950.667969 631.613281 L 1418.300781 631.613281 L 1418.300781 669.726562 L 950.667969 669.726562 Z M 950.667969 631.613281 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#d0cc3d7cb9)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 950.667969 686.671875 L 1263.296875 686.671875 L 1263.296875 711.863281 L 950.667969 711.863281 Z M 950.667969 686.671875 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#57697b4ead)">
        <path
          className="fill-[#d9d9d9] dark:fill-muted"
          d="M 950.667969 729.113281 L 1263.296875 729.113281 L 1263.296875 754.308594 L 950.667969 754.308594 Z M 950.667969 729.113281 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};

const Headphone = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4C7.58172 4 4 7.58172 4 12V13H2V12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V13H20V12C20 7.58172 16.4183 4 12 4Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        d="M6 12H2V18C2 19.6569 3.34315 21 5 21H6C7.65685 21 9 19.6569 9 18V15C9 13.3431 7.65685 12 6 12Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M18 12C16.3431 12 15 13.3431 15 15V18C15 19.6569 16.3431 21 18 21H19C20.6569 21 22 19.6569 22 18V12H18Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
    </svg>
  );
};

const Home = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 11.3361C2 10.4856 2.36096 9.67515 2.99311 9.10622L9.9931 2.80622C11.134 1.7794 12.866 1.7794 14.0069 2.80622L21.0069 9.10622C21.639 9.67515 22 10.4856 22 11.3361V19C22 20.6569 20.6569 22 19 22H16L15.9944 22H8.00558L8 22H5C3.34315 22 2 20.6569 2 19V11.3361Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M9 16C9 14.8954 9.89543 14 11 14H13C14.1046 14 15 14.8954 15 16V22H9V16Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Info = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 11C12.5523 11 13 11.4477 13 12V17.0009C13 17.5532 12.5523 18.0009 12 18.0009C11.4477 18.0009 11 17.5532 11 17.0009V12C11 11.4477 11.4477 11 12 11Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <circle
        cx="12"
        cy="8"
        r="1"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

export const Link = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 9.23858 4.23858 7 7 7H10C10.5523 7 11 7.44772 11 8C11 8.55228 10.5523 9 10 9H7C5.34315 9 4 10.3431 4 12C4 13.6569 5.34315 15 7 15H10C10.5523 15 11 15.4477 11 16C11 16.5523 10.5523 17 10 17H7C4.23858 17 2 14.7614 2 12Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 8C13 7.44772 13.4477 7 14 7H17C19.7614 7 22 9.23858 22 12C22 14.7614 19.7614 17 17 17H14C13.4477 17 13 16.5523 13 16C13 15.4477 13.4477 15 14 15H17C18.6569 15 20 13.6569 20 12C20 10.3431 18.6569 9 17 9H14C13.4477 9 13 8.55228 13 8Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H9C8.44772 13 8 12.5523 8 12Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Lock = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 8V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V8C18.6569 8 20 9.34315 20 11V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V11C4 9.34315 5.34315 8 7 8ZM9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7V8H9V7Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M13 15.7324C13.5978 15.3866 14 14.7403 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 14.7403 10.4022 15.3866 11 15.7324V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V15.7324Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Mail = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="4" width="20" height="16" rx="3" fill="#2F366F" />
      <path
        d="M10.91 12.2915L2 6.5C2 5.11929 3.11929 4 4.5 4H19.5C20.8807 4 22 5.11929 22 6.5L13.09 12.2915C12.4272 12.7223 11.5728 12.7223 10.91 12.2915Z"
        fill="#0094FF"
      />
    </svg>
  );
};

const Messages = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 13C22 14.6569 20.6569 16 19 16H9C7.34315 16 6 14.6569 6 13V7C6 5.34315 7.34315 4 9 4H16L18.8906 2.07293C20.2197 1.18686 22 2.13964 22 3.73703V13Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        d="M2 11C2 9.34315 3.34315 8 5 8H15C16.6569 8 18 9.34315 18 11V17C18 18.6569 16.6569 20 15 20H7L5.24939 21.4005C3.93986 22.4481 2 21.5158 2 19.8388V11Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 14C6 13.4477 6.44772 13 7 13H13C13.5523 13 14 13.4477 14 14C14 14.5523 13.5523 15 13 15H7C6.44772 15 6 14.5523 6 14Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Notification = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="18"
        r="4"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        d="M20.5858 18H3.40408C2.62863 18 2 17.3714 2 16.5959C2 16.2151 2.15471 15.8506 2.42864 15.586L3.45759 14.5922C3.84928 14.2139 4.06977 13.6922 4.06814 13.1476L4.05867 9.9946C4.04543 5.58319 7.61789 2 12.0293 2C16.4314 2 20 5.56859 20 9.97067L20 13.1716C20 13.702 20.2107 14.2107 20.5858 14.5858L21.5858 15.5858C21.851 15.851 22 16.2107 22 16.5858C22 17.3668 21.3668 18 20.5858 18Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
    </svg>
  );
};

const Payment = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="3"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 10H2V8H22V10Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 15C4 14.4477 4.44772 14 5 14H11C11.5523 14 12 14.4477 12 15C12 15.5523 11.5523 16 11 16H5C4.44772 16 4 15.5523 4 15Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Person = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="7"
        r="5"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M3 19V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V19C21 16.2386 18.7614 14 16 14H8C5.23858 14 3 16.2386 3 19Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Pipelines = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.9227 14.118C13.3783 15.2569 14.4814 16.0038 15.7081 16.0038H18.5867L17.7929 15.21C17.4024 14.8195 17.4024 14.1863 17.7929 13.7958C18.1834 13.4053 18.8166 13.4053 19.2071 13.7958L21.352 15.9407C21.9378 16.5265 21.9378 17.4762 21.352 18.062L19.2071 20.207C18.8166 20.5975 18.1834 20.5975 17.7929 20.207C17.4024 19.8165 17.4024 19.1833 17.7929 18.7928L18.5819 18.0038H15.7081C13.6636 18.0038 11.8251 16.759 11.0657 14.8607L9.0773 9.88961C8.62171 8.75064 7.51858 8.00378 6.29187 8.00378H3C2.44772 8.00378 2 7.55607 2 7.00378C2 6.4515 2.44772 6.00378 3 6.00378H6.29187C8.33639 6.00378 10.1749 7.24854 10.9343 9.14683L12.9227 14.118Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M19.2071 3.79302C18.8166 3.40249 18.1834 3.40249 17.7929 3.79301C17.4024 4.18353 17.4024 4.8167 17.7929 5.20722L18.5819 5.99622H15.7081C13.6636 5.99622 11.8251 7.24097 11.0657 9.13926L9.0773 14.1104C8.62171 15.2494 7.51858 15.9962 6.29187 15.9962H3C2.44772 15.9962 2 16.4439 2 16.9962C2 17.5485 2.44772 17.9962 3 17.9962H6.29187C8.33639 17.9962 10.1749 16.7515 10.9343 14.8532L12.9227 9.88204C13.3783 8.74307 14.4814 7.99622 15.7081 7.99622H18.5867L17.7929 8.79005C17.4024 9.18057 17.4024 9.81374 17.7929 10.2043C18.1834 10.5948 18.8166 10.5948 19.2071 10.2042L21.352 8.05928C21.9378 7.47349 21.9378 6.52376 21.352 5.93797L19.2071 3.79302Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Category = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="3"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <rect
        x="3"
        y="13"
        width="8"
        height="8"
        rx="3"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <rect
        x="13"
        y="3"
        width="8"
        height="8"
        rx="3"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <rect
        x="13"
        y="13"
        width="8"
        height="8"
        rx="3"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
    </svg>
  );
};

const Power = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.6324 4.87106C15.8829 4.37946 16.4883 4.17952 16.9491 4.48291C18.3473 5.40341 19.467 6.69989 20.1733 8.23206C21.0196 10.0679 21.2233 12.1353 20.7513 14.101C20.2794 16.0667 19.1594 17.8163 17.5719 19.0678C15.9843 20.3194 14.0216 21 12 21C9.97845 21 8.01575 20.3194 6.42817 19.0679C4.8406 17.8163 3.72061 16.0667 3.24868 14.101C2.77675 12.1353 2.98036 10.068 3.82671 8.23208C4.53305 6.6999 5.65273 5.40343 7.05089 4.48292C7.51172 4.17952 8.11713 4.37947 8.36761 4.87106C8.61809 5.36266 8.41731 5.95874 7.96632 6.27658C6.96389 6.98306 6.1595 7.94424 5.64118 9.06856C4.98273 10.4969 4.82431 12.1053 5.19148 13.6346C5.55864 15.1639 6.42999 16.5251 7.66512 17.4988C8.90025 18.4725 10.4272 19.002 12 19.002C13.5728 19.002 15.0998 18.4725 16.3349 17.4988C17.57 16.5251 18.4414 15.1639 18.8085 13.6346C19.1757 12.1053 19.0173 10.4969 18.3588 9.06854C17.8405 7.94423 17.0361 6.98305 16.0337 6.27657C15.5827 5.95873 15.3819 5.36265 15.6324 4.87106Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C12.5523 2 13 2.44772 13 3V8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8V3C11 2.44772 11.4477 2 12 2Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Receipt = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.6 21.55L10 20.5L11.4 21.55C11.7556 21.8167 12.2444 21.8167 12.6 21.55L14 20.5L15.4 21.55C15.7556 21.8167 16.2444 21.8167 16.6 21.55L18 20.5L19.3598 21.6332C20.0111 22.176 21 21.7128 21 20.865V3.13504C21 2.28721 20.0111 1.82405 19.3598 2.36682L18 3.5L16.6 2.45C16.2444 2.18334 15.7556 2.18334 15.4 2.45L14 3.5L12.6 2.45C12.2444 2.18334 11.7556 2.18334 11.4 2.45L10 3.5L8.6 2.45C8.24444 2.18334 7.75556 2.18334 7.4 2.45L6 3.5L4.64018 2.36682C3.98886 1.82405 3 2.28721 3 3.13504V20.865C3 21.7128 3.98886 22.176 4.64018 21.6332L6 20.5L7.4 21.55C7.75556 21.8167 8.24444 21.8167 8.6 21.55Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 10C7 9.44772 7.44772 9 8 9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H8C7.44772 11 7 10.5523 7 10Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 14C7 13.4477 7.44772 13 8 13H12C12.5523 13 13 13.4477 13 14C13 14.5523 12.5523 15 12 15H8C7.44772 15 7 14.5523 7 14Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Send = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_63_10787)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.1928 6.57843C1.36183 4.08552 3.91013 1.80468 6.29603 2.90587L20.0983 9.27616C22.422 10.3487 22.422 13.6514 20.0983 14.7239L6.29603 21.0941C3.91013 22.1953 1.36184 19.9145 2.19281 17.4216L3.68377 12.9487C3.88904 12.3329 3.88904 11.6672 3.68377 11.0514L2.1928 6.57843Z"
          className={`  fill-[#C8CDD8] text-xl transition-all`}
        />
        <path
          d="M3.66665 13L3.68374 12.9487C3.88901 12.3329 3.88901 11.6672 3.68375 11.0514L3.66663 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H3.66665Z"
          className={`  fill-[#70799A] text-xl transition-all`}
        />
      </g>
      <defs>
        <clipPath id="clip0_63_10787">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Settings = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.99243 4.78709C8.49594 4.50673 8.91192 4.07694 9.09416 3.53021L9.48171 2.36754C9.75394 1.55086 10.5182 1 11.3791 1H12.621C13.4819 1 14.2462 1.55086 14.5184 2.36754L14.906 3.53021C15.0882 4.07694 15.5042 4.50673 16.0077 4.78709C16.086 4.83069 16.1635 4.87553 16.2403 4.92159C16.7349 5.21857 17.3158 5.36438 17.8811 5.2487L19.0828 5.00279C19.9262 4.8302 20.7854 5.21666 21.2158 5.96218L21.8368 7.03775C22.2672 7.78328 22.1723 8.72059 21.6012 9.36469L20.7862 10.2838C20.4043 10.7144 20.2392 11.2888 20.2483 11.8644C20.2498 11.9548 20.2498 12.0452 20.2483 12.1356C20.2392 12.7111 20.4043 13.2855 20.7862 13.7162L21.6012 14.6352C22.1723 15.2793 22.2672 16.2167 21.8368 16.9622L21.2158 18.0378C20.7854 18.7833 19.9262 19.1697 19.0828 18.9971L17.8812 18.7512C17.3159 18.6356 16.735 18.7814 16.2403 19.0784C16.1636 19.1244 16.086 19.1693 16.0077 19.2129C15.5042 19.4933 15.0882 19.9231 14.906 20.4698L14.5184 21.6325C14.2462 22.4491 13.4819 23 12.621 23H11.3791C10.5182 23 9.75394 22.4491 9.48171 21.6325L9.09416 20.4698C8.91192 19.9231 8.49594 19.4933 7.99243 19.2129C7.91409 19.1693 7.83654 19.1244 7.7598 19.0784C7.2651 18.7814 6.68424 18.6356 6.11895 18.7512L4.91726 18.9971C4.07387 19.1697 3.21468 18.7833 2.78425 18.0378L2.16326 16.9622C1.73283 16.2167 1.82775 15.2793 2.39891 14.6352L3.21393 13.7161C3.59585 13.2854 3.7609 12.7111 3.75179 12.1355C3.75035 12.0452 3.75035 11.9548 3.75179 11.8644C3.76091 11.2889 3.59585 10.7145 3.21394 10.2838L2.39891 9.36469C1.82775 8.72059 1.73283 7.78328 2.16326 7.03775L2.78425 5.96218C3.21468 5.21665 4.07387 4.8302 4.91726 5.00278L6.11903 5.24871C6.68431 5.36439 7.26517 5.21857 7.75986 4.9216C7.83658 4.87554 7.91411 4.83069 7.99243 4.78709Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Shield = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6.66228C3 5.37099 3.82629 4.22457 5.05132 3.81623L11.0513 1.81623C11.6671 1.61096 12.3329 1.61096 12.9487 1.81623L18.9487 3.81623C20.1737 4.22457 21 5.37099 21 6.66228V12C21 17.502 15.4398 20.8417 13.0601 22.0192C12.3875 22.3519 11.6125 22.3519 10.9399 22.0192C8.56019 20.8417 3 17.502 3 12V6.66228Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M12 22.2687V1.66229C12.3204 1.66229 12.6408 1.71361 12.9487 1.81624L18.9487 3.81624C20.1737 4.22459 21 5.371 21 6.66229V12C21 17.25 15.9375 20.5313 13.4063 21.8438C13.2847 21.9068 13.1691 21.9652 13.0601 22.0192C12.7238 22.1856 12.3619 22.2687 12 22.2687Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Star = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_56_9997)">
        <path
          d="M10.1109 3.43478C10.7335 1.64366 13.2665 1.64366 13.8891 3.43478L14.8347 6.15493C15.1093 6.94508 15.8467 7.48082 16.683 7.49786L19.5622 7.55653C21.4581 7.59517 22.2409 10.0043 20.7298 11.1499L18.4349 12.8897C17.7683 13.3951 17.4867 14.2619 17.7289 15.0626L18.5628 17.819C19.112 19.634 17.0627 21.1229 15.5062 20.0398L13.1424 18.3949C12.4557 17.9171 11.5443 17.9171 10.8576 18.3949L8.49383 20.0398C6.93734 21.1229 4.88805 19.634 5.43715 17.819L6.27107 15.0626C6.51331 14.2619 6.23165 13.3951 5.56506 12.8897L3.27022 11.1499C1.75915 10.0043 2.54191 7.59517 4.43776 7.55653L7.31697 7.49786C8.15331 7.48082 8.89069 6.94508 9.16535 6.15494L10.1109 3.43478Z"
          className={`  fill-[#C8CDD8] text-xl transition-all`}
        />
      </g>
      <defs>
        <clipPath id="clip0_56_9997">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Tune = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 7C3 6.44772 3.44772 6 4 6L20 6C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8L4 8C3.44772 8 3 7.55228 3 7Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 17C3 16.4477 3.44772 16 4 16L20 16C20.5523 16 21 16.4477 21 17C21 17.5523 20.5523 18 20 18L4 18C3.44772 18 3 17.5523 3 17Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20C11.6569 20 13 18.6569 13 17C13 15.3431 11.6569 14 10 14C8.34315 14 7 15.3431 7 17C7 18.6569 8.34315 20 10 20Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 10C15.6569 10 17 8.65685 17 7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7C11 8.65685 12.3431 10 14 10Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
    </svg>
  );
};

const VideoRecorder = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.8375 7.25891L15 10V14L18.8375 16.7411C20.1613 17.6866 22 16.7404 22 15.1136V8.88638C22 7.25963 20.1613 6.31339 18.8375 7.25891Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <rect
        x="2"
        y="5"
        width="15"
        height="14"
        rx="3"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
    </svg>
  );
};

const Wallet = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 19V9C22 7.34315 20.6569 6 19 6H5V4H2V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        d="M16 14C16 12.8954 16.8954 12 18 12H22V16H18C16.8954 16 16 15.1046 16 14V14Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <path
        d="M4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6H19C19.3506 6 19.6872 6.06015 20 6.17071V3C20 2.44772 19.5523 2 19 2H4Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

const Warning = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.39358 4.57366C10.5445 2.55417 13.4556 2.55417 14.6065 4.57365L21.4115 16.5146C22.5512 18.5146 21.107 21 18.805 21H5.19508C2.89316 21 1.44888 18.5146 2.58862 16.5146L9.39358 4.57366Z"
        className={`  fill-[#C8CDD8] text-xl transition-all`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 14C12.5523 14 13 13.5523 13 13V8.00001C13 7.44772 12.5523 7.00001 12 7.00001C11.4477 7.00001 11 7.44772 11 8.00001V13C11 13.5523 11.4477 14 12 14Z"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
      <circle
        cx="12"
        cy="17"
        r="1"
        className={`  fill-[#70799A] text-xl transition-all`}
      />
    </svg>
  );
};

export const Icons = {
  github: <GithubIcon />,
  google: <GoogleIcon />,
  settings: <Settings />,
  chart: <Chart />,
  calendar: <Calendar />,
  check: <CheckCircle />,
  chip: <Chip />,
  compass: <Compass />,
  database: <Database />,
  flag: <Flag />,
  home: <Home />,
  info: <Info />,
  link: <Link />,
  lock: <Lock />,
  messages: <Messages />,
  notification: <Notification />,
  payment: <Payment />,
  power: <Power />,
  receipt: <Receipt />,
  shield: <Shield />,
  star: <Star />,
  tune: <Tune />,
  videorecorder: <VideoRecorder />,
  wallet: <Wallet />,
  warning: <Warning />,
  headphone: <Headphone />,
  send: <Send />,
  pipelines: <Pipelines />,
  person: <Person />,
  category: <Category />,
  contact: <Mail />,
  clipboard: <Clipboard />,
  funnelPagePlaceholder: <FunnelPagePlaceholder />,
};
