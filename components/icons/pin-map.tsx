import { FC } from "react"

type Props = {
  className?: string;
}

export const PinMapIcon: FC<Props> = (props) => {
  return (
    <svg fill="none" className={props.className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M12,2 C16.9705627,2 21,5.98572446 21,10.9023647 C21,14.1558559 18.2776716,17.5957933 12.9482526,21.3431516 L12,22 L11.4277959,21.6050955 C5.85042064,17.7558913 3,14.2315185 3,10.9023647 C3,5.98572446 7.02943725,2 12,2 Z M12,3.97830328 C8.13400675,3.97830328 5,7.07831119 5,10.9023647 C5,13.3048538 7.29671943,16.236445 12,19.5818284 C16.7032806,16.236445 19,13.3048538 19,10.9023647 C19,7.07831119 15.8659932,3.97830328 12,3.97830328 Z M12,6 C14.209139,6 16,7.790861 16,10 C16,12.209139 14.209139,14 12,14 C9.790861,14 8,12.209139 8,10 C8,7.790861 9.790861,6 12,6 Z M12,8 C10.8954305,8 10,8.8954305 10,10 C10,11.1045695 10.8954305,12 12,12 C13.1045695,12 14,11.1045695 14,10 C14,8.8954305 13.1045695,8 12,8 Z"/>
    </svg>
  );
}
